import axios from 'axios';
import type {AttendanceRecord, SyncConfig, SyncQueueItem} from '../types';
import {
  appendSyncHistory,
  getPendingSyncRecords,
  getSyncQueue,
  markRecordsSyncedAndPurge,
  updateSyncQueueItem,
} from './database';
import {createId, wait} from '../utils/helpers';

const MAX_RETRY = 3;

const nextBackoff = (retryCount: number): number => 500 * 2 ** retryCount;

const touchQueueFailure = async (queueItem: SyncQueueItem): Promise<void> => {
  const retryCount = queueItem.retryCount + 1;
  await updateSyncQueueItem({
    ...queueItem,
    status: retryCount >= MAX_RETRY ? 'failed' : 'pending',
    retryCount,
    lastAttempt: new Date().toISOString(),
  });
  await wait(nextBackoff(queueItem.retryCount));
};

export const syncPendingAttendance = async (
  config: SyncConfig,
  online: boolean,
): Promise<{syncedCount: number; success: boolean}> => {
  if (!online || !config.endpoint) {
    return {syncedCount: 0, success: false};
  }

  const pending = await getPendingSyncRecords();
  if (!pending.length) {
    return {syncedCount: 0, success: true};
  }

  const queue = await getSyncQueue();
  const pendingById = new Map<string, AttendanceRecord>(pending.map(record => [record.id, record]));

  const batch = queue
    .filter(item => item.status !== 'failed' && pendingById.has(item.recordId))
    .map(item => ({item, record: pendingById.get(item.recordId)!}));

  const toSync = batch.map(entry => entry.record);

  try {
    await axios.post(
      config.endpoint,
      {records: toSync, source: 'FaceCap'},
      {
        timeout: 5000,
        headers: {
          ...(config.apiKey ? {'x-api-key': config.apiKey} : {}),
          'content-type': 'application/json',
        },
      },
    );

    await markRecordsSyncedAndPurge(toSync.map(record => record.id));
    await appendSyncHistory({
      id: createId('history'),
      syncedAt: new Date().toISOString(),
      recordsCount: toSync.length,
      status: 'success',
    });

    return {syncedCount: toSync.length, success: true};
  } catch (_error) {
    await Promise.all(batch.map(entry => touchQueueFailure(entry.item)));
    await appendSyncHistory({
      id: createId('history'),
      syncedAt: new Date().toISOString(),
      recordsCount: toSync.length,
      status: 'failure',
    });
    return {syncedCount: 0, success: false};
  }
};

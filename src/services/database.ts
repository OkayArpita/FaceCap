import type {AttendanceRecord, SyncHistoryItem, SyncQueueItem, User} from '../types';
import {STORAGE_KEYS} from '../utils/constants';
import {createId} from '../utils/helpers';
import {readJson, removeKey, writeJson} from '../utils/storage';

const sqliteStatements = {
  createUsersTableSQL: `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, faceEncodingHash TEXT NOT NULL, enrollmentDate TEXT NOT NULL);`,
  createAttendanceTableSQL: `CREATE TABLE IF NOT EXISTS attendance_records (id TEXT PRIMARY KEY, userId TEXT NOT NULL, timestamp TEXT NOT NULL, confidence REAL NOT NULL, syncedToAWS INTEGER NOT NULL);`,
  createSyncQueueTableSQL: `CREATE TABLE IF NOT EXISTS sync_queue (id TEXT PRIMARY KEY, recordId TEXT NOT NULL, status TEXT NOT NULL, lastAttempt TEXT, retryCount INTEGER NOT NULL DEFAULT 0);`,
};
export const SQLITE_SCHEMA_STATEMENTS = sqliteStatements;

export const initializeDatabase = async (): Promise<void> => {
  await Promise.all([
    readJson<User[]>(STORAGE_KEYS.users, []),
    readJson<AttendanceRecord[]>(STORAGE_KEYS.attendance, []),
    readJson<SyncQueueItem[]>(STORAGE_KEYS.syncQueue, []),
    readJson<SyncHistoryItem[]>(STORAGE_KEYS.syncHistory, []),
  ]);
};

export const getUsers = async (): Promise<User[]> =>
  readJson<User[]>(STORAGE_KEYS.users, []);

export const createUser = async (name: string, faceEncodingHash: string): Promise<User> => {
  const users = await getUsers();
  const newUser: User = {
    id: createId('user'),
    name,
    faceEncodingHash,
    enrollmentDate: new Date().toISOString(),
  };
  await writeJson(STORAGE_KEYS.users, [newUser, ...users]);
  return newUser;
};

export const addAttendanceRecord = async (
  userId: string,
  confidence: number,
): Promise<AttendanceRecord> => {
  const attendance = await readJson<AttendanceRecord[]>(STORAGE_KEYS.attendance, []);
  const syncQueue = await readJson<SyncQueueItem[]>(STORAGE_KEYS.syncQueue, []);

  const record: AttendanceRecord = {
    id: createId('att'),
    userId,
    timestamp: new Date().toISOString(),
    confidence,
    syncedToAWS: false,
  };

  const queueItem: SyncQueueItem = {
    id: createId('queue'),
    recordId: record.id,
    status: 'pending',
    retryCount: 0,
  };

  await writeJson(STORAGE_KEYS.attendance, [record, ...attendance]);
  await writeJson(STORAGE_KEYS.syncQueue, [queueItem, ...syncQueue]);
  return record;
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> =>
  readJson<AttendanceRecord[]>(STORAGE_KEYS.attendance, []);

export const getPendingSyncRecords = async (): Promise<AttendanceRecord[]> => {
  const attendance = await getAttendanceRecords();
  return attendance.filter(item => !item.syncedToAWS);
};

export const getSyncQueue = async (): Promise<SyncQueueItem[]> =>
  readJson<SyncQueueItem[]>(STORAGE_KEYS.syncQueue, []);

export const updateSyncQueueItem = async (item: SyncQueueItem): Promise<void> => {
  const queue = await getSyncQueue();
  const updated = queue.map(q => (q.id === item.id ? item : q));
  await writeJson(STORAGE_KEYS.syncQueue, updated);
};

export const markRecordsSyncedAndPurge = async (recordIds: string[]): Promise<void> => {
  const attendance = await getAttendanceRecords();
  const queue = await getSyncQueue();

  const remainingAttendance = attendance.filter(record => !recordIds.includes(record.id));
  const remainingQueue = queue.filter(item => !recordIds.includes(item.recordId));

  await writeJson(STORAGE_KEYS.attendance, remainingAttendance);
  await writeJson(STORAGE_KEYS.syncQueue, remainingQueue);
};

export const appendSyncHistory = async (entry: SyncHistoryItem): Promise<void> => {
  const history = await readJson<SyncHistoryItem[]>(STORAGE_KEYS.syncHistory, []);
  await writeJson(STORAGE_KEYS.syncHistory, [entry, ...history]);
};

export const getSyncHistory = async (): Promise<SyncHistoryItem[]> =>
  readJson<SyncHistoryItem[]>(STORAGE_KEYS.syncHistory, []);

export const clearAllLocalData = async (): Promise<void> => {
  await Promise.all([
    removeKey(STORAGE_KEYS.users),
    removeKey(STORAGE_KEYS.attendance),
    removeKey(STORAGE_KEYS.syncQueue),
    removeKey(STORAGE_KEYS.syncHistory),
  ]);
};

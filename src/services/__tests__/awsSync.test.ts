import axios from 'axios';
import {
  addAttendanceRecord,
  clearAllLocalData,
  createUser,
  getAttendanceRecords,
  getSyncQueue,
  getSyncHistory,
} from '../database';
import {syncPendingAttendance} from '../awsSync';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('aws sync service', () => {
  beforeEach(async () => {
    mockedAxios.post.mockReset();
    await clearAllLocalData();
  });

  it('syncs and purges on success', async () => {
    mockedAxios.post.mockResolvedValue({status: 200} as never);

    const user = await createUser('Karan', 'hash');
    await addAttendanceRecord(user.id, 91.5);

    const result = await syncPendingAttendance(
      {
        endpoint: 'https://example.com/sync',
        apiKey: 'abc',
        bucketName: 'bucket',
        autoSync: true,
      },
      true,
    );

    const [attendance, history] = await Promise.all([getAttendanceRecords(), getSyncHistory()]);
    expect(result.success).toBe(true);
    expect(result.syncedCount).toBe(1);
    expect(attendance).toHaveLength(0);
    expect(history[0].status).toBe('success');
  });

  it('does not sync when offline', async () => {
    const result = await syncPendingAttendance(
      {
        endpoint: 'https://example.com/sync',
        apiKey: '',
        bucketName: 'bucket',
        autoSync: true,
      },
      false,
    );

    expect(result.success).toBe(false);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('keeps record and updates queue retries on API failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('network'));

    const user = await createUser('Maya', 'hash');
    await addAttendanceRecord(user.id, 95.2);

    const result = await syncPendingAttendance(
      {
        endpoint: 'https://example.com/sync',
        apiKey: '',
        bucketName: 'bucket',
        autoSync: true,
      },
      true,
    );

    const [attendance, queue, history] = await Promise.all([
      getAttendanceRecords(),
      getSyncQueue(),
      getSyncHistory(),
    ]);

    expect(result.success).toBe(false);
    expect(attendance).toHaveLength(1);
    expect(queue[0].retryCount).toBe(1);
    expect(history[0].status).toBe('failure');
  });
});

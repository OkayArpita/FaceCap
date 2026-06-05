import {
  addAttendanceRecord,
  clearAllLocalData,
  createUser,
  getAttendanceRecords,
  getPendingSyncRecords,
  getSyncQueue,
  getUsers,
} from '../database';

describe('database service', () => {
  beforeEach(async () => {
    await clearAllLocalData();
  });

  it('creates a user and stores attendance with queue item', async () => {
    const user = await createUser('Riya', 'hash123');
    await addAttendanceRecord(user.id, 92.1);

    const [users, attendance, pending, queue] = await Promise.all([
      getUsers(),
      getAttendanceRecords(),
      getPendingSyncRecords(),
      getSyncQueue(),
    ]);

    expect(users).toHaveLength(1);
    expect(attendance).toHaveLength(1);
    expect(pending).toHaveLength(1);
    expect(queue).toHaveLength(1);
    expect(attendance[0].syncedToAWS).toBe(false);
  });
});

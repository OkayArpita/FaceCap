export type ChallengeType = 'blink' | 'smile' | 'turn';

export interface User {
  id: string;
  name: string;
  faceEncodingHash: string;
  enrollmentDate: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  timestamp: string;
  confidence: number;
  syncedToAWS: boolean;
}

export interface SyncQueueItem {
  id: string;
  recordId: string;
  status: 'pending' | 'synced' | 'failed';
  lastAttempt?: string;
  retryCount: number;
}

export interface SyncHistoryItem {
  id: string;
  syncedAt: string;
  recordsCount: number;
  status: 'success' | 'failure';
}

export interface SyncConfig {
  endpoint: string;
  apiKey: string;
  bucketName: string;
  autoSync: boolean;
}

export interface LivenessState {
  challenge: ChallengeType;
  completed: boolean;
}

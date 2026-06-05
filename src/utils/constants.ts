import {ChallengeType} from '../types';

export const colors = {
  background: '#0b1220',
  surface: '#162033',
  accent: '#4cc9f0',
  success: '#2ecc71',
  warning: '#f1c40f',
  danger: '#e74c3c',
  textPrimary: '#f8fafc',
  textMuted: '#94a3b8',
};

export const livenessChallenges: ChallengeType[] = ['blink', 'smile', 'turn'];

export const challengeInstructions: Record<ChallengeType, string> = {
  blink: 'Blink 3-4 times',
  smile: 'Hold a smile for 1 second',
  turn: 'Turn head 30° left and 30° right',
};

export const STORAGE_KEYS = {
  users: 'facecap.users',
  attendance: 'facecap.attendance',
  syncQueue: 'facecap.syncQueue',
  syncConfig: 'facecap.syncConfig',
  syncHistory: 'facecap.syncHistory',
};

export const DEFAULT_SYNC_CONFIG = {
  endpoint: 'https://example.execute-api.ap-south-1.amazonaws.com/prod/attendance',
  apiKey: '',
  bucketName: 'facecap-hackathon-bucket',
  autoSync: true,
};

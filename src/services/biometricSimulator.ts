import {ChallengeType} from '../types';
import {createId, randomConfidence, simpleHash, wait} from '../utils/helpers';

export interface FaceDetectionResult {
  faceId: string;
  confidence: number;
}

export const simulateFaceDetection = async (): Promise<FaceDetectionResult> => {
  await wait(300);
  return {
    faceId: createId('face'),
    confidence: randomConfidence(),
  };
};

export const createFaceEncodingHash = (name: string, faceId: string): string =>
  simpleHash(`${name}-${faceId}-${Date.now()}`);

export const runLivenessChallenge = async (challenge: ChallengeType): Promise<boolean> => {
  const CHALLENGE_DELAYS: Record<ChallengeType, number> = {
    blink: 600,
    smile: 1000,
    turn: 800,
  };
  await wait(CHALLENGE_DELAYS[challenge]);
  return true;
};

export const runLivenessFlow = async (): Promise<{passed: boolean; completed: ChallengeType[]}> => {
  const order: ChallengeType[] = ['blink', 'smile', 'turn'];
  const completed: ChallengeType[] = [];

  for (const challenge of order) {
    const passed = await runLivenessChallenge(challenge);
    if (!passed) {
      return {passed: false, completed};
    }
    completed.push(challenge);
  }

  return {passed: true, completed};
};

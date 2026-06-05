import {createFaceEncodingHash, runLivenessFlow, simulateFaceDetection} from '../biometricSimulator';

describe('biometric simulator', () => {
  it('returns confidence inside expected range', async () => {
    const result = await simulateFaceDetection();

    expect(result.confidence).toBeGreaterThanOrEqual(85);
    expect(result.confidence).toBeLessThanOrEqual(99);
    expect(result.faceId.startsWith('face_')).toBe(true);
  });

  it('completes all liveness challenges', async () => {
    const result = await runLivenessFlow();

    expect(result.passed).toBe(true);
    expect(result.completed).toEqual(['blink', 'smile', 'turn']);
  });

  it('creates deterministic-looking hash text', () => {
    const value = createFaceEncodingHash('Asha', 'face_123');
    expect(value.length).toBeGreaterThan(0);
  });
});

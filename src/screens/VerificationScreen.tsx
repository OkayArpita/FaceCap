import React, {useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text} from 'react-native';
import CameraSimulator from '../components/CameraSimulator';
import FaceDetectionVisualizer from '../components/FaceDetectionVisualizer';
import LivenessDetector from '../components/LivenessDetector';
import {addAttendanceRecord, getUsers} from '../services/database';
import {runLivenessFlow, simulateFaceDetection} from '../services/biometricSimulator';
import {colors} from '../utils/constants';

export default function VerificationScreen() {
  const [processing, setProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleVerify = async () => {
    setProcessing(true);
    try {
      const users = await getUsers();
      if (!users.length) {
        Alert.alert('No users', 'Please enroll at least one user first.');
        return;
      }

      const face = await simulateFaceDetection();
      const liveness = await runLivenessFlow();

      if (!liveness.passed) {
        Alert.alert('Liveness failed', 'Try verification again.');
        return;
      }

      setConfidence(face.confidence);
      await addAttendanceRecord(users[0].id, face.confidence);
      Alert.alert('Verification success', `Recorded attendance for ${users[0].name}.`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Re-verify enrolled users with liveness checks.</Text>
      <CameraSimulator active={processing} />
      <FaceDetectionVisualizer confidence={confidence} />
      <LivenessDetector completedChallenges={[]} currentChallenge={processing ? 'blink' : null} />
      <Button title={processing ? 'Verifying...' : 'Start Verification'} onPress={handleVerify} disabled={processing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  text: {
    color: colors.textMuted,
  },
});

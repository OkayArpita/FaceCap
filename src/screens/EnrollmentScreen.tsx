import React, {useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import CameraSimulator from '../components/CameraSimulator';
import FaceDetectionVisualizer from '../components/FaceDetectionVisualizer';
import LivenessDetector from '../components/LivenessDetector';
import {createUser} from '../services/database';
import {
  createFaceEncodingHash,
  runLivenessChallenge,
  simulateFaceDetection,
} from '../services/biometricSimulator';
import type {ChallengeType} from '../types';
import {colors} from '../utils/constants';

export default function EnrollmentScreen() {
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeType[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeType | null>(null);

  const handleEnroll = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a user name before enrollment.');
      return;
    }

    setProcessing(true);
    setCompletedChallenges([]);

    try {
      const face = await simulateFaceDetection();
      setConfidence(face.confidence);

      const orderedChallenges: ChallengeType[] = ['blink', 'smile', 'turn'];
      for (const challenge of orderedChallenges) {
        setCurrentChallenge(challenge);
        const passed = await runLivenessChallenge(challenge);
        if (!passed) {
          throw new Error('Liveness failed');
        }
        setCompletedChallenges(prev => [...new Set([...prev, challenge])]);
      }
      setCurrentChallenge(null);

      const hash = createFaceEncodingHash(name.trim(), face.faceId);
      await createUser(name.trim(), hash);

      Alert.alert('Enrollment complete', `${name} enrolled successfully.`);
      setName('');
    } catch (_error) {
      Alert.alert('Enrollment failed', 'Please retry enrollment.');
    } finally {
      setProcessing(false);
      setCurrentChallenge(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CameraSimulator active={processing} />
      <FaceDetectionVisualizer confidence={confidence} />
      <LivenessDetector completedChallenges={completedChallenges} currentChallenge={currentChallenge} />
      <View style={styles.form}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter user name"
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <Button title={processing ? 'Processing...' : 'Start Enrollment'} onPress={handleEnroll} disabled={processing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  form: {
    gap: 8,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.textPrimary,
  },
});

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {ChallengeType} from '../types';
import {challengeInstructions, colors, livenessChallenges} from '../utils/constants';

interface Props {
  completedChallenges: ChallengeType[];
  currentChallenge: ChallengeType | null;
}

export default function LivenessDetector({completedChallenges, currentChallenge}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liveness Challenges</Text>
      {livenessChallenges.map(challenge => {
        const isDone = completedChallenges.includes(challenge);
        const isCurrent = currentChallenge === challenge;

        return (
          <View key={challenge} style={styles.row}>
            <Text style={[styles.challenge, isCurrent && styles.current]}>{challengeInstructions[challenge]}</Text>
            <Text style={[styles.state, isDone && styles.done]}>{isDone ? '✓' : isCurrent ? '...' : '-'}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challenge: {
    color: colors.textMuted,
  },
  current: {
    color: colors.accent,
  },
  state: {
    color: colors.textMuted,
  },
  done: {
    color: colors.success,
  },
});

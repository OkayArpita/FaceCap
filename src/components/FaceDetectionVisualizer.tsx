import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/constants';

interface Props {
  confidence: number | null;
}

export default function FaceDetectionVisualizer({confidence}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Detection</Text>
      <View style={styles.frame} />
      <Text style={styles.value}>
        {confidence ? `Confidence: ${confidence.toFixed(2)}%` : 'Waiting for face...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  frame: {
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    borderRadius: 12,
  },
  value: {
    color: colors.textMuted,
  },
});

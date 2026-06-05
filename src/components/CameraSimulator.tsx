import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/constants';

interface Props {
  active: boolean;
}

export default function CameraSimulator({active}: Props) {
  return (
    <View style={[styles.container, active && styles.active]}>
      <Text style={styles.text}>{active ? 'Camera Active (Simulated)' : 'Camera Idle'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030712',
  },
  active: {
    borderColor: colors.accent,
  },
  text: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

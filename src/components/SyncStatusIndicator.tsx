import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/constants';

interface Props {
  online: boolean;
  pendingCount: number;
}

export default function SyncStatusIndicator({online, pendingCount}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{online ? 'Online' : 'Offline'}</Text>
      <Text style={styles.subText}>{pendingCount} pending sync(s)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  text: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  subText: {
    color: colors.textMuted,
  },
});

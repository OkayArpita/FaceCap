import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import {syncPendingAttendance} from '../services/awsSync';
import {getSyncHistory, getSyncQueue} from '../services/database';
import {getConnectivity} from '../services/networkMonitor';
import type {SyncConfig, SyncHistoryItem} from '../types';
import {DEFAULT_SYNC_CONFIG, colors, STORAGE_KEYS} from '../utils/constants';
import {readJson} from '../utils/storage';

export default function SyncScreen() {
  const [online, setOnline] = useState(false);
  const [pending, setPending] = useState(0);
  const [history, setHistory] = useState<SyncHistoryItem[]>([]);
  const [config, setConfig] = useState<SyncConfig>(DEFAULT_SYNC_CONFIG);

  const load = async () => {
    const [isOnline, queue, syncHistory, savedConfig] = await Promise.all([
      getConnectivity(),
      getSyncQueue(),
      getSyncHistory(),
      readJson<SyncConfig>(STORAGE_KEYS.syncConfig, DEFAULT_SYNC_CONFIG),
    ]);

    setOnline(isOnline);
    setPending(queue.length);
    setHistory(syncHistory);
    setConfig(savedConfig);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSyncNow = async () => {
    await syncPendingAttendance(config, online);
    await load();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SyncStatusIndicator online={online} pendingCount={pending} />
      <Button title="Sync now" onPress={handleSyncNow} />
      <View style={styles.card}>
        <Text style={styles.title}>Sync History</Text>
        {history.length === 0 ? (
          <Text style={styles.text}>No sync history yet.</Text>
        ) : (
          history.slice(0, 5).map(item => (
            <Text key={item.id} style={styles.text}>
              {item.status.toUpperCase()} - {item.recordsCount} records at {new Date(item.syncedAt).toLocaleTimeString()}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  text: {
    color: colors.textMuted,
  },
});

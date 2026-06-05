import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {clearAllLocalData} from '../services/database';
import type {SyncConfig} from '../types';
import {DEFAULT_SYNC_CONFIG, STORAGE_KEYS, colors} from '../utils/constants';
import {readJson, writeJson} from '../utils/storage';

export default function SettingsScreen() {
  const [config, setConfig] = useState<SyncConfig>(DEFAULT_SYNC_CONFIG);

  useEffect(() => {
    const load = async () => {
      const saved = await readJson<SyncConfig>(STORAGE_KEYS.syncConfig, DEFAULT_SYNC_CONFIG);
      setConfig(saved);
    };
    void load();
  }, []);

  const save = async () => {
    await writeJson(STORAGE_KEYS.syncConfig, config);
    Alert.alert('Saved', 'AWS sync settings updated.');
  };

  const purge = async () => {
    await clearAllLocalData();
    Alert.alert('Done', 'Local data purged successfully.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>AWS Endpoint</Text>
        <TextInput
          value={config.endpoint}
          onChangeText={value => setConfig(prev => ({...prev, endpoint: value}))}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>API Key</Text>
        <TextInput
          value={config.apiKey}
          onChangeText={value => setConfig(prev => ({...prev, apiKey: value}))}
          style={styles.input}
          placeholder="Optional API Key"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>S3 Bucket</Text>
        <TextInput
          value={config.bucketName}
          onChangeText={value => setConfig(prev => ({...prev, bucketName: value}))}
          style={styles.input}
          placeholder="Bucket name"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Auto Sync</Text>
          <Switch
            value={config.autoSync}
            onValueChange={value => setConfig(prev => ({...prev, autoSync: value}))}
          />
        </View>

        <Button title="Save Configuration" onPress={save} />
      </View>

      <Button title="Purge Local Data" onPress={purge} color={colors.danger} />
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
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f172a',
    color: colors.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

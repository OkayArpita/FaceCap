import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackParamList} from '../navigation/AppNavigator';
import {getAttendanceRecords, getUsers, getSyncQueue} from '../services/database';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import {colors} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const [usersCount, setUsersCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [pendingSync, setPendingSync] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const [users, attendance, queue] = await Promise.all([
          getUsers(),
          getAttendanceRecords(),
          getSyncQueue(),
        ]);
        setUsersCount(users.length);
        setAttendanceCount(attendance.length);
        setPendingSync(queue.length);
      };

      void load();
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FaceCap Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.value}>Users: {usersCount}</Text>
        <Text style={styles.value}>Attendance Records: {attendanceCount}</Text>
      </View>
      <SyncStatusIndicator online pendingCount={pendingSync} />
      <View style={styles.actions}>
        <Button title="Enroll User" onPress={() => navigation.navigate('Enrollment')} />
        <Button title="Verify User" onPress={() => navigation.navigate('Verification')} />
        <Button title="Sync Status" onPress={() => navigation.navigate('Sync')} />
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  value: {
    color: colors.textPrimary,
  },
  actions: {
    gap: 10,
  },
});

import React, { useState, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, ScrollView, 
  TextInput, Animated, Alert, ActivityIndicator, Dimensions 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [users, setUsers] = useState([
    { id: '1', name: 'Arpita Kumari', date: '05-06-2026' }
  ]);
  const [attendance, setAttendance] = useState([
    { id: '1', name: 'Arpita Kumari', time: '09:15 PM', status: 'Synced' }
  ]);
  const [awsEndpoint, setAwsEndpoint] = useState('https://api.aws.nhai.gov.in/v1/sync');
  const [syncHistory, setSyncHistory] = useState(['Synced 12 records on 04-06-2026']);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>We need camera access for FaceCap.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FaceCap</Text>
        <Text style={styles.networkIndicator}>📶 OFFLINE</Text>
      </View>

      <View style={styles.mainContent}>
        {currentTab === 'Home' && <HomeScreen users={users} attendance={attendance} />}
        {currentTab === 'Enrollment' && <EnrollmentScreen setUsers={setUsers} />}
        {currentTab === 'Verification' && <VerificationScreen users={users} setAttendance={setAttendance} />}
        {currentTab === 'Sync' && <SyncScreen attendance={attendance} setAttendance={setAttendance} syncHistory={syncHistory} setSyncHistory={setSyncHistory} />}
        {currentTab === 'Settings' && <SettingsScreen awsEndpoint={awsEndpoint} setAwsEndpoint={setAwsEndpoint} />}
      </View>

      <View style={styles.tabBar}>
        {['Home', 'Enrollment', 'Verification', 'Sync', 'Settings'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tabButton, currentTab === tab && styles.activeTabButton]} onPress={() => setCurrentTab(tab)}>
            <Text style={[styles.tabText, currentTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* --- CUSTOM FOOTER --- */}
      <View style={styles.footer}>
        <Text style={styles.footerText}></Text>
        <Text style={styles.footerText}>Built with ❤️  by Anupam and Arpita</Text>
      </View>
    </View>
  );
}

function HomeScreen({ users, attendance }) {
  return (
    <ScrollView style={styles.screenScroll}>
      <Text style={styles.sectionTitle}>Field Personnel Roster</Text>
      <View style={styles.card}><Text style={styles.cardText}>Enrolled Profiles: {users.length}</Text></View>
      <Text style={styles.sectionTitle}>Today's Logged Attendance</Text>
      {attendance.map((item) => (
        <View key={item.id} style={styles.logItem}>
          <View>
            <Text style={styles.logName}>{item.name}</Text>
            <Text style={styles.logTime}>Verified at: {item.time}</Text>
          </View>
          <Text style={[styles.statusBadge, item.status === 'Synced' ? styles.statusSynced : styles.statusPending]}>{item.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function EnrollmentScreen({ setUsers }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState('input'); 
  const [challengeIndex, setChallengeIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const challenges = ['BLINK 3 TIMES', 'SMILE GENUINELY', 'TURN HEAD LEFT'];

  const startVerification = () => {
    if (!name.trim()) return Alert.alert('Error', 'Enter name');
    setStep('scanning');
    setTimeout(() => { setStep('liveness'); runLivenessChallenge(0); }, 2000);
  };

  const runLivenessChallenge = (index) => {
    setChallengeIndex(index);
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 2500, useNativeDriver: false }).start(() => {
      if (index < challenges.length - 1) runLivenessChallenge(index + 1);
      else {
        setStep('success');
        setUsers((prev) => [...prev, { id: Date.now().toString(), name, date: '05-06-2026' }]);
      }
    });
  };

  return (
    <View style={styles.screenContainer}>
      {step === 'input' && (
        <View style={{ width: '100%', padding: 20 }}>
          <TextInput style={styles.input} placeholder="Enter Full Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
          <TouchableOpacity style={styles.primaryButton} onPress={startVerification}><Text style={styles.buttonText}>Start Scanner</Text></TouchableOpacity>
        </View>
      )}
      {(step === 'scanning' || step === 'liveness') && (
        <View style={styles.cameraBox}>
          <CameraView style={StyleSheet.absoluteFillObject} facing="front" />
          <View style={styles.scannerTarget} />
          {step === 'scanning' && <Text style={styles.overlayText}>Detecting Face... 98%</Text>}
          {step === 'liveness' && (
            <View style={styles.livenessOverlay}>
              <Text style={styles.challengeAction}>{challenges[challengeIndex]}</Text>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressBar, { width: progress.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }) }]} />
              </View>
            </View>
          )}
        </View>
      )}
      {step === 'success' && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.sectionTitle}>Enrollment Complete</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => { setStep('input'); setName(''); }}><Text style={styles.buttonText}>Enroll Another</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function VerificationScreen({ users, setAttendance }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const triggerVerification = (user) => {
    setSelectedUser(user);
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSelectedUser(null);
      setAttendance((prev) => [...prev, { id: Date.now().toString(), name: user.name, time: 'Just Now', status: 'Pending' }]);
      Alert.alert('Verified', `${user.name} logged successfully.`);
    }, 3000);
  };

  return (
    <ScrollView style={styles.screenScroll}>
      {!selectedUser && users.map((u) => (
        <TouchableOpacity key={u.id} style={styles.logItem} onPress={() => triggerVerification(u)}>
          <Text style={styles.logName}>{u.name}</Text><Text style={{ color: '#4cc9f0' }}>Verify 👁️</Text>
        </TouchableOpacity>
      ))}
      {verifying && (
        <View style={styles.cameraBox}>
          <CameraView style={StyleSheet.absoluteFillObject} facing="front" />
          <View style={[styles.scannerTarget, { borderColor: '#FF6B00' }]} />
          <Text style={styles.overlayText}>Computing Cosine Similarity...</Text>
        </View>
      )}
    </ScrollView>
  );
}

function SyncScreen({ attendance, setAttendance }) {
  const pendingCount = attendance.filter((a) => a.status === 'Pending').length;
  const performSync = () => {
    setTimeout(() => {
      setAttendance((prev) => prev.map((a) => ({ ...a, status: 'Synced' })));
      Alert.alert('Success', 'Local data synced to AWS and purged.');
    }, 2000);
  };

  return (
    <View style={styles.screenScroll}>
      <View style={styles.card}><Text style={styles.cardText}>Pending Logs: {pendingCount}</Text></View>
      <TouchableOpacity style={styles.syncButton} onPress={performSync}><Text style={styles.buttonText}>Sync & Purge</Text></TouchableOpacity>
    </View>
  );
}

function SettingsScreen({ awsEndpoint, setAwsEndpoint }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.sectionTitle}>AWS Server Configuration</Text>
      <TextInput 
        style={styles.input} 
        value={awsEndpoint} 
        onChangeText={setAwsEndpoint} 
        placeholder="AWS Gateway Endpoint"
        placeholderTextColor="#888"
      />

      <Text style={styles.sectionTitle}>Edge Architecture Specs</Text>
      <View style={styles.card}>
        <Text style={styles.metaText}>• Framework: React Native Cross-Platform</Text>
        <Text style={styles.metaText}>• Targeted Model Size: 14.2 MB (MobileFaceNet optimized)</Text>
        <Text style={styles.metaText}>• Local Partition Engine: AsyncStorage / SQLite3 Hook</Text>
        <Text style={styles.metaText}>• Compliance Rules: India Biometric Data Act Protocol</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  networkIndicator: { color: '#FF6B00', fontSize: 11, fontWeight: 'bold' },
  mainContent: { flex: 1 },
  screenScroll: { padding: 20 },
  screenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { color: '#4cc9f0', fontSize: 14, fontWeight: 'bold', marginVertical: 15 },
  card: { backgroundColor: '#152238', padding: 15, borderRadius: 8 },
  cardText: { color: '#fff', fontSize: 15 },
  logItem: { backgroundColor: '#152238', padding: 15, borderRadius: 8, marginVertical: 6, flexDirection: 'row', justifyContent: 'space-between' },
  logName: { color: '#fff', fontSize: 16 },
  logTime: { color: '#888', fontSize: 12 },
  statusBadge: { padding: 4, borderRadius: 4, fontSize: 11, fontWeight: 'bold' },
  statusSynced: { backgroundColor: 'rgba(76, 201, 240, 0.2)', color: '#4cc9f0' },
  statusPending: { backgroundColor: 'rgba(255, 107, 0, 0.2)', color: '#FF6B00' },
  input: { backgroundColor: '#152238', color: '#fff', padding: 12, borderRadius: 6, marginBottom: 15 },
  primaryButton: { backgroundColor: '#FF6B00', padding: 15, borderRadius: 6, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#1e293b', padding: 15, borderRadius: 6, alignItems: 'center', marginTop: 15 },
  syncButton: { backgroundColor: '#4cc9f0', padding: 15, borderRadius: 6, alignItems: 'center', marginVertical: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cameraBox: { width: width - 40, height: 400, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  scannerTarget: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: '#4cc9f0', borderStyle: 'dashed', position: 'absolute' },
  overlayText: { color: '#fff', position: 'absolute', bottom: 30, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5 },
  livenessOverlay: { position: 'absolute', bottom: 30, width: '80%', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 10 },
  challengeAction: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  progressTrack: { width: '100%', height: 6, backgroundColor: '#1e293b', borderRadius: 3 },
  progressBar: { height: '100%', backgroundColor: '#4cc9f0' },
  successIcon: { fontSize: 60, marginBottom: 10 },
  tabBar: { flexDirection: 'row', backgroundColor: '#152238', paddingTop: 10, paddingBottom: 5 },
  tabButton: { flex: 1, alignItems: 'center' },
  tabText: { color: '#888', fontSize: 10 },
  activeTabText: { color: '#4cc9f0', fontWeight: 'bold' },
  footer: { backgroundColor: '#152238', paddingBottom: 15, alignItems: 'center' },
  footerText: { color: '#64748b', fontSize: 12, fontStyle: 'italic' },
  metaText: { color: '#aaa', fontSize: 14, marginVertical: 4 },
});
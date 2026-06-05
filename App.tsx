import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {initializeDatabase} from './src/services/database';
import {colors} from './src/utils/constants';

function App() {
  useEffect(() => {
    initializeDatabase().catch(() => undefined);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;

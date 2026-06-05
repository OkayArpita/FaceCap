import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EnrollmentScreen from '../screens/EnrollmentScreen';
import VerificationScreen from '../screens/VerificationScreen';
import SyncScreen from '../screens/SyncScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {colors} from '../utils/constants';

export type RootStackParamList = {
  Home: undefined;
  Enrollment: undefined;
  Verification: undefined;
  Sync: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    primary: colors.accent,
    border: '#243244',
    notification: colors.accent,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: colors.surface},
          headerTintColor: colors.textPrimary,
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Enrollment" component={EnrollmentScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Sync" component={SyncScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

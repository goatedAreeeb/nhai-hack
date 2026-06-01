// src/navigation/AppNavigator.tsx — v4.1
// DatalakeOfflineAuth — Stack navigation
// Using @react-navigation/stack@6 + @react-navigation/native
// Architecture specifies stack navigation (not Expo Router file-based)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import AuthScreen from '../screens/AuthScreen';
import EnrollScreen from '../screens/EnrollScreen';
import AdminScreen from '../screens/AdminScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Auth: undefined;
  Enroll: undefined;
  Admin: undefined;
  Settings: undefined;
};

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

const SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#0a0a0f' },
  headerTintColor: '#ffffff',
  headerTitleStyle: { fontWeight: '700' as const },
  cardStyle: { backgroundColor: '#0a0a0f' },
};

export default function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={SCREEN_OPTIONS}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'DatalakeOfflineAuth' }}
        />
        <Stack.Screen
          name="Enroll"
          component={EnrollScreen}
          options={{ title: 'Enroll Employee' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Admin Dashboard' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

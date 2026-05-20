import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AlertProvider } from './src/context/AlertContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/AuthScreen';

function Root() {
  const { currentUser } = useApp();
  return currentUser ? <AppNavigator /> : <AuthScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AlertProvider>
          <StatusBar style="light" />
          <Root />
        </AlertProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

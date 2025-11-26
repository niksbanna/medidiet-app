import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { networkManager } from '../services/sync/NetworkManager';

import { Platform } from 'react-native';
import { setBackgroundColorAsync, setPositionAsync } from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

// Configure Android navigation bar for edge-to-edge
if (Platform.OS === 'android') {
  setPositionAsync('absolute');
  setBackgroundColorAsync('transparent');
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      networkManager.initialize();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
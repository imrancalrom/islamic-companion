import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { NotoNastaliqUrdu_400Regular } from '@expo-google-fonts/noto-nastaliq-urdu';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { rescheduleAll } from '../lib/notifications';
import { SettingsProvider, useSettings } from '../lib/settings';
import { colors, fonts } from '../theme';

/** Keeps the rolling window of prayer notifications topped up. */
function NotificationScheduler() {
  const { settings, ready } = useSettings();
  const { place, method, madhab, notify, adhkarReminders } = settings;

  useEffect(() => {
    if (!ready) return;
    rescheduleAll(settings).catch(() => {});
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') rescheduleAll(settings).catch(() => {});
    });
    return () => sub.remove();
    // Only the fields that change the schedule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, place, method, madhab, notify, adhkarReminders]);

  // Open the right screen when a reminder is tapped.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as never);
    });
    return () => sub.remove();
  }, []);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
    AmiriQuran_400Regular,
    NotoNastaliqUrdu_400Regular,
  });
  if (!loaded) return null;

  return (
    <SettingsProvider>
      <NotificationScheduler />
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="dhikr/[session]" options={{ title: 'Adhkar' }} />
        <Stack.Screen name="dua/[id]" options={{ title: 'Dua' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </SettingsProvider>
  );
}

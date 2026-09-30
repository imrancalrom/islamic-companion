import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PRAYER_KEYS, PRAYER_NAMES, prayerTimes } from './prayer';
import type { Settings } from './settings';

/** How many days ahead to schedule. iOS keeps at most 64 pending notifications. */
const DAYS_AHEAD = 5;
const CHANNEL = 'prayer-times';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    // To use an adhan sound, add the file to the expo-notifications plugin in
    // app.json and set `sound` here. Android locks a channel's sound once created.
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Prayer times',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 400, 200, 400],
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return asked.granted;
}

/**
 * Replaces every scheduled reminder with fresh ones for the next few days.
 * Call on app start, when settings change, and when the app returns to the
 * foreground, so the rolling window never runs out.
 */
export async function rescheduleAll(settings: Settings): Promise<number> {
  if (Platform.OS === 'web' || !settings.place) return 0;
  if (!(await ensurePermission())) return 0;

  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();
  let count = 0;

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    const t = prayerTimes(settings.place, day, settings);

    for (const key of PRAYER_KEYS) {
      if (!settings.notify[key] || t[key] <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${PRAYER_NAMES[key].name} · ${PRAYER_NAMES[key].arabic}`,
          body: `It's time for ${PRAYER_NAMES[key].name} in ${settings.place.label}.`,
          sound: 'default',
          data: { url: '/' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: t[key], channelId: CHANNEL },
      });
      count++;
    }

    if (settings.adhkarReminders) {
      const reminders = [
        { at: new Date(t.fajr.getTime() + 20 * 60000), title: 'Morning adhkar', url: '/dhikr/morning' },
        { at: new Date(t.asr.getTime() + 20 * 60000), title: 'Evening adhkar', url: '/dhikr/evening' },
      ];
      for (const r of reminders) {
        if (r.at <= now) continue;
        await Notifications.scheduleNotificationAsync({
          content: { title: r.title, body: 'A few minutes of remembrance.', data: { url: r.url } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.at, channelId: CHANNEL },
        });
        count++;
      }
    }
  }
  return count;
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fastsOn } from './fasting';
import { isFriday } from './friday';
import { formatTime, PRAYER_KEYS, PRAYER_NAMES, prayerTimes, sunnahTimes } from './prayer';
import type { Settings } from './settings';

/** How many days ahead to schedule. */
const DAYS_AHEAD = 5;
/** iOS keeps at most 64 pending notifications; leave a little room. */
const MAX_PENDING = 60;
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
type Planned = { at: Date; title: string; body: string; url: string; sound?: boolean };

/** Every reminder the settings ask for, from now until DAYS_AHEAD days out. */
export function planReminders(settings: Settings, now = new Date()): Planned[] {
  const place = settings.place;
  if (!place) return [];
  const out: Planned[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    const t = prayerTimes(place, day, settings);
    const sun = sunnahTimes(place, day, settings);

    for (const key of PRAYER_KEYS) {
      if (!settings.notify[key]) continue;
      out.push({
        at: t[key],
        title: `${PRAYER_NAMES[key].name} · ${PRAYER_NAMES[key].arabic}`,
        body: `It's time for ${PRAYER_NAMES[key].name} in ${place.label}.`,
        url: '/',
        sound: true,
      });
    }

    if (settings.adhkarReminders) {
      out.push({ at: new Date(t.fajr.getTime() + 20 * 60000), title: 'Morning adhkar', body: 'A few minutes of remembrance.', url: '/dhikr/morning' });
      out.push({ at: new Date(t.asr.getTime() + 20 * 60000), title: 'Evening adhkar', body: 'A few minutes of remembrance.', url: '/dhikr/evening' });
    }

    if (settings.reminders.duha) {
      out.push({ at: sun.duhaStart, title: 'Duha prayer', body: `Duha time has started. It lasts until ${formatTime(sun.duhaEnd)}.`, url: '/' });
    }
    if (settings.reminders.tahajjud) {
      out.push({ at: sun.lastThird, title: 'Last third of the night', body: 'A blessed time for Tahajjud, witr and dua.', url: '/' });
    }

    if (settings.reminders.fasting) {
      // Remind after Isha the evening before a recommended fast.
      const tomorrow = new Date(day);
      tomorrow.setDate(day.getDate() + 1);
      const fasts = fastsOn(tomorrow);
      if (fasts.length) {
        const next = prayerTimes(place, tomorrow, settings);
        out.push({
          at: new Date(t.isha.getTime() + 30 * 60000),
          title: `Tomorrow: ${fasts.map((f) => f.title).join(' · ')}`,
          body: `A Sunnah fast. Suhoor ends at Fajr, ${formatTime(next.fajr)}.`,
          url: '/more/fasting',
        });
      }
    }

    if (settings.reminders.friday && isFriday(day)) {
      out.push({ at: new Date(t.sunrise.getTime() + 60 * 60000), title: "Jumu'ah Mubarak", body: 'Read Surah Al-Kahf today and send salawat on the Prophet ﷺ.', url: '/more/friday' });
      out.push({ at: new Date(t.maghrib.getTime() - 60 * 60000), title: 'The last hour of Friday', body: 'An hour when dua is answered. Seek it before Maghrib.', url: '/more/friday' });
    }
  }

  // iOS keeps at most 64 pending notifications; keep the soonest.
  return out
    .filter((r) => r.at > now)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, MAX_PENDING);
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
  const plan = planReminders(settings);
  for (const r of plan) {
    await Notifications.scheduleNotificationAsync({
      content: { title: r.title, body: r.body, data: { url: r.url }, sound: r.sound ? 'default' : undefined },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.at, channelId: CHANNEL },
    });
  }
  return plan.length;
}

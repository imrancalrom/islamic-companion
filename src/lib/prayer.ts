import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { Place, PrayerKey, Settings } from './settings';

export type TimeRow = { key: PrayerKey | 'sunrise'; name: string; arabic: string; time: Date };

export const PRAYER_NAMES: Record<PrayerKey | 'sunrise', { name: string; arabic: string }> = {
  fajr: { name: 'Fajr', arabic: 'الفجر' },
  sunrise: { name: 'Sunrise', arabic: 'الشروق' },
  dhuhr: { name: 'Dhuhr', arabic: 'الظهر' },
  asr: { name: 'Asr', arabic: 'العصر' },
  maghrib: { name: 'Maghrib', arabic: 'المغرب' },
  isha: { name: 'Isha', arabic: 'العشاء' },
};

export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/** Calculates the day's times on the phone. No internet needed. */
export function prayerTimes(place: Place, date: Date, settings: Pick<Settings, 'method' | 'madhab'>) {
  const params = CalculationMethod[settings.method]();
  params.madhab = settings.madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return new PrayerTimes(new Coordinates(place.latitude, place.longitude), date, params);
}

export function timeRows(place: Place, date: Date, settings: Pick<Settings, 'method' | 'madhab'>): TimeRow[] {
  const t = prayerTimes(place, date, settings);
  return (['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key) => ({
    key,
    ...PRAYER_NAMES[key],
    time: t[key],
  }));
}

/** The next of the five prayers after `now`, rolling over to tomorrow's Fajr. */
export function nextPrayer(place: Place, now: Date, settings: Pick<Settings, 'method' | 'madhab'>) {
  const today = prayerTimes(place, now, settings);
  for (const key of PRAYER_KEYS) {
    if (today[key] > now) return { key, ...PRAYER_NAMES[key], time: today[key] };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const t = prayerTimes(place, tomorrow, settings);
  return { key: 'fajr' as PrayerKey, ...PRAYER_NAMES.fajr, time: t.fajr };
}

export const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export function formatCountdown(ms: number) {
  const mins = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `in ${m} min`;
  return `in ${h} h ${m} min`;
}

/**
 * Hijri date using the Umm al-Qura calendar, if the phone's JS engine supports it.
 * The date can differ by a day from local moon sighting, so the app labels it as approximate.
 */
export function hijriDate(d: Date): string | null {
  try {
    const s = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    return /AH|\d{4}/.test(s) ? s.replace(/\s*AH$/, ' AH') : null;
  } catch {
    return null;
  }
}

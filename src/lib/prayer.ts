import { CalculationMethod, Coordinates, Madhab, PrayerTimes, Qibla, SunnahTimes } from 'adhan';
import { formatHijri, toHijri } from './hijri';
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

/** Hijri date (Umm al-Qura). Can differ by a day from local moon sighting. */
export function hijriDate(d: Date): string | null {
  try {
    return formatHijri(toHijri(d));
  } catch {
    return null;
  }
}

/** Direction of the Kaaba in degrees clockwise from true north. */
export const qiblaBearing = (place: Place) => Qibla(new Coordinates(place.latitude, place.longitude));

/**
 * Times for voluntary prayers on the night that starts this evening.
 * Duha: from about 20 minutes after sunrise until about 10 minutes before Dhuhr.
 * Witr: after Isha until Fajr. Tahajjud: best in the last third of the night.
 */
export function sunnahTimes(place: Place, date: Date, settings: Pick<Settings, 'method' | 'madhab'>) {
  const t = prayerTimes(place, date, settings);
  const night = new SunnahTimes(t);
  return {
    duhaStart: new Date(t.sunrise.getTime() + 20 * 60000),
    duhaEnd: new Date(t.dhuhr.getTime() - 10 * 60000),
    witrStart: t.isha,
    lastThird: night.lastThirdOfTheNight,
    middleOfNight: night.middleOfTheNight,
  };
}

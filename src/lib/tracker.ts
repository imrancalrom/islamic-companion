import { PRAYER_KEYS } from './prayer';
import { dayKey, PrayerKey, Settings } from './settings';

/** Days of prayer history kept on the phone. */
const KEEP_DAYS = 400;

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(d.getDate() + n);
  return x;
}

export const allPrayed = (prayed: Settings['prayed'], key: string) =>
  PRAYER_KEYS.every((p) => (prayed[key] ?? []).includes(p));

/** Ticks or unticks one prayer on one day, keeping a bounded history. */
export function togglePrayer(prayed: Settings['prayed'], key: string, prayer: PrayerKey): Settings['prayed'] {
  const list = prayed[key] ?? [];
  const next = list.includes(prayer) ? list.filter((p) => p !== prayer) : [...list, prayer];
  const kept = Object.fromEntries(Object.entries(prayed).sort().slice(-(KEEP_DAYS - 1)));
  return { ...kept, [key]: next };
}

/**
 * Days in a row with all five prayers ticked. Today counts once it is complete;
 * until then the streak runs to yesterday, so it does not reset mid-day.
 */
export function streaks(prayed: Settings['prayed'], today = new Date()) {
  let current = 0;
  let d = allPrayed(prayed, dayKey(today)) ? today : addDays(today, -1);
  while (allPrayed(prayed, dayKey(d))) {
    current++;
    d = addDays(d, -1);
  }

  let best = 0;
  let run = 0;
  for (let i = KEEP_DAYS; i >= 0; i--) {
    if (allPrayed(prayed, dayKey(addDays(today, -i)))) best = Math.max(best, ++run);
    else run = 0;
  }
  return { current, best: Math.max(best, current) };
}

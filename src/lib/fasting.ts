import { toHijri } from './hijri';

export type FastDay = {
  id: 'monday' | 'thursday' | 'white-days' | 'tasua' | 'ashura' | 'arafah' | 'shawwal-six';
  title: string;
  why: string;
  source: string;
};

/*
 * Voluntary fasts and the days fasting is not allowed, by the Umm al-Qura calendar.
 * References are given for scholar review; local moon sighting can move a date by a day.
 */
const DAYS: Record<FastDay['id'], Omit<FastDay, 'id'>> = {
  monday: {
    title: 'Monday fast',
    why: 'The Prophet ﷺ fasted on Mondays and said it was the day he was born.',
    source: 'Sahih Muslim 1162',
  },
  thursday: {
    title: 'Thursday fast',
    why: 'Deeds are presented on Mondays and Thursdays, and the Prophet ﷺ loved to be fasting when his were presented.',
    source: 'Tirmidhi 747',
  },
  'white-days': {
    title: 'White Days fast',
    why: 'Fasting the 13th, 14th and 15th of each Hijri month.',
    source: 'Tirmidhi 761, An-Nasa\'i 2422',
  },
  tasua: {
    title: "Tasu'a (9 Muharram)",
    why: 'The Prophet ﷺ intended to fast the 9th along with Ashura.',
    source: 'Sahih Muslim 1134',
  },
  ashura: {
    title: 'Ashura (10 Muharram)',
    why: 'Fasting Ashura expiates the sins of the previous year.',
    source: 'Sahih Muslim 1162',
  },
  arafah: {
    title: 'Day of Arafah (9 Dhu al-Hijjah)',
    why: 'For those not on Hajj, fasting Arafah expiates the sins of the previous year and the coming year.',
    source: 'Sahih Muslim 1162',
  },
  'shawwal-six': {
    title: 'Six days of Shawwal',
    why: 'Fasting Ramadan and then six days of Shawwal is like fasting the whole year. Any six days of the month count.',
    source: 'Sahih Muslim 1164',
  },
};

/** Days when fasting is not allowed: the two Eids and the days of Tashriq. */
export function fastingForbidden(d: Date): string | null {
  const h = toHijri(d);
  if (h.month === 10 && h.day === 1) return 'Eid al-Fitr — fasting is not allowed today.';
  if (h.month === 12 && h.day === 10) return 'Eid al-Adha — fasting is not allowed today.';
  if (h.month === 12 && h.day >= 11 && h.day <= 13) return 'Days of Tashriq — fasting is not allowed.';
  return null;
}

export const isRamadan = (d: Date) => toHijri(d).month === 9;

/** Recommended voluntary fasts that fall on this date (empty in Ramadan and on forbidden days). */
export function fastsOn(d: Date): FastDay[] {
  if (isRamadan(d) || fastingForbidden(d)) return [];
  const h = toHijri(d);
  const ids: FastDay['id'][] = [];
  if (h.month === 12 && h.day === 9) ids.push('arafah');
  if (h.month === 1 && h.day === 9) ids.push('tasua');
  if (h.month === 1 && h.day === 10) ids.push('ashura');
  if (h.month === 10 && h.day === 2) ids.push('shawwal-six');
  if (h.day >= 13 && h.day <= 15) ids.push('white-days');
  if (d.getDay() === 1) ids.push('monday');
  if (d.getDay() === 4) ids.push('thursday');
  return ids.map((id) => ({ id, ...DAYS[id] }));
}

/** The next recommended fast from tomorrow onwards, within `days` days. */
export function nextFast(from: Date, days = 14): { date: Date; fasts: FastDay[] } | null {
  for (let i = 1; i <= days; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    const fasts = fastsOn(d);
    if (fasts.length) return { date: d, fasts };
  }
  return null;
}

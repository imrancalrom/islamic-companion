import { gregorianToHijri } from '@tabby_ai/hijri-converter';

export type HijriDate = { year: number; month: number; day: number };

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Akhir",
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qa'dah",
  'Dhu al-Hijjah',
];

/**
 * Umm al-Qura calendar date for a local date (table-based, works offline on every
 * phone). Local moon sighting can differ by a day, so the UI says "approx.".
 */
export function toHijri(d: Date): HijriDate {
  return gregorianToHijri({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
}

export const formatHijri = (h: HijriDate) => `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;

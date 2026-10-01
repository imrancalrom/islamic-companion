/*
 * Friday (Jumu'ah) practices, with references for scholar review.
 */
export const FRIDAY_PRACTICES = [
  {
    id: 'kahf',
    title: 'Read Surah Al-Kahf',
    why: 'Whoever reads Surah Al-Kahf on Friday will have light between the two Fridays.',
    source: 'Al-Hakim, Al-Bayhaqi (graded sahih by Al-Albani)',
  },
  {
    id: 'salawat',
    title: 'Send salawat on the Prophet ﷺ',
    why: 'Send abundant blessings on me on Friday, for your blessings are shown to me.',
    source: 'Abu Dawud 1047',
  },
  {
    id: 'last-hour',
    title: 'Make dua in the last hour before Maghrib',
    why: 'There is an hour on Friday in which a Muslim\'s dua is answered; seek it in the last hour after Asr.',
    source: 'Abu Dawud 1048',
  },
] as const;

/** The salawat to repeat (Salat Ibrahimiyyah, short form). */
export const SALAWAT = {
  arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
  english: 'O Allah, send blessings on Muhammad and on the family of Muhammad.',
};

export const isFriday = (d: Date) => d.getDay() === 5;

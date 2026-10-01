import type { Entry } from './types';

/* Ramadan duas and practices, pending scholar review. */

export const IFTAR_DUA: Entry = {
  id: 'iftar',
  title: 'When breaking the fast',
  arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
  transliteration: "Dhahabaz-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha' Allah",
  urdu: 'پیاس چلی گئی، رگیں تر ہو گئیں، اور ان شاء اللہ اجر ثابت ہو گیا۔',
  english: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
  count: 1,
  virtue: 'The Prophet ﷺ said this when he broke his fast.',
  source: 'Abu Dawud 2357',
  grade: 'Hasan',
  reviewed: false,
};

export const QADR_DUA: Entry = {
  id: 'laylat-al-qadr',
  title: 'On Laylat al-Qadr',
  arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
  transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
  urdu: 'اے اللہ! تو معاف کرنے والا ہے، معافی کو پسند کرتا ہے، پس مجھے معاف فرما دے۔',
  english: 'O Allah, You are Pardoning and love to pardon, so pardon me.',
  count: 1,
  virtue: '‘A’ishah asked what to say if she knew which night was Laylat al-Qadr, and the Prophet ﷺ taught her this.',
  source: 'Tirmidhi 3513',
  grade: 'Sahih',
  reviewed: false,
};

export const RAMADAN_NOTES = [
  { title: 'Suhoor', text: 'Eat suhoor, for there is blessing in it. Stop eating at the time of Fajr.', source: 'Sahih al-Bukhari 1923' },
  { title: 'Iftar', text: 'Break the fast as soon as the sun has set, with dates or water.', source: 'Sahih al-Bukhari 1957; Abu Dawud 2356' },
  { title: 'Laylat al-Qadr', text: 'Seek it in the odd nights of the last ten nights of Ramadan.', source: 'Sahih al-Bukhari 2017' },
];

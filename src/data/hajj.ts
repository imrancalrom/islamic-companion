import { QURAN } from './quran.generated';
import type { Entry } from './types';

/*
 * Hajj and Umrah guide. Steps follow the common practice for Umrah and for
 * Hajj al-Tamattu'. Duas are the ones reported in the sources given. All of it
 * is marked reviewed: false until a scholar has checked it; scholars differ on
 * some details, so the app tells users to follow their own scholar or group.
 */

const dua = (e: Omit<Entry, 'count' | 'reviewed'> & { count?: number }): Entry => ({ count: 1, reviewed: false, ...e });

export const HAJJ_DUAS = {
  talbiyah: dua({
    id: 'talbiyah',
    title: 'Talbiyah',
    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    transliteration: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak",
    urdu: 'حاضر ہوں اے اللہ، میں حاضر ہوں۔ حاضر ہوں، تیرا کوئی شریک نہیں، میں حاضر ہوں۔ بے شک تمام تعریف، نعمت اور بادشاہی تیری ہی ہے، تیرا کوئی شریک نہیں۔',
    english: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. All praise, blessings and dominion are Yours. You have no partner.',
    virtue: 'Men say it aloud, women quietly, from entering ihram until starting tawaf (Umrah) or until stoning Jamrat al-Aqabah (Hajj).',
    source: 'Sahih al-Bukhari 1549, Sahih Muslim 1184',
    grade: 'Sahih',
  }),
  takbir: dua({
    id: 'takbir-black-stone',
    title: 'At the Black Stone',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu akbar',
    urdu: 'اللہ سب سے بڑا ہے',
    english: 'Allah is the Greatest.',
    virtue: 'Point to the Black Stone and say it at the start of each round.',
    source: 'Sahih al-Bukhari 1613',
    grade: 'Sahih',
  }),
  rabbanaAtina: dua({
    id: 'rabbana-atina',
    title: 'Between the Yemeni Corner and the Black Stone',
    arabic: QURAN['rabbana-atina'].text,
    script: 'quran',
    transliteration: "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhaban-nar",
    urdu: 'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے، اور ہمیں آگ کے عذاب سے بچا۔',
    english: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source: 'Quran 2:201 · in tawaf: Abu Dawud 1892',
    grade: 'Hasan',
  }),
  maqam: dua({
    id: 'maqam-ibrahim',
    title: 'Going to Maqam Ibrahim',
    arabic: QURAN['maqam-ibrahim'].text,
    script: 'quran',
    urdu: 'اور مقامِ ابراہیم کو نماز کی جگہ بناؤ۔',
    english: 'And take the station of Ibrahim as a place of prayer.',
    virtue: 'Then pray two rak\'ahs behind it, reciting Al-Kafirun and Al-Ikhlas.',
    source: 'Quran 2:125 · Sahih Muslim 1218',
    grade: 'Quran',
  }),
  safaVerse: dua({
    id: 'safa-verse',
    title: 'Approaching Safa (first time only)',
    arabic: QURAN['safa-marwah'].text,
    script: 'quran',
    urdu: 'بے شک صفا اور مروہ اللہ کی نشانیوں میں سے ہیں۔',
    english: 'Indeed, Safa and Marwah are among the symbols of Allah.',
    virtue: 'Then say: أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ — "I begin with what Allah began with."',
    source: 'Quran 2:158 · Sahih Muslim 1218',
    grade: 'Quran',
  }),
  safaDhikr: dua({
    id: 'safa-dhikr',
    title: 'On Safa and Marwah',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اور تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس نے اپنا وعدہ پورا کیا، اپنے بندے کی مدد کی، اور اکیلے ہی لشکروں کو شکست دی۔',
    english: 'None has the right to be worshipped but Allah alone, with no partner; His is the dominion and the praise, and He has power over all things. None has the right to be worshipped but Allah alone; He fulfilled His promise, helped His servant, and alone defeated the confederates.',
    count: 3,
    virtue: 'Face the Qibla, say Allahu akbar, then say this three times, making your own dua in between.',
    source: 'Sahih Muslim 1218',
    grade: 'Sahih',
  }),
  arafah: dua({
    id: 'arafah',
    title: 'The best dua, on the Day of Arafah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تعریف اسی کے لیے ہے، اور وہ ہر چیز پر قادر ہے۔',
    english: 'None has the right to be worshipped but Allah alone, with no partner. His is the dominion and the praise, and He has power over all things.',
    virtue: 'The best dua is the dua of the Day of Arafah, and the best thing said by the prophets is this.',
    source: 'Tirmidhi 3585',
    grade: 'Hasan',
  }),
  jamarat: dua({
    id: 'jamarat',
    title: 'With each pebble',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu akbar',
    urdu: 'اللہ سب سے بڑا ہے',
    english: 'Allah is the Greatest.',
    virtue: 'Throw seven pebbles one at a time, saying it with each.',
    source: 'Sahih al-Bukhari 1751',
    grade: 'Sahih',
  }),
};

export type GuideStep = {
  id: string;
  title: string;
  when?: string;
  points: string[];
  duas?: Entry[];
  /** A lap counter for tawaf or sa'i. */
  laps?: { count: number; label: string; note: string };
};

export const UMRAH_STEPS: GuideStep[] = [
  {
    id: 'ihram',
    title: 'Enter ihram at the miqat',
    points: [
      'Take a bath (ghusl), and men wear the two white ihram sheets. Women wear their normal modest clothes.',
      'Make the intention for Umrah in your heart before crossing the miqat.',
      'Begin the Talbiyah. The restrictions of ihram now apply.',
    ],
    duas: [HAJJ_DUAS.talbiyah],
  },
  {
    id: 'tawaf',
    title: 'Tawaf: seven rounds around the Kaaba',
    points: [
      'Stop the Talbiyah when you start tawaf. You need wudu.',
      'Start at the Black Stone, with the Kaaba on your left. Each round ends back at the Black Stone.',
      'Men uncover the right shoulder during this tawaf and walk briskly in the first three rounds.',
      'There is no set dua for each round; make dhikr and dua in any language.',
    ],
    duas: [HAJJ_DUAS.takbir, HAJJ_DUAS.rabbanaAtina],
    laps: { count: 7, label: 'Round', note: 'Tap at the Black Stone line each time you complete a round.' },
  },
  {
    id: 'maqam',
    title: "Two rak'ahs and Zamzam",
    points: [
      'Cover the right shoulder again.',
      "Pray two rak'ahs behind Maqam Ibrahim if possible, or anywhere in the mosque.",
      'Drink Zamzam water.',
    ],
    duas: [HAJJ_DUAS.maqam],
  },
  {
    id: 'sai',
    title: "Sa'i: seven laps between Safa and Marwah",
    points: [
      'Start at Safa. Going from Safa to Marwah is one lap; coming back is the second.',
      'Men walk quickly between the green lights.',
      'You finish at Marwah after the seventh lap.',
    ],
    duas: [HAJJ_DUAS.safaVerse, HAJJ_DUAS.safaDhikr],
    laps: { count: 7, label: 'Lap', note: 'Tap each time you reach Safa or Marwah.' },
  },
  {
    id: 'hair',
    title: 'Shave or shorten the hair',
    points: [
      'Men shave the head or shorten the hair all over; shaving is better.',
      'Women cut about a fingertip length from the end of their hair.',
      'Your Umrah is complete and the restrictions of ihram end.',
    ],
  },
];

export const HAJJ_DAYS: GuideStep[] = [
  {
    id: 'day8',
    title: 'Day of Tarwiyah — go to Mina',
    when: '8 Dhu al-Hijjah',
    points: [
      'Enter ihram for Hajj from where you are staying and begin the Talbiyah.',
      'Go to Mina and pray Dhuhr, Asr, Maghrib, Isha and the next Fajr there, shortening four-rak\'ah prayers.',
    ],
    duas: [HAJJ_DUAS.talbiyah],
  },
  {
    id: 'day9',
    title: 'Day of Arafah',
    when: '9 Dhu al-Hijjah',
    points: [
      'After sunrise, go to Arafah. Standing at Arafah is the most important part of Hajj.',
      'Pray Dhuhr and Asr together, shortened, then spend the time until sunset in dua and dhikr facing the Qibla.',
      'After sunset, go to Muzdalifah. Pray Maghrib and Isha together there, spend the night and collect pebbles.',
    ],
    duas: [HAJJ_DUAS.arafah],
  },
  {
    id: 'day10',
    title: 'Day of Sacrifice (Eid)',
    when: '10 Dhu al-Hijjah',
    points: [
      'After Fajr at Muzdalifah, go to Mina before sunrise.',
      'Stone Jamrat al-Aqabah (the large one) with seven pebbles. Stop the Talbiyah.',
      'Offer the sacrifice (hady), then shave or shorten the hair. Most ihram restrictions end.',
      "Go to Makkah for Tawaf al-Ifadah and the sa'i of Hajj, then return to Mina.",
    ],
    duas: [HAJJ_DUAS.jamarat],
    laps: { count: 7, label: 'Pebble', note: 'Tap with each pebble.' },
  },
  {
    id: 'days11-13',
    title: 'Days of Tashriq in Mina',
    when: '11–13 Dhu al-Hijjah',
    points: [
      'Each day after Dhuhr, stone all three jamarat in order — small, middle, large — seven pebbles each.',
      'Make dua facing the Qibla after the small and middle jamarat.',
      'You may leave Mina on the 12th before sunset, or stay for the 13th.',
    ],
    duas: [HAJJ_DUAS.jamarat],
    laps: { count: 21, label: 'Pebble', note: 'Seven at each of the three jamarat.' },
  },
  {
    id: 'farewell',
    title: 'Farewell tawaf',
    when: 'Before leaving Makkah',
    points: ['Make seven rounds of tawaf as the last thing before leaving Makkah. Women in menses are excused.'],
    laps: { count: 7, label: 'Round', note: 'Tap at the Black Stone line each time you complete a round.' },
  },
];

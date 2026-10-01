/** Short phrases of dhikr for the tasbeeh counter. */
export const PHRASES = {
  subhanallah: { arabic: 'سُبْحَانَ اللَّهِ', latin: 'SubhanAllah', english: 'Glory be to Allah' },
  alhamdulillah: { arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', english: 'All praise is for Allah' },
  allahuakbar: { arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allahu akbar', english: 'Allah is the Greatest' },
  tahlil: { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', latin: 'La ilaha illallah', english: 'None has the right to be worshipped but Allah' },
  tahlilFull: {
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir",
    english: 'None has the right to be worshipped but Allah alone, with no partner; His is the dominion and the praise, and He has power over all things',
  },
  istighfar: { arabic: 'أَسْتَغْفِرُ اللَّهَ', latin: 'Astaghfirullah', english: 'I seek Allah’s forgiveness' },
  subhanallahWaBihamdihi: { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', latin: 'SubhanAllahi wa bihamdihi', english: 'Glory be to Allah and praise be to Him' },
} as const;

export type PhraseId = keyof typeof PHRASES;

export type Preset = {
  id: string;
  name: string;
  hint: string;
  steps: { phrase: PhraseId; count: number }[];
  source?: string;
};

export const PRESETS: Preset[] = [
  {
    id: 'after-prayer',
    name: 'After prayer',
    hint: '33 + 33 + 33, then the tahlil once to make 100',
    steps: [
      { phrase: 'subhanallah', count: 33 },
      { phrase: 'alhamdulillah', count: 33 },
      { phrase: 'allahuakbar', count: 33 },
      { phrase: 'tahlilFull', count: 1 },
    ],
    source: 'Sahih Muslim 597',
  },
  {
    id: 'bedtime',
    name: 'Before sleeping',
    hint: '33 + 33 + 34',
    steps: [
      { phrase: 'subhanallah', count: 33 },
      { phrase: 'alhamdulillah', count: 33 },
      { phrase: 'allahuakbar', count: 34 },
    ],
    source: 'Sahih al-Bukhari 3705, Sahih Muslim 2727',
  },
];

export const FREE_PHRASES: PhraseId[] = ['subhanallah', 'alhamdulillah', 'allahuakbar', 'tahlil', 'istighfar', 'subhanallahWaBihamdihi'];
export const FREE_TARGETS = [33, 100, 0] as const; // 0 = no target

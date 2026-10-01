/*
 * "Check a claim": a curated list of claims that circulate in viral posts, with
 * what the sources say. This is not AI-generated at runtime — every answer here
 * is written in advance and must be checked by a scholar before release.
 */
export type Verdict = 'authentic' | 'partly' | 'weak' | 'no-basis';

export type Claim = {
  id: string;
  claim: string;
  /** Extra words people use, to help search match. */
  keywords: string[];
  verdict: Verdict;
  answer: string;
  authentic?: string;
  sources: string;
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  authentic: 'Authentic',
  partly: 'Partly authentic',
  weak: 'Weak narration',
  'no-basis': 'No reliable basis',
};

export const CLAIMS: Claim[] = [
  {
    id: 'yasin-wishes',
    claim: 'Surah Yasin fulfils all wishes',
    keywords: ['yaseen', 'yasin', 'یسین', 'یٰسین', 'wishes', 'needs', 'خواہشات', 'حاجات'],
    verdict: 'weak',
    answer: 'Narrations promising that Yasin fulfils needs or wishes are weak. "Fulfils all wishes" is not a reliable hadith.',
    authentic: 'Reciting any part of the Quran is rewarded, and Yasin is part of the Quran.',
    sources: 'Narrations in Ad-Darimi and others, graded weak by hadith scholars',
  },
  {
    id: 'yasin-heart',
    claim: 'Surah Yasin is the heart of the Quran',
    keywords: ['yaseen', 'yasin', 'heart', 'دل', 'قلب'],
    verdict: 'weak',
    answer: 'The narration "Everything has a heart, and the heart of the Quran is Yasin" is graded weak; At-Tirmidhi himself called it gharib.',
    sources: 'Tirmidhi 2887',
  },
  {
    id: 'fath-enemies',
    claim: 'Surah Al-Fath protects from enemies',
    keywords: ['fath', 'fatah', 'فتح', 'enemies', 'دشمن'],
    verdict: 'no-basis',
    answer: 'No reliable narration links Surah Al-Fath to protection from enemies.',
    authentic: 'The Prophet ﷺ said Surah Al-Fath was dearer to him than everything the sun rises upon.',
    sources: 'Sahih al-Bukhari 4177',
  },
  {
    id: 'tawbah-illness',
    claim: 'Surah At-Tawbah protects from illness',
    keywords: ['tawbah', 'taubah', 'tauba', 'توبہ', 'illness', 'disease', 'بیماری'],
    verdict: 'no-basis',
    answer: 'There is no narration giving Surah At-Tawbah this virtue.',
    authentic: 'The Quran as a whole is described as healing (shifa) for what is in the hearts (Quran 10:57, 17:82).',
    sources: 'Quran 10:57, 17:82',
  },
  {
    id: 'waqiah-poverty',
    claim: 'Reading Surah Al-Waqi\'ah every night prevents poverty',
    keywords: ['waqiah', 'waqia', 'واقعہ', 'poverty', 'rizq', 'rizk', 'رزق', 'فاقہ', 'wealth'],
    verdict: 'weak',
    answer: 'The narration "Whoever reads Al-Waqi\'ah every night will never be afflicted by poverty" is graded weak by most hadith scholars, including Imam Ahmad.',
    sources: 'Narrated by Ibn as-Sunni and Al-Bayhaqi; graded weak',
  },
  {
    id: 'mulk-grave',
    claim: 'Surah Al-Mulk saves from the punishment of the grave',
    keywords: ['mulk', 'tabarak', 'ملک', 'تبارک', 'grave', 'قبر'],
    verdict: 'authentic',
    answer: 'Supported. Surah Al-Mulk intercedes for its reciter until he is forgiven, and it is described as the protector from the punishment of the grave. The wording "lights up the grave" is not established.',
    sources: 'Tirmidhi 2891, Abu Dawud 1400 (hasan); An-Nasa\'i, al-Kubra (hasan)',
  },
  {
    id: 'sajdah-hereafter',
    claim: 'Surah As-Sajdah saves from punishment in the Hereafter',
    keywords: ['sajdah', 'sajda', 'سجدہ', 'alif lam meem', 'hereafter', 'آخرت'],
    verdict: 'partly',
    answer: 'The practice is authentic: the Prophet ﷺ would not sleep until he had recited As-Sajdah and Al-Mulk. The specific promise of saving from punishment in the Hereafter comes from weak narrations.',
    sources: 'Tirmidhi 2892',
  },
  {
    id: 'rahman-face',
    claim: 'Surah Ar-Rahman brings light (noor) to the face',
    keywords: ['rahman', 'رحمن', 'رحمٰن', 'noor', 'nur', 'face', 'چہرے', 'نور', 'bride', 'عروس'],
    verdict: 'no-basis',
    answer: 'There is no source for "brings light to the face". The narration calling Ar-Rahman "the bride of the Quran" is weak.',
    sources: 'Al-Bayhaqi, Shu\'ab al-Iman (weak)',
  },
  {
    id: 'kursi-after-salah',
    claim: 'Reading Ayat al-Kursi after every obligatory prayer — only death stands between you and Paradise',
    keywords: ['ayat al kursi', 'ayatul kursi', 'آیت الکرسی', 'after prayer', 'paradise', 'jannah', 'جنت'],
    verdict: 'authentic',
    answer: 'Graded authentic by several scholars: whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.',
    sources: 'An-Nasa\'i, al-Kubra 9928 (graded sahih by Al-Albani)',
  },
  {
    id: 'china',
    claim: 'Seek knowledge even if it is in China',
    keywords: ['china', 'چین', 'knowledge', 'علم'],
    verdict: 'no-basis',
    answer: 'This is not a reliable hadith; scholars graded it fabricated or very weak.',
    authentic: 'Seeking knowledge is an obligation on every Muslim (Ibn Majah 224, graded sahih by Al-Albani).',
    sources: 'Ibn Majah 224 for the authentic wording',
  },
  {
    id: 'mother-feet',
    claim: 'Paradise lies under the feet of mothers',
    keywords: ['mother', 'ماں', 'feet', 'قدموں', 'paradise', 'jannah', 'جنت'],
    verdict: 'partly',
    answer: 'The famous wording is weak, but the meaning is authentic: a man asked about going to fight, and the Prophet ﷺ told him to stay with his mother, "for Paradise is at her feet."',
    sources: 'An-Nasa\'i 3104 (hasan)',
  },
  {
    id: 'forward-message',
    claim: 'Forward this message to 10 people or something bad will happen',
    keywords: ['forward', 'share', 'آگے', 'bad luck', 'chain', 'whatsapp', '10 people'],
    verdict: 'no-basis',
    answer: 'Chain messages that promise reward for forwarding, or threaten harm if you do not, have no basis in the Quran or Sunnah. Attributing such promises to the religion without evidence is a serious matter.',
    sources: 'Sahih al-Bukhari 110: "Whoever lies about me deliberately, let him take his seat in the Fire."',
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[ً-ٰٟ]/g, '').replace(/['’`-]/g, '');

export function searchClaims(q: string): Claim[] {
  const words = norm(q).split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return CLAIMS;
  return CLAIMS.map((c) => {
    const hay = norm([c.claim, ...c.keywords].join(' '));
    return { c, score: words.filter((w) => hay.includes(w)).length };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);
}

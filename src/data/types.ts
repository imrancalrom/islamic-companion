export type Grade = 'Quran' | 'Sahih' | 'Hasan';

/** One dhikr or dua. Text must come from a verified source — never generated. */
export type Entry = {
  id: string;
  title: string;
  arabic: string;
  /** 'quran' = text generated from Tanzil (src/data/quran.generated.ts); shown in the Amiri Quran font. */
  script?: 'quran';
  transliteration?: string;
  urdu: string;
  english: string;
  /** How many times to repeat it. */
  count: number;
  /** The reward or reason, as stated in the source. */
  virtue?: string;
  /** Book and number, e.g. "Sahih Muslim 2692". */
  source: string;
  grade: Grade;
  /**
   * false until a qualified scholar has checked the Arabic, translations and
   * grading against the source. The app shows a "pending review" label until then.
   */
  reviewed: boolean;
};

export type Session = 'morning' | 'evening' | 'night';

export type Dhikr = Entry & { sessions: Session[] };

export type DuaCategory = {
  id: string;
  name: string;
  icon: 'sun' | 'moon' | 'plane' | 'food' | 'heart' | 'plus';
};

export type Dua = Entry & { category: string };

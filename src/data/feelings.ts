import { ADHKAR } from './adhkar';
import { DUAS } from './duas';
import type { Entry } from './types';

/** "I'm feeling…" — authentic duas for a situation, drawn from the verified library. */
export type Feeling = { id: string; label: string; note: string; ids: string[] };

export const FEELINGS: Feeling[] = [
  { id: 'anxious', label: 'Anxious', note: 'When worry weighs on you', ids: ['hamm-hazan', 'karb', 'bismillah-alladhi'] },
  { id: 'sad', label: 'Sad', note: 'In grief or low moments', ids: ['yunus', 'hamm-hazan'] },
  { id: 'grateful', label: 'Grateful', note: 'To give thanks', ids: ['gratitude', 'after-eating'] },
  { id: 'angry', label: 'Angry', note: 'To calm the heart', ids: ['anger'] },
  { id: 'sick', label: 'Sick or in pain', note: 'For yourself or someone you visit', ids: ['pain', 'visiting-sick'] },
  { id: 'sinful', label: 'Regretful', note: 'Seeking forgiveness', ids: ['sayyid-al-istighfar', 'yunus'] },
  { id: 'afraid', label: 'Afraid', note: 'For protection', ids: ['ayat-al-kursi', 'audhu-bikalimat', 'al-falaq', 'an-nas'] },
];

const ALL: Entry[] = [...DUAS, ...ADHKAR];

export const entriesFor = (f: Feeling): Entry[] =>
  f.ids.map((id) => ALL.find((e) => e.id === id)).filter((e): e is Entry => !!e);

export const findEntry = (id: string) => ALL.find((e) => e.id === id);
export const ALL_ENTRIES = ALL;

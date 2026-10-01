import { dayKey, Settings } from './settings';
import { addDays } from './tracker';

/** Days until the next review for each Leitner box. */
export const INTERVALS = [1, 2, 4, 8, 16, 32];

/** Moves an entry up a box when remembered, back to the first box when not. */
export function review(memo: Settings['memo'], id: string, remembered: boolean, today = new Date()): Settings['memo'] {
  const box = remembered ? Math.min((memo[id]?.box ?? -1) + 1, INTERVALS.length - 1) : 0;
  return { ...memo, [id]: { box, due: dayKey(addDays(today, INTERVALS[box])) } };
}

export const isDue = (memo: Settings['memo'], id: string, today = new Date()) =>
  !!memo[id] && memo[id].due <= dayKey(today);

/**
 * Which words to hide at a level from 0 (none) to 4 (all). The pattern spreads
 * hidden words through the text instead of hiding the end first.
 */
export const hidden = (index: number, level: number) => level >= 4 || ((index * 3) % 4) < level;

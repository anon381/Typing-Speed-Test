export interface Passage { id: string; text: string; }

export const passages: Passage[] = [
  { id: 'classic-fox', text: 'The quick brown fox jumps over the lazy dog. Practice makes perfect.' },
  { id: 'focus-flow', text: 'Focus on accuracy first; speed will grow naturally as your fingers learn the path.' },
  { id: 'keyboard-rhythm', text: 'Typing is a rhythm game disguised as productivity. Find a steady cadence and let errors fade.' },
  { id: 'consistency', text: 'Consistent deliberate practice compounds. Small daily improvements lead to remarkable speed.' },
  { id: 'calm-breath', text: 'Stay calm, breathe evenly, and let muscle memory guide each letter into place.' }
];

export function randomPassage(excludeId?: string): Passage {
  const filtered = excludeId ? passages.filter(p => p.id !== excludeId) : passages;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
/**
 * passages.ts
 * -------------------
 * This module defines typing practice passages and provides a utility to get a random passage.
 *
 * 1. Passage Interface:
 *    - `id`: Unique identifier for the passage
 *    - `text`: The content of the passage
 *
 * 2. passages Array:
 *    - Contains a set of predefined passages for typing practice.
 *    - Each passage has a unique `id` and a motivating or instructional text.
 *
 * 3. randomPassage Function:
 *    - Returns a random passage from the `passages` array.
 *    - Optional `excludeId` parameter lets you skip a specific passage to avoid repetition.
 *    - Usage: `const passage = randomPassage();` or `const passage = randomPassage('classic-fox');`
 *
 * Example:
 * ```
 * const nextPassage = randomPassage('focus-flow');
 * console.log(nextPassage.text);
 * ```
 */

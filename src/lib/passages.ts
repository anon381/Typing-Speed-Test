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

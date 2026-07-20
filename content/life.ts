import type { LifeThing } from '@/types/content';

/**
 * The things I love — each opens a handwritten note (REQUIREMENTS §5, ch.5).
 * Mirrors the objects in the reference scene (coffee, books, plant, music). Edit (§15).
 */
export const LIFE: LifeThing[] = [
  { id: 'coffee', icon: '☕', label: 'Coffee', note: 'The mug says "Code · Build · Make an Impact." It\'s right more often than I am.' },
  { id: 'music', icon: '🎧', label: 'Lo-fi', note: 'Focus Flow on repeat. It turns a noisy mind into a quiet workshop.' },
  { id: 'books', icon: '📚', label: 'Books', note: 'Clean Code, The Pragmatic Programmer, Atomic Habits — the ones I keep re-reading.' },
  { id: 'rain', icon: '🌧️', label: 'Rain', note: 'Best soundtrack ever written. Especially against a window at night.' },
  { id: 'plant', icon: '🪴', label: 'My plant', note: 'The label reads FOCUS · BUILD · GROW. It grows slower than I\'d like. So do I.' },
  { id: 'camera', icon: '📷', label: 'Photography', note: 'A reason to leave the desk and notice the light.' },
  { id: 'fitness', icon: '🏃', label: 'Moving', note: 'The clearest my head ever gets is somewhere in the middle of a run.' },
  { id: 'home', icon: '🏡', label: 'Home', note: 'Wherever there\'s chai and the people who knew me before any of this.' },
];

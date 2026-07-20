import type { CharacterFeatures } from '@/types/content';

/**
 * Likeness features extracted from the reference illustration (curly dark hair, full
 * beard, warm brown skin, black shirt, no glasses). The rig itself is generic (§13.6) —
 * everything identity-bearing lives here so it can be tuned in one place.
 */
export const CHARACTER: CharacterFeatures = {
  skinTone: '#C0855A',
  skinShade: '#A66C44',
  hairColor: '#241C17',
  hairStyle: 'curly-crop',
  facialHair: 'beard',
  shirtColor: '#211E1B',
  glasses: false,
};

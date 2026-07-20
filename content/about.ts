import type { AboutContent } from '@/types/content';

/**
 * Seed content drawn from the reference illustration (the "Building Tomorrow Today" sign,
 * the "Discipline Creates Freedom" quote, the Lo-Fi listening widget, the book stack).
 * Replace the softer/placeholder lines with your own words — this is the emotional anchor
 * of the whole story (REQUIREMENTS §1, §15).
 */
export const ABOUT: AboutContent = {
  name: 'Omkar',
  role: 'Engineer · Problem Solver · Visionary',
  intro: [
    "Hello. I'm Omkar.",
    "This isn't my portfolio. It's a collection of moments that made me who I am.",
    'I build things for a living, but I think the more honest way to say it is: I like turning quiet ideas into things people can actually use.',
  ],
  values: [
    { label: 'Discipline', note: 'Discipline creates freedom. The boring days are the ones that compound.' },
    { label: 'Craft', note: 'Good code, better world. I care how a thing is made, not just that it works.' },
    { label: 'Curiosity', note: 'I would rather be a beginner at ten things than an expert who stopped asking why.' },
    { label: 'Impact', note: 'Plan, build, test, deploy, make an impact — in that order, every time.' },
  ],
  quote: { text: 'Discipline creates freedom.', author: 'a sticky note above my desk' },
  favorites: {
    season: 'monsoon — the smell of the first rain on warm ground',
    place: 'my desk at 2am, city lights outside the window',
    food: 'chai and something my mother cooked',
    music: 'lo-fi beats when I build, old Bollywood when I miss home',
  },
  smiles: [
    'the first sip of coffee before the world wakes up',
    'a green test suite on the first try',
    'rain against the window while I code',
    'someone using a thing I made without knowing I made it',
  ],
  randomFacts: [
    'I keep a running checklist: Plan · Build · Test · Deploy · Make Impact.',
    'I read Atomic Habits at the exact right time in my life.',
    'I name my side projects before I write a single line.',
    'I believe a good keyboard is a real productivity tool, not a vanity.',
  ],
};

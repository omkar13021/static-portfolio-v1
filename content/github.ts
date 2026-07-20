import type { GithubSnapshot } from '@/types/content';

/**
 * Static, manually curated snapshot (REQUIREMENTS §15 item 3 — no live API in a static
 * build). Numbers mirror the "GitHub Activity" widget in the reference illustration.
 * Refresh by hand and bump `lastUpdated`.
 */
export const GITHUB: GithubSnapshot = {
  lastUpdated: '2026-07-20',
  username: 'omkar',
  commitsThisWeek: 37,
  pullRequests: 12,
  repositories: 5,
  // Mon → Sun intensity, 0–4
  week: [3, 4, 2, 4, 3, 1, 2],
  pinned: [
    { name: 'storybook-portfolio', description: 'This interactive story, told in eleven chapters.', language: 'TypeScript', stars: 0 },
    { name: 'nightlight', description: 'Offline-first, one-box idea catcher.', language: 'TypeScript', stars: 0 },
    { name: 'atlas', description: 'Turned three spreadsheets into one calm system.', language: 'TypeScript', stars: 0 },
  ],
};

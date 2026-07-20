import type { Chapter, ChapterId } from '@/types/chapter';

/**
 * The single source of truth for chapter order, identity, world palette, and character
 * pose (REQUIREMENTS §5, §5A, §10.5). Order is fixed. Adjacency, prefetch, and camera
 * direction all derive from this array's index — never a hardcoded number.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'welcome',
    icon: '👋',
    label: 'Welcome',
    tagline: 'Building tomorrow, today.',
    pose: 'waving',
    is3D: false,
    palette: {
      bg: ['#2A3E52', '#243748', '#1B2A38'],
      ink: '#F5EEDF',
      accent: '#E4B95B',
      glow: '#E4B95B',
      mood: 'dusk',
    },
  },
  {
    id: 'journey',
    icon: '🎓',
    label: 'Journey',
    tagline: 'A winding road, not a timeline.',
    pose: 'walking',
    is3D: false,
    palette: {
      bg: ['#EDE0C4', '#E7D9BE', '#DcC9A6'],
      ink: '#2B2420',
      accent: '#C86A4A',
      glow: '#E4B95B',
      mood: 'day',
    },
  },
  {
    id: 'experience',
    icon: '💼',
    label: 'Experience',
    tagline: 'Rooms I have worked and grown in.',
    pose: 'presenting',
    is3D: false,
    palette: {
      bg: ['#F1E7D2', '#E9DCC0', '#DFCCA8'],
      ink: '#2B2420',
      accent: '#3C5A46',
      glow: '#E4B95B',
      mood: 'day',
    },
  },
  {
    id: 'projects',
    icon: '🚀',
    label: 'Projects',
    tagline: 'Step into the software lab.',
    pose: 'working',
    is3D: true,
    palette: {
      bg: ['#1C2A38', '#182430', '#121C26'],
      ink: '#EAF2EC',
      accent: '#5FB98A',
      glow: '#5FB98A',
      mood: 'night',
    },
  },
  {
    id: 'engineering',
    icon: '💻',
    label: 'Engineering',
    tagline: 'A workshop of tools and craft.',
    pose: 'thinking',
    is3D: false,
    palette: {
      bg: ['#26201A', '#221C17', '#191410'],
      ink: '#F0E6D2',
      accent: '#E4B95B',
      glow: '#C86A4A',
      mood: 'dusk',
    },
  },
  {
    id: 'github',
    icon: '🐙',
    label: 'GitHub',
    tagline: 'A workspace at 2am — not a dashboard.',
    pose: 'working',
    is3D: true,
    palette: {
      bg: ['#12161C', '#0F1319', '#0A0D12'],
      ink: '#D8E6DA',
      accent: '#5FB98A',
      glow: '#3FA372',
      mood: 'night',
    },
  },
  {
    id: 'writing',
    icon: '📝',
    label: 'Writing',
    tagline: 'A quiet creative studio.',
    pose: 'reading',
    is3D: false,
    palette: {
      bg: ['#F6F0E2', '#F0E8D6', '#E7DCC4'],
      ink: '#2B2420',
      accent: '#22384F',
      glow: '#E4B95B',
      mood: 'day',
    },
  },
  {
    id: 'learning',
    icon: '📚',
    label: 'Learning',
    tagline: 'A room made of ideas.',
    pose: 'thinking',
    is3D: true,
    palette: {
      bg: ['#1E2440', '#191F36', '#12172A'],
      ink: '#E6E9F5',
      accent: '#8FA7E4',
      glow: '#A9C0FF',
      mood: 'night',
    },
  },
  {
    id: 'life',
    icon: '❤️',
    label: 'Life',
    tagline: 'The things that make me, me.',
    pose: 'coffee',
    is3D: false,
    palette: {
      bg: ['#F3E3CE', '#EED8BC', '#E4C9A4'],
      ink: '#2B2420',
      accent: '#C86A4A',
      glow: '#E4B95B',
      mood: 'dawn',
    },
  },
  {
    id: 'gallery',
    icon: '📷',
    label: 'Gallery',
    tagline: 'Moments, pinned to the wall.',
    pose: 'idle',
    is3D: false,
    palette: {
      bg: ['#EFE7D6', '#E7DCC6', '#DBCDB0'],
      ink: '#2B2420',
      accent: '#3C5A46',
      glow: '#E4B95B',
      mood: 'day',
    },
  },
  {
    id: 'contact',
    icon: '🤝',
    label: 'Contact',
    tagline: 'Every story is unfinished.',
    pose: 'stargazing',
    is3D: true,
    palette: {
      bg: ['#161B2E', '#111527', '#0B0E1C'],
      ink: '#EDEFF8',
      accent: '#E4B95B',
      glow: '#A9C0FF',
      mood: 'night',
    },
  },
];

/** Fixed order of chapter ids. */
export const CHAPTER_ORDER: ChapterId[] = CHAPTERS.map((c) => c.id);

export const CHAPTER_MAP: Record<ChapterId, Chapter> = CHAPTERS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<ChapterId, Chapter>,
);

export const FIRST_CHAPTER: ChapterId = CHAPTER_ORDER[0];

export function chapterIndex(id: ChapterId): number {
  return CHAPTER_ORDER.indexOf(id);
}

/** Direction of travel between two chapters: +1 forward, -1 backward, 0 same. */
export function direction(from: ChapterId, to: ChapterId): 1 | -1 | 0 {
  const d = chapterIndex(to) - chapterIndex(from);
  return d === 0 ? 0 : d > 0 ? 1 : -1;
}

import { create } from 'zustand';
import type { ChapterId } from '@/types/chapter';
import { CHAPTER_ORDER, FIRST_CHAPTER, chapterIndex, direction } from '@/content/chapters';

/**
 * Chapter state machine (REQUIREMENTS §10.2). A single lightweight store drives which
 * world is mounted. `direction` lets the Stage animate forward/back coherently.
 */
interface StoryState {
  active: ChapterId;
  previous: ChapterId | null;
  /** +1 forward through the story, -1 back, 0 initial. */
  dir: 1 | -1 | 0;
  /** True during the ~1s transition; used to debounce rapid clicks (§6, §11.5). */
  transitioning: boolean;
  hasEntered: boolean;
  go: (to: ChapterId) => void;
  next: () => void;
  prev: () => void;
  setTransitioning: (v: boolean) => void;
  enter: () => void;
}

function isChapterId(value: string): value is ChapterId {
  return (CHAPTER_ORDER as string[]).includes(value);
}

/** Read an initial chapter from the URL hash (#chapter=projects) for shareable deep links. */
function initialChapter(): ChapterId {
  if (typeof window === 'undefined') return FIRST_CHAPTER;
  const match = window.location.hash.match(/chapter=([a-z]+)/);
  if (match && isChapterId(match[1])) return match[1];
  return FIRST_CHAPTER;
}

export const useStory = create<StoryState>((set, get) => ({
  active: FIRST_CHAPTER,
  previous: null,
  dir: 0,
  transitioning: false,
  hasEntered: false,

  go: (to) => {
    const { active } = get();
    if (to === active) return;
    set({
      previous: active,
      active: to,
      dir: direction(active, to),
      transitioning: true,
    });
    // Reflect in the hash without adding history noise per keystroke; keeps deep links.
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#chapter=${to}`);
    }
  },

  next: () => {
    const i = chapterIndex(get().active);
    const to = CHAPTER_ORDER[Math.min(i + 1, CHAPTER_ORDER.length - 1)];
    get().go(to);
  },

  prev: () => {
    const i = chapterIndex(get().active);
    const to = CHAPTER_ORDER[Math.max(i - 1, 0)];
    get().go(to);
  },

  setTransitioning: (v) => set({ transitioning: v }),
  enter: () => set({ hasEntered: true }),
}));

/** Call once on mount to sync the store with a deep-linked hash. */
export function hydrateFromHash() {
  const id = initialChapter();
  if (id !== useStory.getState().active) {
    useStory.setState({ active: id, hasEntered: id !== FIRST_CHAPTER });
  }
}

'use client';

import { useEffect } from 'react';
import Stage from '@/components/stage/Stage';
import StoryCarousel from '@/components/carousel/StoryCarousel';
import { hydrateFromHash, useStory } from '@/lib/store';

/**
 * The whole experience (REQUIREMENTS §4). Exactly two regions in a fixed viewport grid:
 * the Stage (flexible remainder) and the Story Carousel (clamped band). Nothing scrolls
 * the document. This is the only route.
 */
export default function Storybook() {
  const next = useStory((s) => s.next);
  const prev = useStory((s) => s.prev);

  // Deep-link hydration + global left/right chapter navigation (§14.3).
  useEffect(() => {
    hydrateFromHash();
    const onKey = (e: KeyboardEvent) => {
      // Ignore when focus is inside the carousel tablist (it handles its own arrows).
      const target = e.target as HTMLElement;
      if (target?.getAttribute('role') === 'tab') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <main
      className="grid h-full w-full overflow-hidden bg-ink"
      style={{ gridTemplateRows: 'minmax(0, 1fr) var(--carousel-h)' }}
    >
      {/* Stage — flexible remainder */}
      <div id="stage-panel" role="tabpanel" aria-live="off" className="relative min-h-0">
        <Stage />
      </div>

      {/* Story Carousel — clamped band pinned to the bottom */}
      <div className="relative z-20 border-t border-white/5 bg-gradient-to-b from-[#1b2836] to-[#141d27]">
        <StoryCarousel />
      </div>
    </main>
  );
}

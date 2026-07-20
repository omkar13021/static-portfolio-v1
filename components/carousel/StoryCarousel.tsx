'use client';

import { useEffect, useRef, useState } from 'react';
import { useStory } from '@/lib/store';
import { CHAPTERS, chapterIndex } from '@/content/chapters';
import type { ChapterId } from '@/types/chapter';
import StoryCard from './StoryCard';

/**
 * Bottom Story Carousel (REQUIREMENTS §4, §5, §8.3). A horizontal, draggable strip of
 * collectible cards. Implements the ARIA tab pattern with roving tabindex and full
 * keyboard traversal (§14.3); the active card auto-scrolls into view.
 */
export default function StoryCarousel() {
  const active = useStory((s) => s.active);
  const go = useStory((s) => s.go);
  const transitioning = useStory((s) => s.transitioning);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Which card holds tabindex=0 (roving); starts on the active chapter.
  const [focusIndex, setFocusIndex] = useState(() => chapterIndex(active));

  // Keep the roving focus + scroll position synced to the active chapter.
  useEffect(() => {
    const i = chapterIndex(active);
    setFocusIndex(i);
    const el = cardRefs.current[active];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  const select = (id: ChapterId) => {
    if (transitioning) return; // debounce rapid switching (§6)
    go(id);
  };

  const moveFocus = (delta: number) => {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, focusIndex + delta));
    setFocusIndex(next);
    const id = CHAPTERS[next].id;
    cardRefs.current[id]?.focus();
    cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(-1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusIndex(0);
        cardRefs.current[CHAPTERS[0].id]?.focus();
        break;
      case 'End':
        e.preventDefault();
        setFocusIndex(CHAPTERS.length - 1);
        cardRefs.current[CHAPTERS[CHAPTERS.length - 1].id]?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(CHAPTERS[focusIndex].id);
        break;
    }
  };

  const scrollByCards = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="relative flex h-full w-full items-center">
      {/* Prev/next page-turn tabs (desktop/tablet; hidden on touch where swipe is primary) */}
      <button
        onClick={() => scrollByCards(-1)}
        aria-label="Scroll cards left"
        className="focus-ring absolute left-1 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-black/30 font-hand text-lg text-cream backdrop-blur md:flex"
      >
        ‹
      </button>

      <div
        ref={trackRef}
        role="tablist"
        aria-label="Story chapters"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="no-scrollbar allow-touch flex h-full w-full items-center gap-3 overflow-x-auto px-[10vw] py-3 md:px-14"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {CHAPTERS.map((chapter, i) => (
          <div key={chapter.id} style={{ scrollSnapAlign: 'center' }} className="flex h-full items-center">
            <StoryCard
              chapter={chapter}
              index={i}
              active={chapter.id === active}
              focused={i === focusIndex}
              onSelect={() => select(chapter.id)}
              registerRef={(el) => {
                cardRefs.current[chapter.id] = el;
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollByCards(1)}
        aria-label="Scroll cards right"
        className="focus-ring absolute right-1 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-black/30 font-hand text-lg text-cream backdrop-blur md:flex"
      >
        ›
      </button>
    </div>
  );
}

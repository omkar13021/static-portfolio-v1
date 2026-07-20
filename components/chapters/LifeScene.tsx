'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { LIFE } from '@/content/life';
import { ABOUT } from '@/content/about';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Life — the things I love, each opening a handwritten note (REQUIREMENTS §5, ch.5).
 * Floating interactive objects orbit a warm home scene; tapping one reveals its note.
 */
export default function LifeScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.life;
  const { ink, accent } = chapter.palette;
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const active = LIFE.find((l) => l.id === open) ?? null;

  // Scatter objects around the right two-thirds of the stage.
  const spots = LIFE.map((_, i) => {
    const cols = 4;
    const col = i % cols;
    const row = Math.floor(i / cols);
    return { x: 40 + col * 15, y: 26 + row * 30 };
  });

  return (
    <div className="relative h-full w-full">
      {/* Title + favorite quote */}
      <div className="absolute left-[var(--stage-pad)] top-[10%] z-10 max-w-xs">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>The things I love</p>
          <h1 className="text-title font-medium" style={{ color: ink }}>Life, off the clock</h1>
          <p className="mt-3 font-hand text-lg" style={{ color: ink, opacity: 0.75 }}>
            &ldquo;{ABOUT.quote.text}&rdquo;
          </p>
        </ContentItem>
      </div>

      {/* Character with coffee, bottom-left */}
      <div className="pointer-events-none absolute bottom-0 left-[1%] flex items-end" style={{ height: 'clamp(200px, 52%, 460px)' }}>
        <Character pose="coffee" parallax={parallax} className="h-full" />
      </div>

      {/* Floating objects */}
      {LIFE.map((thing, i) => (
        <motion.button
          key={thing.id}
          onClick={() => setOpen(open === thing.id ? null : thing.id)}
          aria-label={thing.label}
          aria-expanded={open === thing.id}
          className="focus-ring absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl shadow-lg"
          style={{
            left: `${spots[i].x}%`,
            top: `${spots[i].y}%`,
            background: open === thing.id ? accent : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(2px)',
          }}
          animate={reduced ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
        >
          {thing.icon}
        </motion.button>
      ))}

      {/* Handwritten note */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            className="absolute bottom-[8%] left-1/2 z-20 w-[min(88%,420px)] -translate-x-1/2"
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <StageMarker variant="note" className="px-6 py-5">
              <p className="font-hand text-2xl leading-snug">{active.icon} {active.note}</p>
            </StageMarker>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

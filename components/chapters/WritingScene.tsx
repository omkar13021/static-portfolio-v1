'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { WRITING } from '@/content/writing';
import SceneShell from '@/components/stage/SceneShell';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Writing — a quiet creative studio (REQUIREMENTS §5). Pages drift in the air; picking one
 * settles it onto the desk to read. Character reads at the side.
 */
export default function WritingScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.writing;
  const { ink, accent } = chapter.palette;
  const [open, setOpen] = useState(0);
  const piece = WRITING[open];
  const reduced = useReducedMotion();

  return (
    <SceneShell pose="reading" parallax={parallax} characterSide="left">
      <ContentItem>
        <p className="font-hand text-xl" style={{ color: accent }}>The studio</p>
        <h1 className="text-title font-medium" style={{ color: ink }}>Things I write</h1>
      </ContentItem>

      {/* Floating page tabs */}
      <ContentItem>
        <div className="mt-5 flex flex-col gap-2">
          {WRITING.map((w, i) => (
            <motion.button
              key={w.id}
              onClick={() => setOpen(i)}
              aria-pressed={i === open}
              className="focus-ring flex items-center gap-3 rounded-sm px-3 py-2 text-left"
              style={{
                background: i === open ? '#fffdf4' : '#f2ead8',
                boxShadow: i === open ? `0 8px 18px -8px ${accent}` : '0 3px 8px -6px #0006',
              }}
              animate={reduced ? {} : { y: i === open ? 0 : [0, -2, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity }}
              whileHover={{ x: 4 }}
            >
              <span
                className="rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-wider"
                style={{ background: accent, color: '#fff' }}
              >
                {w.kind}
              </span>
              <span className="text-sm font-medium">{w.title}</span>
            </motion.button>
          ))}
        </div>
      </ContentItem>

      {/* Open page */}
      <ContentItem>
        <StageMarker key={piece.id} variant="paper" className="mt-4 max-w-md px-6 py-5">
          <motion.div initial={{ opacity: 0, rotate: -1, y: 8 }} animate={{ opacity: 1, rotate: 0, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-hand text-lg" style={{ color: accent }}>{piece.date}</span>
            </div>
            <h3 className="font-serif text-xl leading-tight">{piece.title}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{piece.excerpt}</p>
          </motion.div>
        </StageMarker>
      </ContentItem>
    </SceneShell>
  );
}

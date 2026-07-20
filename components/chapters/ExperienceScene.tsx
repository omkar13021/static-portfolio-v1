'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { EXPERIENCE } from '@/content/experience';
import SceneShell from '@/components/stage/SceneShell';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';

/**
 * Experience — roles as rooms you step into (REQUIREMENTS §5). A row of "doors"; opening
 * one reveals that role's story on a brass plaque while the character presents it.
 */
export default function ExperienceScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.experience;
  const { ink, accent } = chapter.palette;
  const [open, setOpen] = useState(0);
  const role = EXPERIENCE[open];

  return (
    <SceneShell pose="presenting" parallax={parallax} characterSide="right">
      <ContentItem>
        <p className="font-hand text-xl" style={{ color: accent }}>Experience</p>
        <h1 className="text-title font-medium" style={{ color: ink }}>Rooms I&apos;ve grown in</h1>
      </ContentItem>

      {/* Door selector */}
      <ContentItem>
        <div className="mt-5 flex gap-2">
          {EXPERIENCE.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setOpen(i)}
              aria-pressed={i === open}
              className="focus-ring flex flex-col items-center gap-1"
            >
              <motion.span
                className="flex h-16 w-11 items-end justify-center rounded-t-md border-b-4 pb-1 text-lg shadow-inner"
                style={{
                  background: i === open ? accent : '#d8c4a0',
                  borderColor: i === open ? '#2b3a30' : '#b09468',
                  color: '#2b2420',
                }}
                animate={{ y: i === open ? -4 : 0 }}
              >
                🚪
              </motion.span>
              <span className="max-w-[64px] text-center text-[0.65rem] leading-tight opacity-70" style={{ color: ink }}>
                {r.company}
              </span>
            </button>
          ))}
        </div>
      </ContentItem>

      {/* Role plaque */}
      <ContentItem>
        <StageMarker key={role.id} variant="plaque" className="mt-5 max-w-md px-5 py-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{role.title}</h3>
              <span className="font-hand text-base" style={{ color: chapter.palette.accent }}>{role.period}</span>
            </div>
            <p className="mt-1 text-sm opacity-85">{role.summary}</p>
            <ul className="mt-3 space-y-1.5">
              {role.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-[0.82rem] opacity-80">
                  <span style={{ color: chapter.palette.accent }}>▹</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </StageMarker>
      </ContentItem>
    </SceneShell>
  );
}

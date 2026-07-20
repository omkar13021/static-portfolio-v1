'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { LEARNING } from '@/content/learning';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';
import CanvasStage from '@/three/CanvasStage';
import { IdeaOrbs } from '@/three/scenes/IdeaOrbs';

/**
 * Learning — a room made of ideas (REQUIREMENTS §5, ch. Learning). Concepts drift as
 * glowing orbs in space; a legend of topics floats in front, each with its status and a
 * note on why Omkar is chasing it.
 */
const STATUS_LABEL = {
  exploring: 'Exploring',
  practicing: 'Practicing',
  teaching: 'Teaching',
} as const;

export default function LearningScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.learning;
  const { ink, accent } = chapter.palette;
  const [active, setActive] = useState(0);
  const topic = LEARNING[active];

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <CanvasStage camera={{ position: [0, 0, 7], fov: 55 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 4]} intensity={30} color={accent} />
          <IdeaOrbs count={30} color={accent} />
        </CanvasStage>
      </div>

      <div className="pointer-events-none absolute left-[var(--stage-pad)] top-[8%] z-10">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>Always a beginner</p>
          <h1 className="text-title font-medium text-scrim" style={{ color: ink }}>What I&apos;m learning</h1>
        </ContentItem>
      </div>

      {/* Topic legend */}
      <div className="absolute left-[var(--stage-pad)] top-[28%] z-10 flex max-w-[220px] flex-wrap gap-2">
        {LEARNING.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="focus-ring rounded-full px-3 py-1 text-xs transition-all"
            style={{
              background: i === active ? accent : 'rgba(255,255,255,0.08)',
              color: i === active ? chapter.palette.bg[2] : ink,
              border: `1px solid ${i === active ? accent : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Selected concept note */}
      <div className="absolute bottom-[8%] left-1/2 z-10 w-[min(88%,440px)] -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
          >
            <StageMarker variant="glass" className="px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{topic.label}</h3>
                <span className="rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-wider" style={{ background: `${accent}33`, color: accent }}>
                  {STATUS_LABEL[topic.status]}
                </span>
              </div>
              <p className="mt-1 text-sm opacity-85">{topic.note}</p>
            </StageMarker>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-[3%] hidden items-end lg:flex" style={{ height: 'clamp(200px, 42%, 380px)' }}>
        <Character pose="thinking" parallax={parallax} className="h-full" />
      </div>
    </div>
  );
}

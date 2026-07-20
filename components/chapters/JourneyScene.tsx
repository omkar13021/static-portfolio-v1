'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { JOURNEY } from '@/content/journey';
import type { JourneyMilestone } from '@/types/content';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';

/**
 * Journey — a winding road, not a timeline (REQUIREMENTS §5, ch.3). Milestones sit as
 * signposts along a hand-drawn path; selecting one unfolds its memory. The character walks
 * the road at the currently-selected point.
 */

const MOTIF: Record<JourneyMilestone['motif'], string> = {
  seed: '🌱',
  book: '📖',
  monitor: '🖥️',
  building: '🏢',
  door: '🚪',
  mountain: '⛰️',
  star: '⭐',
};

export default function JourneyScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.journey;
  const { ink, accent } = chapter.palette;
  const [selected, setSelected] = useState(0);
  const active = JOURNEY[selected];

  // Distribute signposts along a gentle sine path across the stage.
  const points = JOURNEY.map((_, i) => {
    const t = i / (JOURNEY.length - 1);
    return { x: 8 + t * 84, y: 64 + Math.sin(t * Math.PI * 2) * 16 };
  });

  const pathD =
    `M ${points[0].x} ${points[0].y} ` +
    points
      .slice(1)
      .map((p, i) => {
        const prev = points[i];
        const cx = (prev.x + p.x) / 2;
        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      })
      .join(' ');

  return (
    <div className="relative h-full w-full">
      {/* Title */}
      <div className="absolute left-[var(--stage-pad)] top-[9%] z-10 max-w-sm">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>My journey</p>
          <h1 className="text-title font-medium" style={{ color: ink }}>A winding road</h1>
        </ContentItem>
      </div>

      {/* The road */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={pathD} fill="none" stroke={`${ink}22`} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="0.4 3" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={pathD}
          fill="none"
          stroke={accent}
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: (selected + 1) / JOURNEY.length }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </svg>

      {/* Signposts */}
      {points.map((p, i) => (
        <button
          key={JOURNEY[i].id}
          onClick={() => setSelected(i)}
          aria-label={`${JOURNEY[i].year}: ${JOURNEY[i].title}`}
          aria-pressed={i === selected}
          className="focus-ring absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-md"
            style={{
              background: i === selected ? accent : '#f7f1e3',
              outline: i === selected ? `3px solid ${accent}55` : 'none',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {MOTIF[JOURNEY[i].motif]}
          </motion.span>
        </button>
      ))}

      {/* Walking character at the selected point */}
      <motion.div
        className="pointer-events-none absolute z-10"
        animate={{ left: `${points[selected].x}%`, top: `${points[selected].y}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        style={{ height: 'clamp(150px, 34%, 300px)', transform: 'translate(-50%, -96%)' }}
      >
        <Character pose="walking" parallax={parallax} className="h-full" />
      </motion.div>

      {/* Selected memory — a paper signpost note */}
      <div className="absolute bottom-[6%] left-1/2 z-10 w-[min(90%,520px)] -translate-x-1/2">
        <StageMarker key={active.id} variant="paper" className="px-6 py-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="font-hand text-lg" style={{ color: accent }}>{active.year}</p>
            <h3 className="text-lg font-semibold">{active.title}</h3>
            <p className="mt-1 text-sm leading-relaxed opacity-80">{active.body}</p>
          </motion.div>
        </StageMarker>
      </div>
    </div>
  );
}

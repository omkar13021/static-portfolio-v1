'use client';

import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { GITHUB } from '@/content/github';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';
import CanvasStage from '@/three/CanvasStage';
import { FloatingGrid } from '@/three/scenes/FloatingGrid';
import { NightSky } from '@/three/scenes/NightSky';

/**
 * GitHub — a developer's workspace at 2am, not a dashboard (REQUIREMENTS §5, §11.1). The
 * numbers glow like a terminal in a dark room. The activity week reads as an in-world
 * contribution wall, not a chart widget.
 */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function heat(level: number, accent: string) {
  const a = [0.12, 0.32, 0.52, 0.75, 1][Math.max(0, Math.min(4, level))];
  return `${accent}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
}

export default function GithubScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.github;
  const { ink, accent } = chapter.palette;

  const stats = [
    { n: GITHUB.commitsThisWeek, label: 'Commits' },
    { n: GITHUB.pullRequests, label: 'Pull requests' },
    { n: GITHUB.repositories, label: 'Repositories' },
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <CanvasStage camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <NightSky count={500} color={accent} twinkle />
          <FloatingGrid color={accent} z={-4} />
        </CanvasStage>
      </div>

      <div className="pointer-events-none absolute left-[var(--stage-pad)] top-[8%] z-10">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>Late-night commits</p>
          <h1 className="text-title font-medium text-scrim" style={{ color: ink }}>The workspace</h1>
        </ContentItem>
      </div>

      {/* Terminal readout of the week */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[min(92%,560px)] -translate-x-1/2 -translate-y-1/2">
        <StageMarker variant="terminal" className="px-6 py-5">
          <p className="text-[0.7rem] opacity-60">~/omkar $ git log --since=&quot;this week&quot; --oneline | summary</p>

          <div className="mt-4 flex justify-between gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <div className="font-mono text-3xl font-bold" style={{ color: accent }}>{s.n}</div>
                <div className="text-[0.65rem] uppercase tracking-widest text-[#8fbfa0]">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Contribution week */}
          <div className="mt-5 flex justify-between gap-1.5">
            {GITHUB.week.map((lvl, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="h-8 w-full rounded-sm"
                  style={{ background: heat(lvl, accent) }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 200 }}
                />
                <span className="text-[0.55rem] text-[#8fbfa0]">{DAYS[i]}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[0.65rem] text-[#7ee2a8]">▹ Keep going. Updated {GITHUB.lastUpdated}.</p>
        </StageMarker>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-[2%] hidden items-end lg:flex" style={{ height: 'clamp(200px, 44%, 400px)' }}>
        <Character pose="working" parallax={parallax} className="h-full" />
      </div>
    </div>
  );
}

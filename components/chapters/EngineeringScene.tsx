'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { ENGINEERING } from '@/content/engineering';
import type { EngineeringTool } from '@/types/content';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';

/**
 * Engineering — a workshop pegboard, not skill bars (REQUIREMENTS §5, ch.4). Tools hang
 * where badges would go; hovering/selecting one reads its caption plate in Omkar's words.
 */
const FAMILY_LABEL: Record<EngineeringTool['family'], string> = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  systems: 'Systems',
  craft: 'Craft',
};

const TOOL_ICON: Record<string, string> = {
  ts: '🔷', js: '🟨', python: '🐍', react: '⚛️', next: '▲', node: '🟩',
  postgres: '🐘', docker: '🐳', aws: '☁️', 'clean-code': '🧼', 'system-design': '📐', testing: '🧪',
};

export default function EngineeringScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.engineering;
  const { ink, accent } = chapter.palette;
  const [active, setActive] = useState<EngineeringTool>(ENGINEERING[0]);

  return (
    <div className="relative h-full w-full">
      {/* Title */}
      <div className="absolute left-[var(--stage-pad)] top-[8%] z-10 max-w-sm">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>The workshop</p>
          <h1 className="text-title font-medium" style={{ color: ink }}>Tools & craft</h1>
        </ContentItem>
      </div>

      {/* Pegboard */}
      <div className="absolute left-1/2 top-[26%] w-[min(92%,640px)] -translate-x-1/2">
        <div
          className="rounded-xl border border-white/5 p-4"
          style={{ background: 'repeating-radial-gradient(circle at 12px 12px, #00000022 0 2px, transparent 2px 24px), #2a221b' }}
        >
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {ENGINEERING.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActive(tool)}
                onMouseEnter={() => setActive(tool)}
                aria-pressed={active.id === tool.id}
                className="focus-ring flex flex-col items-center gap-1 rounded-lg p-2"
              >
                <motion.span
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-xl"
                  style={{
                    background: active.id === tool.id ? accent : '#3a2f26',
                    boxShadow: active.id === tool.id ? `0 0 20px -4px ${accent}` : 'none',
                  }}
                  animate={{ y: active.id === tool.id ? -4 : 0, rotate: [0, 1.5, 0] }}
                  transition={{ rotate: { duration: 4, repeat: Infinity } }}
                >
                  {TOOL_ICON[tool.id] ?? '🔧'}
                </motion.span>
                <span className="text-[0.6rem] opacity-70" style={{ color: ink }}>{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Caption plate */}
        <StageMarker key={active.id} variant="terminal" className="mx-auto mt-4 max-w-md px-4 py-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <p className="text-[0.7rem] uppercase tracking-widest opacity-60">{FAMILY_LABEL[active.family]}</p>
            <p className="mt-1 text-base font-semibold text-cream">{active.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#a9d8bd]">{active.note}</p>
          </motion.div>
        </StageMarker>
      </div>

      {/* Character thinking, lower-right */}
      <div className="pointer-events-none absolute bottom-0 right-[3%] hidden items-end lg:flex" style={{ height: 'clamp(220px, 50%, 480px)' }}>
        <Character pose="thinking" parallax={parallax} className="h-full" />
      </div>
    </div>
  );
}

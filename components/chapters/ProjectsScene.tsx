'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { PROJECTS } from '@/content/projects';
import type { Project } from '@/types/content';
import Character from '@/components/stage/Character';
import { ContentItem } from '@/components/stage/ChapterContent';
import StageMarker from '@/components/stage/StageMarker';
import CanvasStage from '@/three/CanvasStage';
import { FloatingGrid, GlowCubes } from '@/three/scenes/FloatingGrid';

/**
 * Projects — step into the software lab (REQUIREMENTS §5, ch.7). A 3D lab as the world;
 * projects told as stories, never cards. Each project steps through its full arc:
 * problem → idea → journey → challenge → solution → outcome → lesson.
 */
const ARC: { key: keyof Project; label: string }[] = [
  { key: 'problem', label: 'The problem' },
  { key: 'idea', label: 'The idea' },
  { key: 'journey', label: 'The journey' },
  { key: 'challenge', label: 'The challenge' },
  { key: 'solution', label: 'The solution' },
  { key: 'outcome', label: 'The outcome' },
  { key: 'lesson', label: 'The lesson' },
];

export default function ProjectsScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.projects;
  const { ink, accent } = chapter.palette;
  const [projIndex, setProjIndex] = useState(0);
  const [step, setStep] = useState(0);
  const project = PROJECTS[projIndex];

  const pickProject = (i: number) => {
    setProjIndex(i);
    setStep(0);
  };

  return (
    <div className="relative h-full w-full">
      {/* 3D lab world */}
      <div className="absolute inset-0">
        <CanvasStage camera={{ position: [0, 0.5, 8], fov: 55 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 3, 5]} intensity={40} color={accent} />
          <FloatingGrid color={accent} />
          <GlowCubes color={accent} count={7} />
        </CanvasStage>
      </div>

      {/* Title */}
      <div className="pointer-events-none absolute left-[var(--stage-pad)] top-[7%] z-10">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>The software lab</p>
          <h1 className="text-title font-medium text-scrim" style={{ color: ink }}>Things I&apos;ve built</h1>
        </ContentItem>
      </div>

      {/* Project selector */}
      <div className="absolute left-[var(--stage-pad)] top-[26%] z-10 flex flex-col gap-2">
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => pickProject(i)}
            aria-pressed={i === projIndex}
            className="focus-ring text-left"
          >
            <span
              className="font-serif text-lg transition-opacity"
              style={{ color: ink, opacity: i === projIndex ? 1 : 0.45, borderLeft: `3px solid ${i === projIndex ? accent : 'transparent'}`, paddingLeft: 10 }}
            >
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Story console — steps through the arc */}
      <div className="absolute bottom-[7%] left-1/2 z-10 w-[min(92%,560px)] -translate-x-1/2">
        <StageMarker variant="terminal" className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-cream">
              {project.name} <span className="opacity-50">— {project.tagline}</span>
            </p>
          </div>

          <div className="mt-3 min-h-[92px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.id}-${step}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-[0.7rem] uppercase tracking-widest" style={{ color: accent }}>
                  {ARC[step].label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#c9e8d4]">
                  {project[ARC[step].key] as string}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arc stepper */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {ARC.map((a, i) => (
                <button
                  key={a.key}
                  onClick={() => setStep(i)}
                  aria-label={a.label}
                  className="focus-ring h-1.5 rounded-full transition-all"
                  style={{ width: i === step ? 22 : 10, background: i <= step ? accent : '#ffffff30' }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="focus-ring rounded px-2 py-1 text-xs text-cream disabled:opacity-30"
              >
                ‹ prev
              </button>
              <button
                onClick={() => setStep((s) => Math.min(ARC.length - 1, s + 1))}
                disabled={step === ARC.length - 1}
                className="focus-ring rounded px-2 py-1 text-xs font-semibold disabled:opacity-30"
                style={{ color: accent }}
              >
                next ›
              </button>
            </div>
          </div>
        </StageMarker>
      </div>

      {/* Character working, right */}
      <div className="pointer-events-none absolute bottom-0 right-[2%] hidden items-end xl:flex" style={{ height: 'clamp(200px, 46%, 420px)' }}>
        <Character pose="working" parallax={parallax} className="h-full" />
      </div>
    </div>
  );
}

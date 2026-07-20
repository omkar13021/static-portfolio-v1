'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStory } from '@/lib/store';
import { CHAPTER_MAP } from '@/content/chapters';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { stageVariants, reducedStageVariants, DURATION } from '@/lib/motion';
import StageBackground from './StageBackground';
import FloatingObjects from './FloatingObjects';
import { SCENES } from '@/components/chapters/registry';

/**
 * Stage orchestrator (REQUIREMENTS §4, §6). Owns the world crossfade: the outgoing scene
 * exits while the incoming one enters (overlapping, no blank frame). Clears the
 * transitioning flag once the enter budget elapses so rapid clicks stay debounced.
 */
export default function Stage() {
  const active = useStory((s) => s.active);
  const dir = useStory((s) => s.dir);
  const setTransitioning = useStory((s) => s.setTransitioning);
  const reduced = useReducedMotion();
  const parallax = usePointerParallax(1);

  const chapter = CHAPTER_MAP[active];
  const Scene = SCENES[active];

  // Release the transition lock after the enter phase completes.
  useEffect(() => {
    const total = reduced ? 150 : (DURATION.camera + DURATION.enter) * 1000;
    const t = setTimeout(() => setTransitioning(false), total);
    return () => clearTimeout(t);
  }, [active, reduced, setTransitioning]);

  return (
    <section
      className="relative h-full w-full overflow-hidden"
      aria-roledescription="story stage"
    >
      {/* Backgrounds crossfade underneath the scene so the world's "air" changes smoothly */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`bg-${active}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.5 }}
        >
          <StageBackground palette={chapter.palette} parallax={parallax} />
          <FloatingObjects palette={chapter.palette} />
        </motion.div>
      </AnimatePresence>

      {/* Scene content crossfade with directional drift */}
      <AnimatePresence mode="popLayout" custom={dir} initial={false}>
        <motion.div
          key={`scene-${active}`}
          className="absolute inset-0"
          custom={dir}
          variants={reduced ? reducedStageVariants : stageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Scene parallax={parallax} />
        </motion.div>
      </AnimatePresence>

      {/* Polite announcer for screen readers — chapter changes aren't page navigations (§14.2) */}
      <p className="sr-only" role="status" aria-live="polite">
        {`Chapter: ${chapter.label}. ${chapter.tagline}`}
      </p>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { ABOUT } from '@/content/about';
import { useStory } from '@/lib/store';
import SceneShell from '@/components/stage/SceneShell';
import { ContentGroup, ContentItem } from '@/components/stage/ChapterContent';

/**
 * Welcome — the journal opens (REQUIREMENTS §Home, ch. Welcome). A handwritten greeting,
 * the character waving, and one invitation onward. No hero card, no nav.
 */
export default function WelcomeScene({ parallax }: SceneProps) {
  const chapter = CHAPTER_MAP.welcome;
  const go = useStory((s) => s.go);
  const { ink, accent } = chapter.palette;

  return (
    <SceneShell
      pose="waving"
      parallax={parallax}
      extras={
        // The "Building Tomorrow Today" neon sign from the reference, up top-left.
        <motion.div
          className="absolute left-[6%] top-[10%] font-hand leading-tight"
          style={{ color: accent, textShadow: `0 0 18px ${accent}88` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-2xl md:text-4xl">Building Tomorrow Today</span>
          <span className="ml-2 text-2xl">🚀</span>
        </motion.div>
      }
    >
      <ContentGroup>
        <ContentItem>
          <p className="font-hand text-2xl" style={{ color: accent }}>
            {ABOUT.intro[0]}
          </p>
        </ContentItem>
        <ContentItem>
          <h1 className="mt-1 text-display font-medium text-scrim" style={{ color: ink }}>
            I&apos;m {ABOUT.name}.
          </h1>
        </ContentItem>
        <ContentItem>
          <p className="mt-4 max-w-md text-lede" style={{ color: ink, opacity: 0.9 }}>
            {ABOUT.intro[1]}
          </p>
        </ContentItem>
        <ContentItem>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              onClick={() => go('journey')}
              className="focus-ring rounded-full px-7 py-3 text-sm font-semibold tracking-wide"
              style={{ background: accent, color: chapter.palette.bg[2] }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Begin the journey →
            </motion.button>
            <span className="font-hand text-lg" style={{ color: ink, opacity: 0.7 }}>
              or pick any card below
            </span>
          </div>
        </ContentItem>
      </ContentGroup>
    </SceneShell>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { Chapter } from '@/types/chapter';
import CharacterRig from '@/components/character/CharacterRig';
import { CARD_SPRING } from '@/lib/motion';

/**
 * A collectible story card (REQUIREMENTS §5). Reads as a small illustrated keepsake, not
 * a nav button: a per-world gradient, the character in that chapter's pose, and a
 * hand-lettered label. Implements the tab pattern (§14.3) — roving tabindex + aria.
 */
export default function StoryCard({
  chapter,
  index,
  active,
  focused,
  onSelect,
  registerRef,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
  focused: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const [top, , bottom] = chapter.palette.bg;

  return (
    <motion.button
      ref={registerRef}
      role="tab"
      id={`tab-${chapter.id}`}
      aria-selected={active}
      aria-controls="stage-panel"
      tabIndex={focused ? 0 : -1}
      onClick={onSelect}
      className="focus-ring relative h-full shrink-0 overflow-hidden rounded-2xl border text-left"
      style={{
        width: 'clamp(96px, 12vh, 150px)',
        aspectRatio: '3 / 4',
        borderColor: active ? chapter.palette.accent : 'rgba(245,238,223,0.18)',
        boxShadow: active
          ? `0 12px 30px -8px ${chapter.palette.accent}88, 0 0 0 2px ${chapter.palette.accent}`
          : '0 6px 16px -8px rgba(0,0,0,0.5)',
      }}
      animate={{
        scale: active ? 1.12 : 1,
        y: active ? -14 : 0,
        filter: active ? 'saturate(1.1) brightness(1.05)' : 'saturate(0.85) brightness(0.82)',
      }}
      whileHover={{ scale: active ? 1.12 : 1.05, y: active ? -14 : -6, filter: 'saturate(1) brightness(1)' }}
      whileTap={{ scale: active ? 1.06 : 0.97 }}
      transition={CARD_SPRING}
    >
      {/* world background */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${top}, ${bottom})` }}
      />
      {/* character portrait, cropped to bust */}
      <div className="absolute inset-x-0 bottom-6 top-1 flex items-end justify-center">
        <div className="h-[135%] w-[135%] translate-y-[12%]">
          <CharacterRig pose={chapter.pose} className="h-full w-full" headTilt={0} />
        </div>
      </div>
      {/* label plate */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/45 px-2 py-1 backdrop-blur-sm">
        <span aria-hidden className="text-sm leading-none">{chapter.icon}</span>
        <span className="font-hand text-[0.95rem] leading-tight text-cream">{chapter.label}</span>
      </div>
      {/* number stamp */}
      <span
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-semibold"
        style={{ background: chapter.palette.accent, color: chapter.palette.bg[2] }}
      >
        {index + 1}
      </span>
    </motion.button>
  );
}

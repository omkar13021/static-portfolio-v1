'use client';

import type { Pose } from '@/types/chapter';
import Character from './Character';

/**
 * Reusable stage layout for the character-plus-copy chapters (REQUIREMENTS §4, §8).
 * A responsive frame: story copy on one side, the character anchored to a focal point on
 * the other. Everything sizes with clamp() so no viewport ever forces scroll (§7). Scenes
 * with bespoke compositions (Journey, Gallery) don't use this.
 */
export default function SceneShell({
  pose,
  parallax,
  children,
  characterSide = 'right',
  extras,
}: {
  pose: Pose;
  parallax: { x: number; y: number };
  children: React.ReactNode;
  characterSide?: 'right' | 'left' | 'center';
  /** Optional scene dressing rendered behind the character (props, motifs). */
  extras?: React.ReactNode;
}) {
  const charPos =
    characterSide === 'left'
      ? 'left-[2%] md:left-[6%]'
      : characterSide === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'right-[2%] md:right-[6%]';

  return (
    <div className="relative h-full w-full">
      {extras}

      {/* Character */}
      <div
        className={`pointer-events-none absolute bottom-0 ${charPos} flex items-end`}
        style={{ height: 'clamp(220px, 62%, 640px)' }}
      >
        <Character pose={pose} parallax={parallax} className="h-full" />
      </div>

      {/* Story copy column */}
      <div
        className={`absolute inset-y-0 flex max-w-[min(92%,560px)] flex-col justify-center px-[var(--stage-pad)] ${
          characterSide === 'left' ? 'right-0 items-end text-right' : 'left-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

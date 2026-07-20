'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { WorldPalette } from '@/types/chapter';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Ambient midground particles keyed to the world's mood (REQUIREMENTS §micro-interactions,
 * §5A ambiance): fireflies/stars at night, dust motes in warm daylight, rain streaks in
 * the rain mood. DOM-only and count-capped so it stays cheap; disabled under reduced
 * motion. Deterministic positions (index-seeded) so there's no hydration mismatch and no
 * Math.random in render.
 */

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function FloatingObjects({ palette }: { palette: WorldPalette }) {
  const reduced = useReducedMotion();
  const mood = palette.mood;

  const particles = useMemo(() => {
    const count = mood === 'rain' ? 26 : mood === 'night' ? 30 : 16;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: seeded(i, 1) * 100,
      top: seeded(i, 2) * 100,
      size: 2 + seeded(i, 3) * (mood === 'day' || mood === 'dawn' ? 5 : 4),
      delay: seeded(i, 4) * 5,
      dur: 5 + seeded(i, 5) * 7,
    }));
  }, [mood]);

  if (reduced) return null;

  const isGlow = mood === 'night' || mood === 'dusk';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) =>
        mood === 'rain' ? (
          <motion.span
            key={p.id}
            className="absolute w-px"
            style={{
              left: `${p.left}%`,
              top: `${p.top - 20}%`,
              height: `${8 + p.size * 3}px`,
              background: `linear-gradient(${palette.ink}66, transparent)`,
            }}
            animate={{ y: ['0vh', '120vh'] }}
            transition={{ duration: 1.1 + p.delay * 0.2, repeat: Infinity, ease: 'linear', delay: p.delay }}
          />
        ) : (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: isGlow ? palette.glow : palette.ink,
              opacity: isGlow ? 0.8 : 0.18,
              boxShadow: isGlow ? `0 0 ${p.size * 3}px ${palette.glow}` : 'none',
            }}
            animate={{
              y: [0, -18 - p.size * 2, 0],
              x: [0, p.size, 0],
              opacity: isGlow ? [0.2, 0.9, 0.2] : [0.1, 0.24, 0.1],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ),
      )}
    </div>
  );
}

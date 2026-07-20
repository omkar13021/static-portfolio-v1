'use client';

import { motion } from 'framer-motion';
import type { WorldPalette } from '@/types/chapter';

/**
 * Per-world background atmosphere (REQUIREMENTS §5A). A soft vertical gradient plus a
 * mood-appropriate light bloom and grain. Pure DOM/SVG — cheap, always present, and it
 * gives every chapter a distinct "air" before any scene dressing loads.
 */
export default function StageBackground({
  palette,
  parallax = { x: 0, y: 0 },
}: {
  palette: WorldPalette;
  parallax?: { x: number; y: number };
}) {
  const [top, mid, bottom] = palette.bg;
  const isDark = palette.mood === 'night' || palette.mood === 'dusk';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${bottom} 100%)` }}
      />

      {/* light bloom — follows the pointer very subtly */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.glow}33 0%, transparent 62%)`,
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
        animate={{ x: parallax.x * 30, y: parallax.y * 24, opacity: [0.7, 1, 0.7] }}
        transition={{
          x: { type: 'spring', stiffness: 30, damping: 20 },
          y: { type: 'spring', stiffness: 30, damping: 20 },
          opacity: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* dusk/dawn horizon warmth */}
      {(palette.mood === 'dawn' || palette.mood === 'dusk') && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `linear-gradient(0deg, ${palette.accent}22, transparent)` }}
        />
      )}

      {/* fine paper grain for the warm/day worlds */}
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {/* vignette to focus the center of the stage */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: `inset 0 0 200px 40px ${isDark ? '#00000055' : '#2B242018'}` }}
      />
    </div>
  );
}

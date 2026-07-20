'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Subtle cursor-follow parallax for stage layers (REQUIREMENTS §micro-interactions).
 * Returns a normalized -1..1 pointer offset, damped. Disabled under reduced motion and
 * on touch (no persistent pointer). Values are eased toward the target each frame.
 */
export function usePointerParallax(strength = 1) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    // Skip on coarse pointers (touch) — there is no hover cursor to follow.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target = {
        x: (e.clientX / window.innerWidth - 0.5) * 2 * strength,
        y: (e.clientY / window.innerHeight - 0.5) * 2 * strength,
      };
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      setOffset({ x: Math.round(current.x * 1000) / 1000, y: Math.round(current.y * 1000) / 1000 });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced, strength]);

  return offset;
}

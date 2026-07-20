'use client';

import { motion } from 'framer-motion';
import type { Pose } from '@/types/chapter';
import CharacterRig from '@/components/character/CharacterRig';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Stage character: wraps the rig with an idle "breathing" loop so the character is never
 * fully static (REQUIREMENTS §7 idle motion). Breathing collapses under reduced motion.
 */
export default function Character({
  pose,
  className,
  parallax = { x: 0, y: 0 },
}: {
  pose: Pose;
  className?: string;
  parallax?: { x: number; y: number };
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform' }}
      animate={
        reduced
          ? { y: 0 }
          : { y: [0, -10, 0], rotate: [0, 0.4, 0] }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 6.5, ease: 'easeInOut', repeat: Infinity }
      }
    >
      <motion.div
        animate={{ x: parallax.x * 10, y: parallax.y * 8 }}
        transition={{ type: 'spring', stiffness: 40, damping: 18 }}
      >
        <CharacterRig pose={pose} className="h-full w-full drop-shadow-xl" />
      </motion.div>
    </motion.div>
  );
}

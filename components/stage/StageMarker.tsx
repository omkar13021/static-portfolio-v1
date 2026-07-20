'use client';

import { motion } from 'framer-motion';

/**
 * Stage marker (REQUIREMENTS §4 definition): a small, diegetic, per-chapter information
 * surface that shows a short piece of info without leaving the illustrated scene — a
 * paper label, a brass plaque, a terminal readout. Never a generic dashboard card, and
 * never styled to resemble the Carousel cards. Each variant carries its own in-world
 * material.
 */
export default function StageMarker({
  variant,
  children,
  className,
  style,
  onClick,
  interactive,
}: {
  variant: 'paper' | 'plaque' | 'terminal' | 'note' | 'glass';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  interactive?: boolean;
}) {
  const base: Record<typeof variant, string> = {
    paper: 'bg-[#f7f1e3] text-ink border border-black/10 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] rounded-sm',
    plaque: 'bg-gradient-to-b from-[#3a4a3f] to-[#2b3a30] text-cream border border-[#5FB98A]/30 rounded-md shadow-lg',
    terminal: 'bg-[#0d1117]/90 text-[#7ee2a8] border border-[#5FB98A]/25 rounded-md font-mono shadow-[0_0_30px_-10px_#5FB98A]',
    note: 'bg-[#fdf6c9] text-ink shadow-[0_8px_18px_-8px_rgba(0,0,0,0.4)] rounded-[2px]',
    glass: 'bg-white/10 text-cream border border-white/20 backdrop-blur-md rounded-xl',
  };

  const Comp = (interactive ? motion.button : motion.div) as typeof motion.button;

  return (
    <Comp
      onClick={onClick}
      className={`${base[variant]} ${interactive ? 'focus-ring cursor-pointer text-left' : ''} ${className ?? ''}`}
      style={style}
      whileHover={interactive ? { y: -3, rotate: variant === 'note' ? -1 : 0 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
    >
      {children}
    </Comp>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  contentContainer,
  contentItem,
  reducedContentContainer,
  reducedContentItem,
} from '@/lib/motion';

/**
 * Content container that staggers its children in after the world resolves (REQUIREMENTS
 * §6 enter phase). Swaps to instant variants under reduced motion.
 */
export function ContentGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? reducedContentContainer : contentContainer}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function ContentItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? reducedContentItem : contentItem}>
      {children}
    </motion.div>
  );
}

/** Standard chapter title block reused by scenes for a consistent editorial rhythm. */
export function ChapterTitle({
  eyebrow,
  title,
  tagline,
  ink,
  accent,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  ink: string;
  accent: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      <ContentItem>
        <p
          className="font-hand text-lg tracking-wide"
          style={{ color: accent }}
        >
          {eyebrow}
        </p>
      </ContentItem>
      <ContentItem>
        <h1 className="text-title font-medium text-scrim" style={{ color: ink }}>
          {title}
        </h1>
      </ContentItem>
      <ContentItem>
        <p
          className="mt-2 max-w-md text-lede opacity-90"
          style={{ color: ink }}
        >
          {tagline}
        </p>
      </ContentItem>
    </div>
  );
}

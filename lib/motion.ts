import type { Variants, Transition } from 'framer-motion';

/**
 * Motion tokens (REQUIREMENTS §6, §7.2, §7.4). One place for every easing curve and
 * duration so choreography stays consistent and tunable.
 */
export const EASE = {
  exit: [0.4, 0.0, 1, 1] as const,
  enter: [0.16, 1, 0.3, 1] as const,
  stage: [0.65, 0.05, 0.36, 1] as const,
  soft: [0.33, 1, 0.68, 1] as const,
};

export const DURATION = {
  exit: 0.36,
  camera: 0.52,
  enter: 0.52,
  content: 0.6,
};

/** Carousel card spring family — every card state shares it (§7.4). */
export const CARD_SPRING: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 22,
  mass: 1,
};

/** Stage crossfade — exit and enter overlap; no blank frame between worlds (§6). */
export const stageVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.04,
    x: dir >= 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: DURATION.enter,
      ease: EASE.enter,
      opacity: { duration: DURATION.enter * 0.8 },
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.98,
    x: dir >= 0 ? -32 : 32,
    transition: { duration: DURATION.exit, ease: EASE.exit },
  }),
};

/** Content pieces (title, lede, props) spring in staggered after the world resolves. */
export const contentContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.14 },
  },
};

export const contentItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.enter },
  },
};

/** Reduced-motion overrides: collapse everything to a plain, fast cross-fade (§14.1). */
export const reducedStageVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const reducedContentContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0 } },
};

export const reducedContentItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } },
};

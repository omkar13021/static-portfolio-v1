import type { EngineeringTool } from '@/types/content';

/**
 * Tools on the workshop wall (REQUIREMENTS §5, ch.4). Craftsmanship framing — what each
 * tool means in the hand, not a percentage bar. Edit (§15).
 */
export const ENGINEERING: EngineeringTool[] = [
  { id: 'ts', label: 'TypeScript', note: 'My default. Types are documentation that can\'t go stale.', family: 'languages' },
  { id: 'js', label: 'JavaScript', note: 'Where it all started. Still full of surprises.', family: 'languages' },
  { id: 'python', label: 'Python', note: 'For when I want to think out loud in code.', family: 'languages' },
  { id: 'react', label: 'React', note: 'A way of thinking, not just a library.', family: 'frameworks' },
  { id: 'next', label: 'Next.js', note: 'The frame I reach for when it needs to ship.', family: 'frameworks' },
  { id: 'node', label: 'Node', note: 'The other half of the stack, quietly doing the work.', family: 'frameworks' },
  { id: 'postgres', label: 'PostgreSQL', note: 'I trust it with the things that matter.', family: 'systems' },
  { id: 'docker', label: 'Docker', note: '"Works on my machine" — now it works on all of them.', family: 'systems' },
  { id: 'aws', label: 'Cloud', note: 'Someone else\'s computer, but a very reliable someone.', family: 'systems' },
  { id: 'clean-code', label: 'Clean Code', note: 'Write it for the person who reads it next. Usually me.', family: 'craft' },
  { id: 'system-design', label: 'System Design', note: 'Drawing boxes and arrows until the hard part gets obvious.', family: 'craft' },
  { id: 'testing', label: 'Testing', note: 'The safety net that lets me move fast without fear.', family: 'craft' },
];

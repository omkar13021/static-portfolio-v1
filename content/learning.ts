import type { LearningTopic } from '@/types/content';

/** The knowledge room — ideas as drifting orbs (REQUIREMENTS §5). Edit (§15). */
export const LEARNING: LearningTopic[] = [
  { id: 'systems', label: 'Distributed systems', status: 'practicing', note: 'Learning to make many computers agree without losing my mind.' },
  { id: 'rust', label: 'Rust', status: 'exploring', note: 'A language that makes me a better programmer even in other languages.' },
  { id: 'ml', label: 'Applied ML', status: 'exploring', note: 'Enough to know what\'s magic and what\'s just statistics.' },
  { id: 'design', label: 'Visual design', status: 'practicing', note: 'So engineering and taste stop being two separate people.' },
  { id: 'writing', label: 'Writing', status: 'practicing', note: 'The clearest thinking I do is the kind I have to write down.' },
  { id: 'teaching', label: 'Mentoring', status: 'teaching', note: 'You don\'t really know a thing until you can hand it to someone else.' },
  { id: 'photography', label: 'Photography', status: 'exploring', note: 'Learning to notice light. It leaks into everything else.' },
];

import type { ExperienceRole } from '@/types/content';

/** Roles as rooms you step into (REQUIREMENTS §5). Placeholder specifics — edit (§15). */
export const EXPERIENCE: ExperienceRole[] = [
  {
    id: 'senior-engineer',
    company: 'Current',
    title: 'Senior Software Engineer',
    period: 'Present',
    summary: 'Leading features end to end — from the messy problem statement to the thing users actually touch.',
    highlights: [
      'Owns architecture and delivery for core product surfaces.',
      'Mentors engineers on writing code the next person can read.',
      'Bridges design and engineering so the seams never show.',
    ],
  },
  {
    id: 'engineer',
    company: 'Previous',
    title: 'Software Engineer',
    period: 'Earlier',
    summary: 'Where I learned to ship — real deadlines, real users, real consequences.',
    highlights: [
      'Built and maintained production services at scale.',
      'Turned recurring firefights into boring, reliable systems.',
      'Learned that the best refactor is the one nobody notices.',
    ],
  },
  {
    id: 'junior',
    company: 'First role',
    title: 'Junior Developer',
    period: 'The start',
    summary: 'The first office. The first time my code mattered to someone other than me.',
    highlights: [
      'Absorbed everything — code review was my favorite class.',
      'Discovered I liked the hard bugs more than the easy features.',
    ],
  },
];

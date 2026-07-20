import type { Project } from '@/types/content';

/**
 * Projects told as stories, never cards (REQUIREMENTS §5). Each has the full arc:
 * problem → idea → journey → challenge → solution → outcome → lesson. Edit with your
 * real projects (§15).
 */
export const PROJECTS: Project[] = [
  {
    id: 'storybook-portfolio',
    name: 'This Story',
    tagline: 'The site you are reading right now.',
    stack: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'GSAP', 'Three.js'],
    problem: 'Every portfolio looked the same — a grid of cards that told you what someone made but nothing about who they are.',
    idea: 'What if a portfolio behaved like an animated storybook instead? One screen, eleven chapters, a character who walks you through a life.',
    journey: 'I wrote a real product spec first, argued with myself about scope, then built it chapter by chapter like scenes in a film.',
    challenge: 'Keeping it cinematic without letting the technology become the point — and making it run smoothly on a mid-range phone.',
    solution: 'A fixed stage-and-carousel layout, a componentized character rig, and 3D used only where it adds emotion.',
    outcome: 'A site people actually finish — and remember the person, not the framework.',
    lesson: 'Constraints are a gift. "No scroll, one screen" forced every good decision.',
  },
  {
    id: 'project-two',
    name: 'Project Atlas',
    tagline: 'A system that turned chaos into calm.',
    stack: ['TypeScript', 'Node', 'PostgreSQL'],
    problem: 'A critical workflow lived in three spreadsheets and one person\'s memory.',
    idea: 'Make the invisible process visible, then make it boring and reliable.',
    journey: 'Shadowed the humans doing it by hand for a week before writing a single line.',
    challenge: 'Migrating years of messy real-world data without losing a single record.',
    solution: 'An incremental system that ran alongside the old way until people trusted it.',
    outcome: 'Hours of weekly manual work reduced to a few clicks; zero data loss.',
    lesson: 'The hardest part of engineering is almost never the code.',
  },
  {
    id: 'project-three',
    name: 'Nightlight',
    tagline: 'A small tool I built for myself that others loved too.',
    stack: ['React', 'IndexedDB', 'PWA'],
    problem: 'I kept losing the small ideas I had at 2am.',
    idea: 'A frictionless, offline-first place to catch a thought before it escaped.',
    journey: 'A weekend hack that I kept using, so I kept polishing it.',
    challenge: 'Staying ruthlessly simple while people asked for features.',
    solution: 'One text box, instant save, works offline, syncs nowhere by design.',
    outcome: 'Quietly used by more people than any "serious" project I have shipped.',
    lesson: 'Build the thing you actually need. Someone else needs it too.',
  },
];

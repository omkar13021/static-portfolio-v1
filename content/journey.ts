import type { JourneyMilestone } from '@/types/content';

/** The winding road (REQUIREMENTS §5, ch.3). Memories, not dates. Edit freely (§15). */
export const JOURNEY: JourneyMilestone[] = [
  {
    id: 'childhood',
    year: 'the beginning',
    title: 'A curious kid',
    body: 'Long before code, I was the kid who took the remote apart to see how it worked — and mostly put it back together.',
    motif: 'seed',
  },
  {
    id: 'school',
    year: 'school',
    title: 'Notebooks full of ideas',
    body: 'Margins full of drawings and half-finished plans. I learned that finishing is a skill of its own.',
    motif: 'book',
  },
  {
    id: 'first-computer',
    year: 'the first machine',
    title: 'My first computer',
    body: 'The first time a screen did exactly what I told it to, something clicked. I have been chasing that feeling ever since.',
    motif: 'monitor',
  },
  {
    id: 'college',
    year: 'college',
    title: 'Learning to learn',
    body: 'College taught me less about syntax and more about how to teach myself anything — the only skill that never expires.',
    motif: 'book',
  },
  {
    id: 'first-salary',
    year: 'first job',
    title: 'My first paycheck',
    body: 'Not the amount — the proof. Proof that the thing I loved doing was also a thing the world would pay for.',
    motif: 'building',
  },
  {
    id: 'first-office',
    year: 'the office',
    title: 'First real team',
    body: 'I learned that software is a team sport. The best ideas in the room were rarely the loudest.',
    motif: 'building',
  },
  {
    id: 'resignation',
    year: 'the hard choice',
    title: 'Walking through a door',
    body: 'Leaving something safe for something uncertain. Scary, and one of the best decisions I ever made.',
    motif: 'door',
  },
  {
    id: 'growth',
    year: 'now',
    title: 'Still climbing',
    body: 'Every summit turns out to be a ledge with a taller mountain behind it. I have made peace with that. I like the climb.',
    motif: 'mountain',
  },
  {
    id: 'dreams',
    year: 'ahead',
    title: 'What comes next',
    body: 'A workshop of my own, work that outlives me, and enough quiet to enjoy it. The road keeps going.',
    motif: 'star',
  },
];

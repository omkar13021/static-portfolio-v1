/** Content shapes for each chapter's story data (REQUIREMENTS §10.5). */

export interface AboutContent {
  name: string;
  role: string;
  intro: string[];
  values: { label: string; note: string }[];
  quote: { text: string; author: string };
  favorites: { season: string; place: string; food: string; music: string };
  smiles: string[];
  randomFacts: string[];
}

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  body: string;
  /** Simple named motif drawn inline per milestone. */
  motif: 'seed' | 'book' | 'monitor' | 'building' | 'door' | 'mountain' | 'star';
}

export interface ExperienceRole {
  id: string;
  company: string;
  title: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  /** Story arc (§5) — told in-scene, not as a card. */
  problem: string;
  idea: string;
  journey: string;
  challenge: string;
  solution: string;
  outcome: string;
  lesson: string;
  link?: string;
}

export interface EngineeringTool {
  id: string;
  label: string;
  /** What it means in Omkar's hands — craftsmanship framing, not a skill bar (§5). */
  note: string;
  family: 'languages' | 'frameworks' | 'systems' | 'craft';
}

export interface GithubSnapshot {
  /** Static, manually curated (§15 item 3 — no live API in a static build). */
  lastUpdated: string;
  username: string;
  commitsThisWeek: number;
  pullRequests: number;
  repositories: number;
  /** 7-day activity intensity, 0–4 per day, Mon→Sun. */
  week: number[];
  pinned: { name: string; description: string; language: string; stars: number }[];
}

export interface WritingPiece {
  id: string;
  title: string;
  kind: 'essay' | 'note' | 'thread';
  excerpt: string;
  date: string;
}

export interface LearningTopic {
  id: string;
  label: string;
  status: 'exploring' | 'practicing' | 'teaching';
  note: string;
}

export interface LifeThing {
  id: string;
  icon: string;
  label: string;
  /** Handwritten note revealed on interaction (§5). */
  note: string;
}

export interface GalleryPhoto {
  id: string;
  caption: string;
  /** Placeholder gradient + rotation until real photos are dropped in /public (§15). */
  tone: string;
  rotate: number;
}

export type CtaKind = 'lets-talk' | 'resume' | 'github' | 'linkedin' | 'email';

export interface ContactContent {
  closing: { title: string; body: string };
  ctas: { label: string; href: string; kind: CtaKind }[];
}

/** Character feature set — likeness lives here, the rig is generic (§13.6). */
export interface CharacterFeatures {
  skinTone: string;
  skinShade: string;
  hairColor: string;
  hairStyle: 'curly-crop' | 'short-cropped' | 'medium-wavy' | 'long-tied';
  facialHair: 'none' | 'stubble' | 'beard';
  shirtColor: string;
  glasses: boolean;
}

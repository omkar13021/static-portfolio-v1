/**
 * Chapter type contracts (REQUIREMENTS §5, §10.5).
 * CHAPTER_ORDER in content/chapters.ts is the single source of truth for order and
 * adjacency; nothing hardcodes an index.
 */

export type ChapterId =
  | 'welcome'
  | 'journey'
  | 'experience'
  | 'projects'
  | 'engineering'
  | 'github'
  | 'writing'
  | 'learning'
  | 'life'
  | 'gallery'
  | 'contact';

/** Named character poses composed by the SVG rig (§13.4). */
export type Pose =
  | 'idle'
  | 'walking'
  | 'working'
  | 'thinking'
  | 'presenting'
  | 'reading'
  | 'coffee'
  | 'waving'
  | 'stargazing';

/** Per-world palette (§5A). Colorful worlds come from illustration, not chrome. */
export interface WorldPalette {
  /** Background gradient stops, top → bottom. */
  bg: [string, string, string];
  /** Primary ink/text color that meets contrast over `bg` (§14.4). */
  ink: string;
  /** Accent used for in-world highlights. */
  accent: string;
  /** Soft glow / atmosphere color. */
  glow: string;
  /** Whether the world reads as day/dusk/night (drives ambient particle mood). */
  mood: 'dawn' | 'day' | 'dusk' | 'night' | 'rain';
}

export interface Chapter {
  id: ChapterId;
  /** Emoji shown on the story card. */
  icon: string;
  /** Short card label. */
  label: string;
  /** One-line hook shown under the title in-scene. */
  tagline: string;
  /** Character pose for this world. */
  pose: Pose;
  /** Whether this chapter mounts an R3F canvas (§11.1). Only 4 do. */
  is3D: boolean;
  palette: WorldPalette;
}

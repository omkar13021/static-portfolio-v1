import type { GalleryPhoto } from '@/types/content';

/**
 * Photos pinned to a wall — staggered, rotated, overlapping, never a uniform grid
 * (REQUIREMENTS §5, §11.1). Until real images land in /public, each frame is a warm
 * gradient placeholder with a caption (§15). Drop image paths in later.
 */
export const GALLERY: GalleryPhoto[] = [
  { id: 'p1', caption: 'The desk, late', tone: 'linear-gradient(135deg,#22384F,#3C5A46)', rotate: -4 },
  { id: 'p2', caption: 'First rain of the year', tone: 'linear-gradient(135deg,#3C5A46,#5FB98A)', rotate: 3 },
  { id: 'p3', caption: 'Chai, always', tone: 'linear-gradient(135deg,#C86A4A,#E4B95B)', rotate: -2 },
  { id: 'p4', caption: 'City at 2am', tone: 'linear-gradient(135deg,#22384F,#161B2E)', rotate: 5 },
  { id: 'p5', caption: 'The books that stayed', tone: 'linear-gradient(135deg,#3C5A46,#22384F)', rotate: -6 },
  { id: 'p6', caption: 'On a run, somewhere green', tone: 'linear-gradient(135deg,#5FB98A,#3C5A46)', rotate: 2 },
];

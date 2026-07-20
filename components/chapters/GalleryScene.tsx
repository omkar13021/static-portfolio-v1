'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { GALLERY } from '@/content/gallery';
import { ContentItem } from '@/components/stage/ChapterContent';

/**
 * Gallery — moments pinned to a wall (REQUIREMENTS §5, §11.1). A staggered, rotated,
 * overlapping composition — never a uniform grid. Selecting a photo opens a keyboard-
 * operable lightbox (§14.2/§14.3). Real images drop into /public later (§15).
 */
export default function GalleryScene(_: SceneProps) {
  const chapter = CHAPTER_MAP.gallery;
  const { ink, accent } = chapter.palette;
  const [open, setOpen] = useState<number | null>(null);

  // Hand-placed positions so nothing reads as a grid.
  const spots = [
    { x: 22, y: 40, w: 200 },
    { x: 42, y: 28, w: 180 },
    { x: 60, y: 46, w: 220 },
    { x: 33, y: 66, w: 190 },
    { x: 74, y: 30, w: 170 },
    { x: 80, y: 62, w: 200 },
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[var(--stage-pad)] top-[8%] z-10 max-w-sm">
        <ContentItem>
          <p className="font-hand text-xl" style={{ color: accent }}>Moments</p>
          <h1 className="text-title font-medium" style={{ color: ink }}>Pinned to the wall</h1>
        </ContentItem>
      </div>

      {/* Photo wall */}
      {GALLERY.map((photo, i) => {
        const s = spots[i % spots.length];
        return (
          <motion.button
            key={photo.id}
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${photo.caption}`}
            className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white p-2 pb-6 shadow-xl"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: `clamp(120px, ${s.w / 12}vw, ${s.w}px)`, rotate: `${photo.rotate}deg` }}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 5, y: -6 }}
          >
            <div className="aspect-[4/3] w-full rounded-sm" style={{ background: photo.tone }} />
            <span className="absolute bottom-1 left-0 right-0 text-center font-hand text-sm text-ink">{photo.caption}</span>
          </motion.button>
        );
      })}

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[open].caption}
            tabIndex={-1}
            onClick={() => setOpen(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(null);
              if (e.key === 'ArrowRight') setOpen((o) => (o === null ? 0 : (o + 1) % GALLERY.length));
              if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? 0 : (o - 1 + GALLERY.length) % GALLERY.length));
            }}
            ref={(el) => el?.focus()}
          >
            <motion.figure
              className="max-w-2xl rounded-md bg-white p-3 pb-10 shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[4/3] w-[min(80vw,640px)] rounded-sm" style={{ background: GALLERY[open].tone }} />
              <figcaption className="mt-3 text-center font-hand text-2xl text-ink">{GALLERY[open].caption}</figcaption>
            </motion.figure>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="focus-ring absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

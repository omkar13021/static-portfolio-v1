'use client';

import { motion } from 'framer-motion';
import type { SceneProps } from './types';
import { CHAPTER_MAP } from '@/content/chapters';
import { CONTACT } from '@/content/contact';
import type { CtaKind } from '@/types/content';
import Character from '@/components/stage/Character';
import { ContentGroup, ContentItem } from '@/components/stage/ChapterContent';
import CanvasStage from '@/three/CanvasStage';
import { NightSky, ShootingStar } from '@/three/scenes/NightSky';

/**
 * Contact — the final cinematic ending (REQUIREMENTS §Final chapter). A peaceful night
 * landscape: bench, mountains, a sky full of stars. The character sits and looks outward.
 * Simple closing text and the five CTAs as constellation points. Loops back, never dead-ends.
 */
const CTA_ICON: Record<CtaKind, string> = {
  'lets-talk': '✦',
  resume: '📄',
  github: '🐙',
  linkedin: 'in',
  email: '✉',
};

export default function ContactScene(_: SceneProps) {
  const chapter = CHAPTER_MAP.contact;
  const { ink, accent } = chapter.palette;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Star sky */}
      <div className="absolute inset-0">
        <CanvasStage camera={{ position: [0, 0, 8], fov: 55 }}>
          <ambientLight intensity={0.4} />
          <NightSky count={1200} color="#EAF0FF" twinkle />
          <ShootingStar />
        </CanvasStage>
      </div>

      {/* Closing text */}
      <div className="absolute inset-x-0 top-[12%] z-10 flex flex-col items-center px-6 text-center">
        <ContentGroup className="flex flex-col items-center">
          <ContentItem>
            <h1 className="text-title font-medium text-scrim" style={{ color: ink }}>
              {CONTACT.closing.title}
            </h1>
          </ContentItem>
          <ContentItem>
            <p className="mt-3 max-w-md text-lede" style={{ color: ink, opacity: 0.85 }}>
              {CONTACT.closing.body}
            </p>
          </ContentItem>

          {/* CTAs */}
          <ContentItem>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {CONTACT.ctas.map((cta) => {
                const primary = cta.kind === 'lets-talk';
                return (
                  <motion.a
                    key={cta.kind}
                    href={cta.href}
                    target={cta.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                    style={{
                      background: primary ? accent : 'rgba(255,255,255,0.08)',
                      color: primary ? chapter.palette.bg[2] : ink,
                      border: `1px solid ${primary ? accent : 'rgba(255,255,255,0.2)'}`,
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span aria-hidden className="text-xs">{CTA_ICON[cta.kind]}</span>
                    {cta.label}
                  </motion.a>
                );
              })}
            </div>
          </ContentItem>
        </ContentGroup>
      </div>

      {/* Foreground landscape: mountains + bench silhouette */}
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[42%] w-full">
        <path d="M0 400 L0 220 L180 90 L360 210 L520 120 L700 240 L860 140 L1050 250 L1200 170 L1200 400 Z" fill="#0a0d18" />
        <path d="M0 400 L0 300 L220 210 L440 300 L640 230 L880 320 L1120 250 L1200 290 L1200 400 Z" fill="#070912" />
        {/* bench */}
        <g transform="translate(560 300)" stroke="#05060c" strokeWidth={6} fill="none">
          <line x1={0} y1={0} x2={90} y2={0} strokeWidth={8} />
          <line x1={0} y1={-16} x2={90} y2={-16} strokeWidth={6} />
          <line x1={8} y1={0} x2={8} y2={26} />
          <line x1={82} y1={0} x2={82} y2={26} />
          <line x1={0} y1={-16} x2={0} y2={0} />
          <line x1={90} y1={-16} x2={90} y2={0} />
        </g>
      </svg>

      {/* Character sitting/stargazing on the bench */}
      <div className="pointer-events-none absolute bottom-[14%] left-1/2 z-[5] flex -translate-x-1/2 items-end" style={{ height: 'clamp(150px, 30%, 260px)' }}>
        <Character pose="stargazing" parallax={{ x: 0, y: 0 }} className="h-full" />
      </div>
    </div>
  );
}

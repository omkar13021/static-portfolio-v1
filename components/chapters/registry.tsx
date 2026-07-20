'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ChapterId } from '@/types/chapter';
import type { SceneProps } from './types';

/**
 * Per-chapter code-splitting (REQUIREMENTS §10.4, §12). Each scene is its own chunk so
 * the Welcome-only initial load stays tiny. The four 3D chapters disable SSR because
 * their R3F canvases touch WebGL/window; DOM chapters may prerender.
 */

const Loading = () => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="font-hand text-2xl opacity-40">…</span>
  </div>
);

export const SCENES: Record<ChapterId, ComponentType<SceneProps>> = {
  welcome: dynamic(() => import('./WelcomeScene'), { loading: Loading }),
  journey: dynamic(() => import('./JourneyScene'), { loading: Loading }),
  experience: dynamic(() => import('./ExperienceScene'), { loading: Loading }),
  projects: dynamic(() => import('./ProjectsScene'), { loading: Loading, ssr: false }),
  engineering: dynamic(() => import('./EngineeringScene'), { loading: Loading }),
  github: dynamic(() => import('./GithubScene'), { loading: Loading, ssr: false }),
  writing: dynamic(() => import('./WritingScene'), { loading: Loading }),
  learning: dynamic(() => import('./LearningScene'), { loading: Loading, ssr: false }),
  life: dynamic(() => import('./LifeScene'), { loading: Loading }),
  gallery: dynamic(() => import('./GalleryScene'), { loading: Loading }),
  contact: dynamic(() => import('./ContactScene'), { loading: Loading, ssr: false }),
};

'use client';

import { motion } from 'framer-motion';
import type { Pose } from '@/types/chapter';
import type { CharacterFeatures } from '@/types/content';
import { CHARACTER } from '@/content/character';

/**
 * Componentized character rig (REQUIREMENTS §13). One shared skeleton, swappable layers.
 * Likeness lives entirely in `features` (§13.6); poses swap the arm + prop + expression
 * layers only. Flat vector, warm ink linework, two-tone shading — never a corporate
 * isometric avatar.
 */

type Expression = 'smile' | 'focused' | 'thinking' | 'calm' | 'warm';

const POSE_EXPRESSION: Record<Pose, Expression> = {
  idle: 'calm',
  walking: 'smile',
  working: 'focused',
  thinking: 'thinking',
  presenting: 'smile',
  reading: 'focused',
  coffee: 'warm',
  waving: 'smile',
  stargazing: 'calm',
};

const STROKE = '#1A1410';

function Face({ expression, features }: { expression: Expression; features: CharacterFeatures }) {
  // Eye + mouth shapes vary by expression; brows add the emotional read.
  const eyeY = 150;
  return (
    <g>
      {/* Eyebrows */}
      <path
        d={
          expression === 'thinking'
            ? 'M168 132 q12 -8 26 -3'
            : expression === 'focused'
              ? 'M170 134 q12 -3 26 -1'
              : 'M170 132 q13 -5 26 -2'
        }
        stroke={STROKE}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={
          expression === 'thinking'
            ? 'M206 129 q12 -5 26 3'
            : 'M206 130 q13 -3 26 0'
        }
        stroke={STROKE}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {/* Eyes */}
      {expression === 'focused' ? (
        <>
          <path d="M172 150 q10 -6 22 0" stroke={STROKE} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M208 150 q10 -6 22 0" stroke={STROKE} strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={183} cy={eyeY} rx={5} ry={6.5} fill={STROKE} />
          <ellipse cx={219} cy={eyeY} rx={5} ry={6.5} fill={STROKE} />
          <circle cx={184.6} cy={148} r={1.8} fill="#FBF7EF" />
          <circle cx={220.6} cy={148} r={1.8} fill="#FBF7EF" />
        </>
      )}
      {/* Nose */}
      <path d="M200 158 q-5 10 -2 16 q3 3 7 1" stroke={STROKE} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Mouth */}
      {expression === 'smile' || expression === 'warm' ? (
        <path d="M186 186 q15 12 32 0" stroke={STROKE} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : expression === 'thinking' ? (
        <path d="M190 188 q12 -2 24 -1" stroke={STROKE} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M188 187 q14 6 28 0" stroke={STROKE} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      {features.glasses && (
        <g stroke={STROKE} strokeWidth={3.5} fill="none">
          <rect x={168} y={140} width={34} height={24} rx={8} />
          <rect x={210} y={140} width={34} height={24} rx={8} />
          <path d="M202 150 h8" />
        </g>
      )}
    </g>
  );
}

function Hair({ features }: { features: CharacterFeatures }) {
  // Curly crop: a cluster of overlapping lobes framing the top and sides (§13.2).
  const c = features.hairColor;
  return (
    <g fill={c}>
      <path d="M138 138 q-14 -66 62 -80 q78 -12 66 74 q-6 -40 -30 -50 q6 26 -6 34 q-8 -30 -30 -34 q4 22 -10 30 q-10 -24 -28 -20 q10 18 -6 28 q-12 -10 -22 8 q-2 18 34 30 z" />
      {/* Curl lobes */}
      <circle cx={150} cy={104} r={17} />
      <circle cx={176} cy={86} r={19} />
      <circle cx={206} cy={80} r={20} />
      <circle cx={234} cy={90} r={18} />
      <circle cx={256} cy={112} r={16} />
      <circle cx={140} cy={126} r={14} />
      <circle cx={262} cy={134} r={14} />
    </g>
  );
}

function Beard({ features }: { features: CharacterFeatures }) {
  if (features.facialHair === 'none') return null;
  const c = features.hairColor;
  const opacity = features.facialHair === 'stubble' ? 0.45 : 1;
  return (
    <g fill={c} opacity={opacity}>
      {/* Jaw-framing beard, leaves mouth open */}
      <path d="M146 158 q6 66 54 78 q54 -12 54 -78 q-10 40 -24 48 q-6 -6 -14 -4 q-8 8 -16 8 q-8 0 -16 -8 q-8 -2 -14 4 q-14 -8 -14 -48 z" />
      {/* Moustache */}
      <path d="M182 178 q18 8 36 0 q-6 8 -18 8 q-12 0 -18 -8 z" />
    </g>
  );
}

/** Arm + prop layers per pose (§13.4). Returns { back, front } SVG groups. */
function arms(pose: Pose, features: CharacterFeatures) {
  const skin = features.skinTone;
  const shade = features.skinShade;
  const shirt = features.shirtColor;
  const sleeve = { fill: shirt, stroke: STROKE, strokeWidth: 3 };
  const hand = { fill: skin, stroke: STROKE, strokeWidth: 3 };

  const restLeft = (
    <path d="M150 300 q-30 30 -24 96 q2 14 18 14 q14 0 14 -16 q-4 -50 10 -78 z" {...sleeve} />
  );
  const restRight = (
    <path d="M250 300 q30 30 24 96 q-2 14 -18 14 q-14 0 -14 -16 q4 -50 -10 -78 z" {...sleeve} />
  );

  switch (pose) {
    case 'waving':
      return {
        back: restLeft,
        front: (
          <g>
            <path d="M250 296 q40 -6 58 -54 q6 -16 -8 -22 q-14 -6 -20 8 q-12 30 -36 40 z" {...sleeve} />
            <circle cx={306} cy={214} r={15} {...hand} />
            <path d="M300 206 v-14 M308 204 v-16 M316 208 v-12" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
          </g>
        ),
      };
    case 'working':
      return {
        back: (
          <path d="M150 302 q-24 34 4 74 q10 12 26 4 l14 -10 z" {...sleeve} />
        ),
        front: (
          <g>
            <path d="M250 302 q24 34 -4 74 q-10 12 -26 4 l-14 -10 z" {...sleeve} />
            <ellipse cx={182} cy={382} rx={16} ry={11} {...hand} />
            <ellipse cx={218} cy={382} rx={16} ry={11} {...hand} />
          </g>
        ),
      };
    case 'thinking':
      return {
        back: restLeft,
        front: (
          <g>
            <path d="M250 300 q34 20 20 66 q-6 20 -30 24 q-16 -30 -6 -60 z" {...sleeve} />
            <circle cx={224} cy={212} r={14} {...hand} />
            <path d="M216 206 q8 -6 16 -2" stroke={STROKE} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
        ),
      };
    case 'presenting':
      return {
        back: restLeft,
        front: (
          <g>
            <path d="M250 300 q46 6 74 -8 q14 -6 8 -20 q-30 -2 -70 12 z" {...sleeve} />
            <ellipse cx={330} cy={276} rx={16} ry={12} fill={skin} stroke={STROKE} strokeWidth={3} transform="rotate(-18 330 276)" />
          </g>
        ),
      };
    case 'reading':
      return {
        back: (
          <path d="M150 302 q-20 34 6 62 l20 6 z" {...sleeve} />
        ),
        front: (
          <g>
            <path d="M250 302 q20 34 -6 62 l-20 6 z" {...sleeve} />
            {/* book/tablet */}
            <g transform="rotate(-6 200 372)">
              <rect x={158} y={352} width={84} height={54} rx={5} fill="#F3ECDB" stroke={STROKE} strokeWidth={3} />
              <line x1={200} y1={352} x2={200} y2={406} stroke={STROKE} strokeWidth={2} />
              <line x1={168} y1={366} x2={192} y2={366} stroke={shade} strokeWidth={2} />
              <line x1={168} y1={376} x2={192} y2={376} stroke={shade} strokeWidth={2} />
              <line x1={208} y1={366} x2={232} y2={366} stroke={shade} strokeWidth={2} />
            </g>
          </g>
        ),
      };
    case 'coffee':
      return {
        back: restLeft,
        front: (
          <g>
            <path d="M250 302 q30 22 6 60 q-8 12 -26 8 z" {...sleeve} />
            {/* mug */}
            <rect x={214} y={330} width={40} height={40} rx={6} fill={features.shirtColor === '#211E1B' ? '#2A2622' : '#C86A4A'} stroke={STROKE} strokeWidth={3} />
            <path d="M254 340 q18 2 16 18 q-2 12 -16 12" stroke={STROKE} strokeWidth={3} fill="none" />
            <circle cx={234} cy={368} r={12} {...hand} />
            {/* steam */}
            <path d="M224 322 q6 -8 0 -16 M236 322 q6 -8 0 -16" stroke="#E7D9BE" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
          </g>
        ),
      };
    case 'stargazing':
      return { back: restLeft, front: restRight };
    case 'walking':
      return {
        back: (
          <path d="M150 300 q-34 22 -30 84 q1 14 17 14 q14 0 14 -16 q-4 -46 14 -74 z" {...sleeve} />
        ),
        front: (
          <path d="M250 300 q30 24 30 70 q0 16 -16 18 q-14 0 -16 -16 q0 -40 -14 -60 z" {...sleeve} />
        ),
      };
    case 'idle':
    default:
      return { back: restLeft, front: restRight };
  }
}

export interface CharacterRigProps {
  pose: Pose;
  features?: CharacterFeatures;
  className?: string;
  /** Head tilt for stargazing etc., capped ±12° per §13.5. */
  headTilt?: number;
}

export default function CharacterRig({
  pose,
  features = CHARACTER,
  className,
  headTilt,
}: CharacterRigProps) {
  const expression = POSE_EXPRESSION[pose];
  const { back, front } = arms(pose, features);
  const tilt = Math.max(-12, Math.min(12, headTilt ?? (pose === 'stargazing' ? -10 : 0)));
  const skin = features.skinTone;

  return (
    <svg
      viewBox="0 0 400 460"
      className={className}
      role="img"
      aria-label={`Illustration of Omkar, ${pose}`}
      style={{ overflow: 'visible' }}
    >
      {/* soft ground shadow */}
      <ellipse cx={200} cy={438} rx={110} ry={16} fill="#1A1410" opacity={0.14} />

      {/* back arm behind torso */}
      {back}

      {/* torso / shirt */}
      <path
        d="M138 296 q62 -34 124 0 q18 84 6 150 q-68 22 -136 0 q-12 -66 6 -150 z"
        fill={features.shirtColor}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* collar */}
      <path d="M176 292 q24 26 48 0" stroke={STROKE} strokeWidth={3} fill="none" />

      {/* front arm + prop over torso */}
      {front}

      {/* neck */}
      <path d="M180 250 q20 22 40 0 l0 42 q-20 14 -40 0 z" fill={skin} stroke={STROKE} strokeWidth={3} />
      <path d="M180 258 q20 16 40 0" stroke={features.skinShade} strokeWidth={3} fill="none" opacity={0.5} />

      {/* head group (tilts) */}
      <motion.g
        style={{ originX: '200px', originY: '210px' }}
        animate={{ rotate: tilt }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
      >
        {/* head skin */}
        <ellipse cx={200} cy={150} rx={64} ry={72} fill={skin} stroke={STROKE} strokeWidth={3} />
        {/* cheek shade */}
        <path d="M250 140 q18 40 -10 70 q30 -30 10 -70 z" fill={features.skinShade} opacity={0.35} />
        {/* ears */}
        <ellipse cx={138} cy={158} rx={11} ry={16} fill={skin} stroke={STROKE} strokeWidth={3} />
        <ellipse cx={262} cy={158} rx={11} ry={16} fill={skin} stroke={STROKE} strokeWidth={3} />

        <Beard features={features} />
        <Face expression={expression} features={features} />
        <Hair features={features} />
      </motion.g>
    </svg>
  );
}

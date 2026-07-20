'use client';

import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Shared R3F canvas wrapper for the four 3D chapters (REQUIREMENTS §11). Each canvas is
 * mounted only while its chapter is active (the Stage's AnimatePresence unmounts scenes on
 * exit) so there's never more than one live WebGL context. DPR is capped for mobile GPUs,
 * and the frameloop drops to on-demand under reduced motion.
 */
export default function CanvasStage({
  children,
  camera,
}: {
  children: React.ReactNode;
  camera?: { position?: [number, number, number]; fov?: number };
}) {
  const reduced = useReducedMotion();

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: camera?.position ?? [0, 0, 8], fov: camera?.fov ?? 50 }}
      frameloop={reduced ? 'demand' : 'always'}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000', 0);
      }}
    >
      {children}
    </Canvas>
  );
}

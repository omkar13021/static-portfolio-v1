'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A slowly receding wireframe "floor" grid used to give the Projects lab and GitHub
 * workspace depth (REQUIREMENTS §11). Single line-segments draw call.
 */
export function FloatingGrid({ color = '#5FB98A', z = -3 }: { color?: string; z?: number }) {
  const grid = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (!grid.current) return;
    grid.current.position.z = z + ((state.clock.elapsedTime * 0.3) % 2);
  });
  return <gridHelper ref={grid} args={[40, 40, color, color]} rotation={[Math.PI / 2.2, 0, 0]} position={[0, -2.5, z]} />;
}

/** A cluster of gently bobbing glowing cubes — "experiments on the bench". */
export function GlowCubes({ color = '#5FB98A', count = 7 }: { color?: string; count?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.35 + (i % 3) * 0.4 - 0.4;
      child.rotation.x = state.clock.elapsedTime * 0.2 + i;
      child.rotation.y = state.clock.elapsedTime * 0.15 + i;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 3.2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 1]}>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.55}
              wireframe={i % 2 === 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

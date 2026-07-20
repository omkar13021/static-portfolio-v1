'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Drifting translucent orbs for the Learning "room made of ideas" (REQUIREMENTS §11 —
 * Learning). Instanced spheres, capped count (§11.3 Learning budget). Each orb slowly
 * bobs and rotates around a soft cloud.
 */
export function IdeaOrbs({ count = 30, color = '#8FA7E4' }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const layer = i % 3;
      const radius = 2.2 + layer * 1.3;
      const x = Math.cos(a + t * 0.06 * (layer + 1)) * radius;
      const y = Math.sin(a * 1.7 + t * 0.3) * 1.4 + (layer - 1) * 0.6;
      const z = Math.sin(a + t * 0.05 * (layer + 1)) * radius - 1.5;
      dummy.current.position.set(x, y, z);
      const s = 0.18 + ((i % 5) / 5) * 0.3;
      dummy.current.scale.setScalar(s);
      dummy.current.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
        roughness={0.2}
      />
    </instancedMesh>
  );
}

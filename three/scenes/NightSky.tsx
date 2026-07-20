'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A drifting starfield used by Contact (REQUIREMENTS §11 — Contact night sky) and, dimmed,
 * as a base for other night worlds. One THREE.Points draw call, ~1200 stars (§11.3
 * Contact budget). Optional constellation lines connect a subset into a shape.
 */
export function NightSky({
  count = 1200,
  color = '#EAF0FF',
  twinkle = true,
}: {
  count?: number;
  color?: string;
  twinkle?: boolean;
}) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic-ish spread across a wide dome
      const r = 6 + (i % 50) / 5;
      const theta = (i * 2.399963) % (Math.PI * 2); // golden angle
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.6;
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.9 + 1;
      positions[i * 3 + 2] = -2 - (i % 30) / 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.012;
    if (twinkle) {
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** A slow shooting star that arcs across occasionally. */
export function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime % 8) / 8;
    ref.current.position.set(-8 + t * 16, 4 - t * 3, -3);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#FFF3D6" transparent />
    </mesh>
  );
}

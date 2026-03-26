import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points, BufferAttribute } from "three";

const PARTICLE_COUNT = 200;

// Deterministic seeded random using simple hash
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Pre-generate particle data outside component (module-level, runs once)
function generateParticleData() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const vel = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    pos[i3] = (seededRandom(i * 6) - 0.5) * 20;
    pos[i3 + 1] = (seededRandom(i * 6 + 1) - 0.5) * 20;
    pos[i3 + 2] = (seededRandom(i * 6 + 2) - 0.5) * 20;
    vel[i3] = (seededRandom(i * 6 + 3) - 0.5) * 0.005;
    vel[i3 + 1] = (seededRandom(i * 6 + 4) - 0.5) * 0.005;
    vel[i3 + 2] = (seededRandom(i * 6 + 5) - 0.5) * 0.005;
  }
  return { positions: pos, velocities: vel };
}

const particleData = generateParticleData();

export function ParticleField() {
  const meshRef = useRef<Points>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes
      .position as BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      arr[i3] += particleData.velocities[i3];
      arr[i3 + 1] += particleData.velocities[i3 + 1];
      arr[i3 + 2] += particleData.velocities[i3 + 2];

      for (let j = 0; j < 3; j++) {
        if (arr[i3 + j] > 10) arr[i3 + j] = -10;
        if (arr[i3 + j] < -10) arr[i3 + j] = 10;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00e5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

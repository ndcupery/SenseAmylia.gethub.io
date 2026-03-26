import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh, Group } from "three";
import * as THREE from "three";

function FlaskBody() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.2, 0.4, 32, 64]} />
      <MeshDistortMaterial
        color="#00e5ff"
        emissive="#00e5ff"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.8}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function OrbitalRing({
  radius,
  color,
  speed,
  tilt,
}: {
  radius: number;
  color: string;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function EnergyCore() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#39ff14"
        emissive="#39ff14"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Deterministic pseudo-random values per node index
const NODE_SEEDS = [0.72, 0.31, 0.89, 0.15, 0.56, 0.43];

function OrbitingNodes() {
  const groupRef = useRef<Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * Math.PI * 2,
        radius: 1.8 + NODE_SEEDS[i] * 0.4,
        speed: 0.3 + NODE_SEEDS[(i + 2) % 6] * 0.3,
        size: 0.04 + NODE_SEEDS[(i + 4) % 6] * 0.04,
        color: ["#00e5ff", "#7b2fbe", "#39ff14", "#ff8c00"][i % 4],
        yOffset: (NODE_SEEDS[(i + 1) % 6] - 0.5) * 0.8,
      })),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const node = nodes[i];
      const t = state.clock.elapsedTime * node.speed + node.angle;
      child.position.x = Math.cos(t) * node.radius;
      child.position.z = Math.sin(t) * node.radius;
      child.position.y = node.yOffset + Math.sin(t * 2) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlowSphere() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshStandardMaterial
        color="#00e5ff"
        transparent
        opacity={0.03}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export function FloatingFlask() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      <FlaskBody />
      <EnergyCore />
      <OrbitalRing radius={1.8} color="#00e5ff" speed={0.4} tilt={0.3} />
      <OrbitalRing radius={2.0} color="#7b2fbe" speed={-0.3} tilt={-0.5} />
      <OrbitalRing radius={1.6} color="#39ff14" speed={0.5} tilt={1.2} />
      <OrbitingNodes />
      <GlowSphere />
    </group>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import * as THREE from "three";
import type { MousePosition } from "@/hooks/useMousePosition";

interface AuroraBlobProps {
  position: [number, number, number];
  scale: number;
  color: string;
  scrollColor?: string;
  emissiveIntensity?: number;
  opacity?: number;
  distort?: number;
  speed?: number;
  mouseInfluence?: number;
  rotationSpeed?: [number, number, number];
  mouseRef: React.RefObject<MousePosition>;
}

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _lerpedColor = new THREE.Color();

export function AuroraBlob({
  position,
  scale,
  color,
  scrollColor,
  emissiveIntensity = 0.4,
  opacity = 0.18,
  distort = 0.5,
  speed = 2,
  mouseInfluence = 0.6,
  rotationSpeed = [0.05, 0.08, 0.03],
  mouseRef,
}: AuroraBlobProps) {
  const meshRef = useRef<Mesh>(null);
  const currentPos = useRef({ x: position[0], y: position[1] });

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const mouse = mouseRef.current;

    // Smooth position follow
    if (mouse) {
      const targetX = position[0] + mouse.x * mouseInfluence;
      const targetY = position[1] + mouse.y * mouseInfluence * 0.5;
      currentPos.current.x += (targetX - currentPos.current.x) * 0.02;
      currentPos.current.y += (targetY - currentPos.current.y) * 0.02;
      mesh.position.x = currentPos.current.x;
      mesh.position.y = currentPos.current.y;
    }

    // Organic rotation
    const d = Math.min(delta, 0.1);
    mesh.rotation.x += rotationSpeed[0] * d;
    mesh.rotation.y += rotationSpeed[1] * d;
    mesh.rotation.z += rotationSpeed[2] * d;

    // Scroll-based color shift
    if (scrollColor && mouse) {
      _colorA.set(color);
      _colorB.set(scrollColor);
      _lerpedColor.lerpColors(_colorA, _colorB, mouse.scrollY);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.copy(_lerpedColor);
      mat.color.copy(_lerpedColor);
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        distort={distort}
        speed={speed}
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

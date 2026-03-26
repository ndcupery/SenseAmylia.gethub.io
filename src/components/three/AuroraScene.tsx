import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AuroraBlob } from "./AuroraBlob";
import { useMousePosition } from "@/hooks/useMousePosition";

export function AuroraScene() {
  const mouseRef = useMousePosition();

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />

          {/* Cyan blob — upper left */}
          <AuroraBlob
            position={[-2, 1, -2]}
            scale={2.5}
            color="#00e5ff"
            scrollColor="#7b2fbe"
            emissiveIntensity={0.35}
            opacity={0.18}
            distort={0.5}
            speed={1.8}
            mouseInfluence={0.8}
            rotationSpeed={[0.04, 0.06, 0.02]}
            mouseRef={mouseRef}
          />

          {/* Purple blob — right side */}
          <AuroraBlob
            position={[2.5, -0.5, -3]}
            scale={3}
            color="#7b2fbe"
            scrollColor="#ff8c00"
            emissiveIntensity={0.3}
            opacity={0.15}
            distort={0.45}
            speed={1.5}
            mouseInfluence={0.5}
            rotationSpeed={[0.03, -0.05, 0.04]}
            mouseRef={mouseRef}
          />

          {/* Green blob — lower center */}
          <AuroraBlob
            position={[0, -1.5, -1.5]}
            scale={2}
            color="#39ff14"
            scrollColor="#00e5ff"
            emissiveIntensity={0.25}
            opacity={0.14}
            distort={0.55}
            speed={2.2}
            mouseInfluence={0.6}
            rotationSpeed={[-0.05, 0.04, -0.03]}
            mouseRef={mouseRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

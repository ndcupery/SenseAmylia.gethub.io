import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { FloatingFlask } from "./FloatingFlask";
import { ParticleField } from "./ParticleField";

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00e5ff" />
          <pointLight position={[-5, -3, 3]} intensity={0.6} color="#7b2fbe" />
          <pointLight position={[0, 3, -3]} intensity={0.4} color="#39ff14" />
          <FloatingFlask />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}

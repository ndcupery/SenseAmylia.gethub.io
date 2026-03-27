import { useCallback, useState } from "react";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface VideoBackgroundProps {
  sources: string[];
}

export function VideoBackground({ sources }: VideoBackgroundProps) {
  const [loaded, setLoaded] = useState(false);
  const [src] = useState(() => pickRandom(sources));

  const handleCanPlay = useCallback(() => {
    setLoaded(true);
  }, []);

  if (!sources.length) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-[2000ms] ease-in"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[177.78vh] min-h-[120vh] w-[120vw] h-[120vh] object-cover"
        aria-hidden="true"
      />
      {/* Vignette overlay — lives on the fixed video layer */}
      <div className="absolute inset-0 bg-background/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,14,26,0.7)_70%)]" />
    </div>
  );
}

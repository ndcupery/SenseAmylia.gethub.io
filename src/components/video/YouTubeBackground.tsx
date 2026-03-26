import { useCallback, useState } from "react";

interface YouTubeBackgroundProps {
  videoId: string;
  start?: number;
}

export function YouTubeBackground({ videoId, start }: YouTubeBackgroundProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  if (!videoId) return null;

  const startParam = start ? `&start=${start}` : "";
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&cc_load_policy=0${startParam}`;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-[2000ms] ease-in"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <iframe
        src={src}
        title="Background video"
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[177.78vh] min-h-[120vh] w-[120vw] h-[120vh] border-0"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={handleLoad}
      />
      {/* Vignette overlay — lives on the fixed video layer */}
      <div className="absolute inset-0 bg-background/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,14,26,0.7)_70%)]" />
    </div>
  );
}

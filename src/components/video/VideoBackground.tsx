import { useCallback, useEffect, useRef, useState } from "react";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const INTERACTION_EVENTS = ["touchstart", "scroll", "click"] as const;

const MIN_RATE = 0.6;
const MAX_RATE = 3.0;
const VELOCITY_SCALE = 0.15;
const DECAY = 0.015;
const LERP = 0.04;

interface VideoBackgroundProps {
  sources: string[];
}

export function VideoBackground({ sources }: VideoBackgroundProps) {
  const [loaded, setLoaded] = useState(false);
  const [src] = useState(() => pickRandom(sources));
  const videoRef = useRef<HTMLVideoElement>(null);
  const listenerRef = useRef<(() => void) | null>(null);
  const targetRateRef = useRef(MIN_RATE);
  const currentRateRef = useRef(MIN_RATE);
  const rafRef = useRef(0);

  const cleanupListeners = useCallback(() => {
    if (listenerRef.current) {
      for (const evt of INTERACTION_EVENTS) {
        document.removeEventListener(evt, listenerRef.current);
      }
      listenerRef.current = null;
    }
  }, []);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Ensure muted via JS — iOS sometimes needs this set programmatically
    video.muted = true;
    video.play().catch(() => {
      // Autoplay was blocked — retry on first user interaction
      cleanupListeners();
      const playOnInteraction = () => {
        video.play().catch(() => {});
        cleanupListeners();
      };
      listenerRef.current = playOnInteraction;
      for (const evt of INTERACTION_EVENTS) {
        document.addEventListener(evt, playOnInteraction, { passive: true });
      }
    });
  }, [cleanupListeners]);

  const handleCanPlay = useCallback(() => {
    setLoaded(true);
    attemptPlay();
  }, [attemptPlay]);

  // Also attempt play on mount in case canplay already fired
  useEffect(() => {
    attemptPlay();
    return cleanupListeners;
  }, [attemptPlay, cleanupListeners]);

  // Wheel / touch-scroll → playbackRate (works even at page bounds)
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const dy = Math.abs(e.deltaY);
      // Accumulate into target so rapid wheel ticks build momentum
      targetRateRef.current = Math.min(
        targetRateRef.current + dy * VELOCITY_SCALE,
        MAX_RATE,
      );
    }

    let lastTouchY = 0;
    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      const dy = Math.abs(e.touches[0].clientY - lastTouchY);
      lastTouchY = e.touches[0].clientY;
      targetRateRef.current = Math.min(
        targetRateRef.current + dy * VELOCITY_SCALE,
        MAX_RATE,
      );
    }

    function tick() {
      const video = videoRef.current;
      if (video) {
        // Decay target back toward idle rate
        targetRateRef.current += (MIN_RATE - targetRateRef.current) * DECAY;
        // Lerp current rate toward target
        currentRateRef.current +=
          (targetRateRef.current - currentRateRef.current) * LERP;
        video.playbackRate = currentRateRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!sources.length) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-[2000ms] ease-in"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <video
        ref={videoRef}
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

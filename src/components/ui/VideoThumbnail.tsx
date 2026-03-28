import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoThumbnailProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Renders a video as a still-frame thumbnail with a play button overlay.
 * Captures a frame at ~10% of the video duration.
 */
export function VideoThumbnail({ src, alt, className = "", onClick }: VideoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleLoadedMetadata() {
      if (!video) return;
      // Seek to 10% of the duration
      video.currentTime = video.duration * 0.1;
    }

    function handleSeeked() {
      if (!video) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL("image/jpeg", 0.85));
      }
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [src]);

  return (
    <button
      onClick={onClick}
      className={`relative block w-full h-full overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Hidden video element for frame capture */}
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        muted
        playsInline
        className="hidden"
      />

      {/* Thumbnail image or fallback dark bg */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={alt ?? "Video thumbnail"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-surface" />
      )}

      {/* Play button overlay — styled like project type icons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-background/60 backdrop-blur-sm p-3 rounded-xl group-hover:bg-background/70 transition-colors duration-300">
          <Play
            size={28}
            className="text-white ml-0.5"
            fill="currentColor"
            style={{
              filter:
                "drop-shadow(0 0 12px rgba(0, 229, 255, 0.5)) drop-shadow(0 0 24px rgba(0, 229, 255, 0.25))",
            }}
          />
        </div>
      </div>
    </button>
  );
}

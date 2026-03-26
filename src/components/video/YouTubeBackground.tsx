interface YouTubeBackgroundProps {
  videoId: string;
  start?: number;
}

export function YouTubeBackground({ videoId, start }: YouTubeBackgroundProps) {
  if (!videoId) return null;

  const startParam = start ? `&start=${start}` : "";
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&cc_load_policy=0${startParam}`;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <iframe
        src={src}
        title="Background video"
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] min-w-[120vw] min-h-[120vh] border-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

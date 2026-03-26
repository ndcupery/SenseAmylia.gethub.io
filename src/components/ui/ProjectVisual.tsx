import { useMemo } from "react";
import { renderHero, renderThumbnail } from "@/lib/projectVisualRenderer";

interface ProjectThumbnailProps {
  slug: string;
  title: string;
  className?: string;
}

export function ProjectThumbnail({ slug, title, className = "" }: ProjectThumbnailProps) {
  const src = useMemo(() => renderThumbnail(slug), [slug]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/70 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-sm font-bold text-text tracking-wide text-center block">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProjectHeroProps {
  slug: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProjectHero({ slug, className = "", children }: ProjectHeroProps) {
  const src = useMemo(() => renderHero(slug), [slug]);

  return (
    <div
      className={`relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    >
      {children}
    </div>
  );
}

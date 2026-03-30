import { useMemo } from "react";
import { renderHero, renderThumbnail } from "@/lib/projectVisualRenderer";
import { PROJECT_TYPE_CONFIG } from "@/lib/projectTypeConfig";
import type { ProjectType } from "@/data/projects";

interface ProjectThumbnailProps {
  slug: string;
  title: string;
  projectType: ProjectType;
  className?: string;
}

export function ProjectThumbnail({ slug, title, projectType, className = "" }: ProjectThumbnailProps) {
  const src = useMemo(() => renderThumbnail(slug, projectType), [slug, projectType]);
  const config = PROJECT_TYPE_CONFIG[projectType];
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/60 backdrop-blur-sm p-3 rounded-xl">
          <Icon
            size={40}
            className="text-white"
            style={{
              filter: `drop-shadow(0 0 12px ${config.dominantHex}80) drop-shadow(0 0 24px ${config.dominantHex}40)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface ProjectHeroProps {
  slug: string;
  projectType?: ProjectType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ProjectHero({ slug, projectType, className = "", style, children }: ProjectHeroProps) {
  const src = useMemo(() => renderHero(slug, projectType), [slug, projectType]);

  return (
    <div
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})`, ...style }}
    >
      {children}
    </div>
  );
}

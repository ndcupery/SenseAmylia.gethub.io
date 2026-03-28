import { useMemo } from "react";
import { renderHero, renderThumbnail } from "@/lib/projectVisualRenderer";
import { Calendar } from "lucide-react";
import { PROJECT_TYPE_CONFIG } from "@/lib/projectTypeConfig";

const performanceConfig = PROJECT_TYPE_CONFIG["performance"];

interface EventThumbnailProps {
  slug: string;
  title: string;
  className?: string;
}

export function EventThumbnail({ slug, title, className = "" }: EventThumbnailProps) {
  const src = useMemo(() => renderThumbnail(slug, "performance"), [slug]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/60 backdrop-blur-sm p-3 rounded-xl">
          <Calendar
            size={40}
            className="text-white"
            style={{
              filter: `drop-shadow(0 0 12px ${performanceConfig.dominantHex}80) drop-shadow(0 0 24px ${performanceConfig.dominantHex}40)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface EventHeroProps {
  slug: string;
  className?: string;
  children?: React.ReactNode;
}

export function EventHero({ slug, className = "", children }: EventHeroProps) {
  const src = useMemo(() => renderHero(slug, "performance"), [slug]);

  return (
    <div
      className={`relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    >
      {children}
    </div>
  );
}

import type { MediaItem } from "@/data/projects";

const eventMediaFiles = import.meta.glob(
  "/src/content/events/*/media/*.{jpg,jpeg,png,gif,webp,mp4,webm}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const imageExts = new Set(["jpg", "jpeg", "png", "gif", "webp"]);
const videoExts = new Set(["mp4", "webm"]);

function filenameToAlt(filename: string): string {
  const name = filename.replace(/\.[^.]+$/, "");
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface EventMedia {
  poster: MediaItem | null;
  media: MediaItem[];
}

export function getEventMediaUrl(slug: string, filename: string): string {
  const key = `/src/content/events/${slug}/media/${filename}`;
  return eventMediaFiles[key] ?? filename;
}

export function getEventMedia(slug: string): EventMedia {
  const prefix = `/src/content/events/${slug}/media/`;
  let poster: MediaItem | null = null;
  const media: MediaItem[] = [];

  for (const [path, url] of Object.entries(eventMediaFiles)) {
    if (!path.startsWith(prefix)) continue;
    const filename = path.split("/").pop()!;
    const ext = filename.split(".").pop()!.toLowerCase();

    let type: "image" | "video";
    if (imageExts.has(ext)) type = "image";
    else if (videoExts.has(ext)) type = "video";
    else continue;

    const mediaItem: MediaItem = {
      type,
      src: url,
      alt: filenameToAlt(filename),
      filename,
    };

    if (filename.startsWith("event_poster")) {
      poster = mediaItem;
    } else {
      media.push(mediaItem);
    }
  }

  media.sort((a, b) => a.alt.localeCompare(b.alt));
  return { poster, media };
}


import type { MediaItem } from "@/data/projects";

const mediaFiles = import.meta.glob(
  "/src/content/projects/*/media/*.{jpg,jpeg,png,gif,webp,mp4,webm}",
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

/** Look up the Vite-resolved URL for a single media file by project slug and filename. */
export function getMediaUrl(slug: string, filename: string): string {
  const key = `/src/content/projects/${slug}/media/${filename}`;
  return mediaFiles[key] ?? filename;
}

export function getProjectMedia(slug: string): MediaItem[] {
  const prefix = `/src/content/projects/${slug}/media/`;
  const items: MediaItem[] = [];

  for (const [path, url] of Object.entries(mediaFiles)) {
    if (!path.startsWith(prefix)) continue;
    const filename = path.split("/").pop()!;
    const ext = filename.split(".").pop()!.toLowerCase();

    let type: "image" | "video";
    if (imageExts.has(ext)) type = "image";
    else if (videoExts.has(ext)) type = "video";
    else continue;

    items.push({
      type,
      src: url,
      alt: filenameToAlt(filename),
      filename,
    });
  }

  return items.sort((a, b) => a.alt.localeCompare(b.alt));
}

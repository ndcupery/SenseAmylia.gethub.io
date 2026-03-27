import type { MediaItem } from "@/data/projects";

const mediaFiles = import.meta.glob(
  "/public/content/projects/*/media/*.{jpg,jpeg,png,gif,webp,mp4,webm}",
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

export function getProjectMedia(slug: string): MediaItem[] {
  const prefix = `/public/content/projects/${slug}/media/`;
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

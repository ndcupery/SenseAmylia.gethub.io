import { marked } from "marked";
import { getEventMediaUrl } from "./loadEventMedia";

const eventInfoFiles = import.meta.glob(
  "/src/content/events/*/INFO.md",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1].trim() : raw.trim();
}

function resolveMediaPaths(markdown: string, slug: string): string {
  return markdown.replace(
    /(!?\[[^\]]*\]\()(?:\.\/)?media\/([^)]+)\)/g,
    (_match, prefix: string, filename: string) => {
      const resolved = getEventMediaUrl(slug, filename);
      return `${prefix}${resolved})`;
    },
  );
}

export function getEventContentHtml(slug: string): string | null {
  const key = `/src/content/events/${slug}/INFO.md`;
  const raw = eventInfoFiles[key];
  if (!raw) return null;

  const body = stripFrontmatter(raw);
  const resolved = resolveMediaPaths(body, slug);
  return marked.parse(resolved, { async: false }) as string;
}

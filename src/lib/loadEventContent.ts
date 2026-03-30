import { marked } from "marked";
import { getEventMediaUrl } from "./loadEventMedia";

const eventInfoFiles = import.meta.glob(
  "/src/content/events/*/INFO.md",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function getFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : "";
}

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

export interface EventLink {
  label: string;
  href: string;
}

export function getEventLinks(slug: string): EventLink[] {
  const key = `/src/content/events/${slug}/INFO.md`;
  const raw = eventInfoFiles[key];
  if (!raw) return [];

  const fm = getFrontmatter(raw);
  const linksMatch = fm.match(/^links:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (!linksMatch) return [];

  return linksMatch[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => {
      const content = line.replace(/^\s*-\s+/, "");
      const colonIdx = content.indexOf(": ");
      if (colonIdx === -1) return null;
      return {
        label: content.slice(0, colonIdx).trim(),
        href: content.slice(colonIdx + 2).trim(),
      };
    })
    .filter((link): link is EventLink => link !== null);
}

export function getEventContentHtml(slug: string): string | null {
  const key = `/src/content/events/${slug}/INFO.md`;
  const raw = eventInfoFiles[key];
  if (!raw) return null;

  const body = stripFrontmatter(raw);
  const resolved = resolveMediaPaths(body, slug);
  return marked.parse(resolved, { async: false }) as string;
}

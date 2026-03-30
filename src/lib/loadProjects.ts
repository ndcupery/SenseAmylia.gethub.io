import { marked } from "marked";
import type {
  Project,
  ProjectType,
  ProjectStatus,
  FlattenedMediaItem,
} from "@/data/projects";
import { getProjectMedia } from "@/lib/loadMedia";

const overviewFiles = import.meta.glob(
  "/src/content/projects/*/OVERVIEW.md",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function parseFrontmatter(raw: string): {
  attrs: Record<string, string | string[]>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { attrs: {}, body: raw.trim() };

  const attrs: Record<string, string | string[]> = {};
  let currentKey = "";
  let inArray = false;

  for (const line of match[1].split("\n")) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === "") {
        // Could be start of an array or empty value
        attrs[key] = [];
        currentKey = key;
        inArray = true;
      } else {
        attrs[key] = value.replace(/^["']|["']$/g, "");
        currentKey = key;
        inArray = false;
      }
    } else if (inArray && line.match(/^\s+-\s+(.+)$/)) {
      const itemMatch = line.match(/^\s+-\s+(.+)$/);
      if (itemMatch) {
        (attrs[currentKey] as string[]).push(itemMatch[1].trim());
      }
    }
  }

  return { attrs, body: match[2].trim() };
}

function toProject(slug: string, raw: string): Project {
  const { attrs, body } = parseFrontmatter(raw);

  return {
    slug,
    title: (attrs.title as string) ?? slug,
    abstract: (attrs.abstract as string) ?? "",
    description: body,
    tags: Array.isArray(attrs.tags) ? attrs.tags : [],
    projectType: (attrs.projectType as ProjectType) ?? "software",
    status: (attrs.status as ProjectStatus) ?? "active",
    startDate: (attrs.startDate as string) ?? "",
    ...(attrs.updatedDate ? { updatedDate: attrs.updatedDate as string } : {}),
    ...(attrs.heroImage ? { heroImage: attrs.heroImage as string } : {}),
    ...(attrs.thumbnail ? { thumbnail: attrs.thumbnail as string } : {}),
  };
}

export const projects: Project[] = Object.entries(overviewFiles)
  .map(([path, raw]) => {
    const slug = path.match(/\/src\/content\/projects\/([^/]+)\//)?.[1] ?? "";
    return toProject(slug, raw);
  })
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllTags(projectList: Project[]): string[] {
  const tagSet = new Set(projectList.flatMap((p) => p.tags));
  return Array.from(tagSet).sort();
}

export function getAllMedia(): FlattenedMediaItem[] {
  return projects.flatMap((p) =>
    getProjectMedia(p.slug).map((m) => ({
      ...m,
      projectSlug: p.slug,
      projectTitle: p.title,
    })),
  );
}

export function getProjectDescriptionHtml(slug: string): string {
  const prefix = `/src/content/projects/${slug}/OVERVIEW.md`;
  const raw = overviewFiles[prefix];
  if (!raw) return "";
  const { body } = parseFrontmatter(raw);
  return marked.parse(body, { async: false }) as string;
}

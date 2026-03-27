export interface ProjectUpdate {
  date: string;
  title: string;
  body: string;
}

const updateFiles = import.meta.glob(
  "/public/content/projects/*/updates/*.md",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function parseFrontmatter(raw: string): { title: string; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { title: "", body: raw.trim() };
  const frontmatter = match[1];
  const body = match[2].trim();
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  return { title, body };
}

export function getProjectUpdates(slug: string): ProjectUpdate[] {
  const prefix = `/public/content/projects/${slug}/updates/`;
  const updates: ProjectUpdate[] = [];

  for (const [path, raw] of Object.entries(updateFiles)) {
    if (!path.startsWith(prefix)) continue;
    const filename = path.split("/").pop()!;
    const date = filename.replace(".md", "");
    const { title, body } = parseFrontmatter(raw);
    updates.push({ date, title, body });
  }

  return updates.sort((a, b) => b.date.localeCompare(a.date));
}

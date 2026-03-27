import { marked } from "marked";

export interface ProjectUpdate {
  date: string;
  title: string;
  body: string;
  bodyHtml: string;
}

const updateFiles = import.meta.glob(
  "/public/content/projects/*/updates/*.md",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function parseFrontmatter(raw: string): {
  title: string;
  date?: string;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { title: "", body: raw.trim() };
  const frontmatter = match[1];
  const body = match[2].trim();
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const date = dateMatch ? dateMatch[1].trim() : undefined;
  return { title, date, body };
}

function resolveMediaPaths(markdown: string, slug: string): string {
  const base = `${import.meta.env.BASE_URL}content/projects/${slug}/`;
  // Resolve image/link references like ![alt](media/foo.jpg) or [text](media/foo.jpg)
  return markdown.replace(
    /(!?\[[^\]]*\]\()(?:\.\/)?media\//g,
    `$1${base}media/`,
  );
}

export function getProjectUpdates(slug: string): ProjectUpdate[] {
  const prefix = `/public/content/projects/${slug}/updates/`;
  const updates: ProjectUpdate[] = [];

  for (const [path, raw] of Object.entries(updateFiles)) {
    if (!path.startsWith(prefix)) continue;
    const filename = path.split("/").pop()!;
    const fileDate = filename.replace(".md", "");
    const { title: fmTitle, date, body } = parseFrontmatter(raw);

    // Extract leading # heading as title if no frontmatter title
    let title = fmTitle;
    let contentBody = body;
    if (!title) {
      const h1Match = contentBody.match(/^# (.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
        // Remove the heading line from body so it doesn't render twice
        contentBody = contentBody.replace(/^# .+\n?/, "").trim();
      }
    }

    const resolvedBody = resolveMediaPaths(contentBody, slug);
    const bodyHtml = marked.parse(resolvedBody, { async: false }) as string;

    updates.push({
      date: date ?? fileDate,
      title,
      body: contentBody,
      bodyHtml,
    });
  }

  return updates.sort((a, b) => b.date.localeCompare(a.date));
}

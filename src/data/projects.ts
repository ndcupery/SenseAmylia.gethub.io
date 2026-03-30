export type ProjectStatus = "active" | "completed" | "archived";
export type ProjectType = "3d" | "software" | "performance" | "artwork" | "diy";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  filename: string;
  tags?: string[];
  thumbnail?: string;
}

export interface Project {
  slug: string;
  title: string;
  abstract: string;
  description: string;
  heroImage?: string;
  thumbnail?: string;
  tags: string[];
  projectType: ProjectType;
  status: ProjectStatus;
  startDate: string;
  updatedDate?: string;
}

export interface FlattenedMediaItem extends MediaItem {
  projectSlug: string;
  projectTitle: string;
}

// Helper for referencing assets in public/content/projects/
export const projectAsset = (path: string) =>
  `${import.meta.env.BASE_URL}content/projects/${path}`;

export function projectHero(slug: string): string {
  return projectAsset(`${slug}/hero.jpg`);
}

export function projectThumbnail(slug: string): string {
  return projectAsset(`${slug}/thumbnail.jpg`);
}

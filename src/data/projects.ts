import { getProjectMedia } from "@/lib/loadMedia";

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

// Helper for referencing assets in public/content/projects/
export const projectAsset = (path: string) =>
  `${import.meta.env.BASE_URL}content/projects/${path}`;

// Convention: each project folder has hero.jpg and thumbnail.jpg at the root.
// New projects without real images yet should copy the defaults from
// public/content/defaults/hero.jpg and thumbnail.jpg into their project folder.
export function projectHero(slug: string): string {
  return projectAsset(`${slug}/hero.jpg`);
}

export function projectThumbnail(slug: string): string {
  return projectAsset(`${slug}/thumbnail.jpg`);
}

export const projects: Project[] = [
  {
    slug: "phazer-labs-website",
    title: "Phazer Labs Website",
    abstract:
      "The site you're looking at right now — built with React, Three.js, and a lot of experimentation.",
    description:
      "This website is itself an ongoing project. Built with React 19, TanStack Router, Tailwind CSS v4, and Three.js for the interactive 3D elements, it serves as both a portfolio and a playground for trying new web technologies. The YouTube background video integration, frosted glass cards, and aurora blob animations are all part of the experimental design approach. Everything is open source and deployed via GitHub Pages with automated CI/CD.",
    // heroImage and thumbnail are auto-generated via shader when not provided
    tags: ["web-dev", "react", "three-js", "open-source"],
    projectType: "software",
    status: "active",
    startDate: "2025-09-01",
    updatedDate: "2026-03-26",
  },
];

export interface FlattenedMediaItem extends MediaItem {
  projectSlug: string;
  projectTitle: string;
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

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

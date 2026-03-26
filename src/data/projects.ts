export type ProjectStatus = "active" | "completed" | "archived";

export interface ProjectUpdate {
  date: string;
  title: string;
  body: string;
}

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  tags?: string[];
  thumbnail?: string;
}

export interface Project {
  slug: string;
  title: string;
  abstract: string;
  description: string;
  heroImage: string;
  thumbnail: string;
  tags: string[];
  status: ProjectStatus;
  startDate: string;
  updatedDate?: string;
  media: MediaItem[];
  updates: ProjectUpdate[];
}

export const projects: Project[] = [
  {
    slug: "phazer-visuals-festival-tour",
    title: "Phazer Visuals Festival Tour",
    abstract:
      "Live VJ performances at festivals across the Midwest, blending real-time generative visuals with music.",
    description:
      "Phazer Visuals is my live visual performance project — I design and perform real-time generative visuals synchronized to music at festivals and events. Using a combination of custom software, MIDI controllers, and projection mapping, each performance is a unique, immersive experience. The 2026 festival season is focused on the Midwest circuit, bringing laser-reactive particle systems and audio-driven shader art to stages across the region.",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    tags: ["live-visuals", "festival", "creative-coding", "projection"],
    status: "active",
    startDate: "2025-03-01",
    updatedDate: "2026-03-15",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
        alt: "Festival crowd with laser visuals",
        tags: ["festival", "laser"],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
        alt: "Stage projection mapping setup",
        tags: ["projection", "setup"],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80",
        alt: "Live VJ performance with generative art",
        tags: ["live-visuals", "generative"],
      },
    ],
    updates: [
      {
        date: "2026-03-15",
        title: "Midwest Festival Season Lineup Announced",
        body: "Excited to announce I've been confirmed for three festivals this summer. Kicking things off in June with a headlining visual set. More details coming soon.",
      },
      {
        date: "2026-01-20",
        title: "New Particle System Ready",
        body: "Finished building a new audio-reactive particle system that responds to kick drums and hi-hats independently. The visual separation between low and high frequency elements creates way more depth in the performance.",
      },
      {
        date: "2025-11-05",
        title: "Gear Upgrade: New Projector Rig",
        body: "Upgraded to a dual-projector setup for wider stage coverage. Testing blend zones and edge-matching this week before the first indoor show of the season.",
      },
    ],
  },
  {
    slug: "phazer-labs-website",
    title: "Phazer Labs Website",
    abstract:
      "The site you're looking at right now — built with React, Three.js, and a lot of experimentation.",
    description:
      "This website is itself an ongoing project. Built with React 19, TanStack Router, Tailwind CSS v4, and Three.js for the interactive 3D elements, it serves as both a portfolio and a playground for trying new web technologies. The YouTube background video integration, frosted glass cards, and aurora blob animations are all part of the experimental design approach. Everything is open source and deployed via GitHub Pages with automated CI/CD.",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    tags: ["web-dev", "react", "three-js", "open-source"],
    status: "active",
    startDate: "2025-09-01",
    updatedDate: "2026-03-26",
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        alt: "Code editor with React components",
        tags: ["web-dev", "code"],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
        alt: "3D rendering experiments",
        tags: ["three-js", "generative"],
      },
    ],
    updates: [
      {
        date: "2026-03-26",
        title: "Gallery Page Launch",
        body: "Added the gallery and project detail pages to showcase ongoing work. Built with the same frosted glass aesthetic and smooth page transitions as the rest of the site.",
      },
      {
        date: "2026-03-20",
        title: "YouTube Video Background",
        body: "Integrated a YouTube embed as a fixed background video layer with a 2-second fade-in on load. The WebGL aurora blobs serve as a fallback while the video loads.",
      },
    ],
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
    p.media.map((m) => ({
      ...m,
      projectSlug: p.slug,
      projectTitle: p.title,
    })),
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

import { getEventMedia } from "@/lib/loadEventMedia";
import type { MediaItem } from "@/data/projects";

export interface Event {
  slug: string;
  title: string;
  abstract: string;
  eventDate: string; // YYYY-MM-DD
  venue?: string;
  city?: string;
  eventUrl?: string; // Facebook / event page link
  tags: string[];
  heroImage?: string; // omit to use auto-generated shader
  thumbnail?: string; // omit to use auto-generated shader
}

export interface FlattenedEventMediaItem extends MediaItem {
  eventSlug: string;
  eventTitle: string;
}

/** Derived — true if eventDate is today or in the future. */
export function isUpcoming(event: Event): boolean {
  return event.eventDate >= new Date().toISOString().slice(0, 10);
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getAllEventTags(): string[] {
  const tagSet = new Set(events.flatMap((e) => e.tags));
  return Array.from(tagSet).sort();
}

export function getAllEventMedia(): FlattenedEventMediaItem[] {
  return events.flatMap((e) => {
    const { poster, media } = getEventMedia(e.slug);
    const all = poster ? [poster, ...media] : media;
    return all.map((m) => ({ ...m, eventSlug: e.slug, eventTitle: e.title }));
  });
}

export const events: Event[] = [
  {
    slug: "cloverpalooza-2025",
    title: "Cloverpalooza",
    abstract:
      "St. Patrick's Day birthday extravaganza at Mortimers — live VJ visuals with real-time Kinect point clouds.",
    eventDate: "2025-03-14",
    venue: "Mortimers",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "festival", "kinect"],
  },
  {
    slug: "sharks-and-lasers-2-2025",
    title: "Sharks & Lasers II",
    abstract:
      "Form Entertainment's 360 Cube Stage returns for round two at the Giantvalley American Legion — live visuals, lasers, and a stacked lineup.",
    eventDate: "2025-05-23",
    venue: "Giantvalley American Legion Post 234",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "form-entertainment"],
  },
  {
    slug: "chronicles-of-shlump-2025",
    title: "The Chronicles of Shlump Tour",
    abstract:
      "Live visuals at The Cabooze for Shlump's alien bass tour with Rsun, Dmtree, and Szyra — a collaboration with H.A.C. out of Duluth.",
    eventDate: "2025-11-28",
    venue: "The Cabooze",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "bass-music", "hac"],
  },
  {
    slug: "electronic-plaza-2026",
    title: "Electronic Plaza",
    abstract:
      "One day and night electronica hotel takeover at Crown Plaza Minneapolis West — live projected visuals for a massive lineup including DJ ESP, Josh Fairman of Sunsquabi, and Lady Midnight.",
    eventDate: "2026-04-03",
    venue: "Crown Plaza Minneapolis West",
    city: "Plymouth, MN",
    tags: ["live-visuals", "vj", "festival", "electronica"],
  },
  {
    slug: "breakers-paradise-17-2026",
    title: "Breaker's Paradise 17",
    abstract:
      "Alterum's Birthday Show at Terminal Bar — live projected visuals for a night of bass music featuring Sami Knox, Jiggy, Katalyst, and Alterum.",
    eventDate: "2026-04-08",
    venue: "Terminal Bar",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "bass-music"],
  },
];

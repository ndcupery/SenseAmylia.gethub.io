import { getEventMedia } from "@/lib/loadEventMedia";
import type { MediaItem } from "@/data/projects";

export interface Event {
  slug: string;
  title: string;
  abstract: string;
  description: string;
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
    description:
      "On March 14th I performed live visuals at Cloverpalooza, a St. Patrick's Day-adjacent birthday extravaganza celebrating Roman, Lee, and Amber at Mortimers. It was $10 at the door with half the proceeds going to charity. The lineup featured Ruca, Saint DK, Ghost Channels, Michael Link, and Guacaromie, with Edison slotted to close as headliner. This was one of my first real tests of the Xbox Kinect v2 as a live performance tool — I rigged the depth camera to capture the DJs on stage and translate that data into real-time point clouds woven into the visuals. Seeing performers rendered as floating geometry pulsing to the music was exactly the effect I'd been chasing, and Cloverpalooza was the first time it really clicked in a live setting.",
    eventDate: "2025-03-14",
    venue: "Mortimers",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "festival", "kinect"],
  },
];

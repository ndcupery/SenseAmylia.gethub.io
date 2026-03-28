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
  {
    slug: "sharks-and-lasers-2-2025",
    title: "Sharks & Lasers II",
    abstract:
      "Form Entertainment's 360 Cube Stage returns for round two at the Giantvalley American Legion — live visuals, lasers, and a stacked lineup.",
    description:
      "I performed live visuals at Sharks & Lasers II, the second installment of Form Entertainment's immersive event series at the Giantvalley American Legion. The night featured performances on Form's 360 Cube Stage with sets from Hobday, Edison, Savage Mogul, and Moonshie Sax & Friends, plus hip-hop sets from T-Groovy, K Kash x whereisgxn, shyEx, That's Unimportant, Jalen Washington, and Mvxmilli — hosted by Optimystic LMZ with DJ Vegan Water on the decks.",
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
    description:
      "I provided live visuals alongside Interstellar Lighting for The Chronicles of Shlump Tour at The Cabooze. Shlump headlined with support from Rsun, Dmtree, and Szyra — a night of heavy alien bass, psychedelic dubstep, and interdimensional vibes. This event was a collaboration with H.A.C. (Human Artistic Collaborations), an artist collective out of Duluth, MN run by Kyle Krause, where the main objective is to keep the metaphorical hacky sack of creative expression and performance in the air. Presented by Low & High Presents, AB Touring, and The Cabooze.",
    eventDate: "2025-11-28",
    venue: "The Cabooze",
    city: "Minneapolis, MN",
    tags: ["live-visuals", "vj", "bass-music", "hac"],
  },
];

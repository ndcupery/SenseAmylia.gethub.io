import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, ExternalLink, MapPin } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { Lightbox } from "@/components/ui/Lightbox";
import { Route } from "@/routes/events/$eventSlug/index";
import { getEventBySlug, isUpcoming } from "@/data/events";
import { EventHero } from "@/components/ui/EventVisual";
import { getEventMedia } from "@/lib/loadEventMedia";
import { getEventContentHtml, getEventLinks } from "@/lib/loadEventContent";
import { Button } from "@/components/ui/button";
import { useHead } from "@/hooks/useHead";

const MAX_PREVIEW = 8;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventDetail() {
  const { eventSlug } = Route.useParams();
  const event = getEventBySlug(eventSlug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useHead({
    title: event ? `${event.title} | Phazer Labs` : undefined,
    description: event?.abstract,
    ogUrl: event ? `https://phazerlabs.com/events/${event.slug}` : undefined,
    ogImage: event?.thumbnail,
  });

  if (!event) {
    return (
      <div className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black mb-4">Event Not Found</h1>
          <p className="text-text-muted mb-8">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/events">
            <Button>
              <ArrowLeft size={16} />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const upcoming = isUpcoming(event);
  const { poster, media } = getEventMedia(event.slug);
  const heroImageSrc = poster?.src ?? event.heroImage;
  const allMedia = poster ? [poster, ...media] : media;
  const previewMedia = allMedia.slice(0, MAX_PREVIEW);
  const contentHtml = getEventContentHtml(event.slug);
  const eventLinks = getEventLinks(event.slug);

  return (
    <>
      {/* Full-bleed Hero */}
      {heroImageSrc ? (
        <div
          className="relative w-full h-[60vh] -mt-[80px] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageSrc})` }}
        >
          <HeroOverlay event={event} upcoming={upcoming} eventLinks={eventLinks} />
        </div>
      ) : (
        <EventHero slug={event.slug} className="w-full h-[50vh] -mt-[80px]">
          <HeroOverlay event={event} upcoming={upcoming} eventLinks={eventLinks} />
        </EventHero>
      )}

      <div className="px-6 pb-20">
        {/* Metadata Bar */}
        <div className="mx-auto max-w-6xl -mt-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="glass rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6"
          >
            {/* Date — larger and accented for upcoming */}
            <div className={`flex items-center gap-2 ${upcoming ? "text-accent" : "text-text-muted"}`}>
              <Calendar size={upcoming ? 18 : 14} />
              <span className={upcoming ? "text-base font-bold" : "text-sm"}>
                {upcoming ? `Coming up — ` : ""}{formatFullDate(event.eventDate)}
              </span>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <MapPin size={14} />
                <span>
                  {event.venue}{event.city ? `, ${event.city}` : ""}
                </span>
              </div>
            )}

            {/* Event page link */}
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors ml-auto"
              >
                <ExternalLink size={14} />
                <span>Event Page</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Two-column layout: Content + Media Aside */}
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: INFO.md content */}
            <main className="flex-1 min-w-0">
              {contentHtml ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-lg text-text-muted leading-relaxed"
                >
                  {event.abstract}
                </motion.p>
              )}
            </main>

            {/* Right: Media aside */}
            {allMedia.length > 0 && (
              <aside className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="text-2xl font-bold mb-6"
                >
                  <span className="text-primary">Gallery</span>
                </motion.h2>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-3"
                >
                  {previewMedia.map((mediaItem, index) => (
                    <motion.div key={index} variants={item}>
                      <div className="glass rounded-xl overflow-hidden">
                        {mediaItem.type === "image" ? (
                          <button
                            onClick={() => setLightboxIndex(index)}
                            className="block w-full aspect-square overflow-hidden group cursor-pointer"
                          >
                            <img
                              src={mediaItem.src}
                              alt={mediaItem.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </button>
                        ) : (
                          <div className="aspect-square overflow-hidden">
                            <VideoThumbnail
                              src={mediaItem.src}
                              alt={mediaItem.alt}
                              onClick={() => setLightboxIndex(index)}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {allMedia.length > MAX_PREVIEW && (
                    <motion.div variants={item} className="col-span-2">
                      <Link
                        to="/events/$eventSlug/gallery"
                        params={{ eventSlug: event.slug }}
                      >
                        <Button variant="outline" className="w-full">
                          View all media ({allMedia.length})
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </aside>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        media={previewMedia}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

function HeroOverlay({
  event,
  upcoming,
  eventLinks,
}: {
  event: NonNullable<ReturnType<typeof getEventBySlug>>;
  upcoming: boolean;
  eventLinks: Array<{ label: string; href: string }>;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                Back to Events
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
              >
                {event.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-wrap items-center gap-3"
              >
                {upcoming && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium border text-accent border-accent/30 bg-accent/10">
                    Upcoming
                  </span>
                )}
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md border border-white/10 text-xs text-text-muted font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Event Links — floated right above the metadata bar */}
            {eventLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                className="flex flex-wrap gap-2 sm:justify-end"
              >
                {eventLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-colors"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

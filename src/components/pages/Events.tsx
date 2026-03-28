import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MapPin, Play, X } from "lucide-react";
import { EventThumbnail } from "@/components/ui/EventVisual";
import { events, isUpcoming, getAllEventMedia } from "@/data/events";
import { getEventMedia } from "@/lib/loadEventMedia";
import type { FlattenedEventMediaItem } from "@/data/events";

const allEventMedia = getAllEventMedia();

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function formatEventDate(dateStr: string): { month: string; day: string; year: string } {
  const [year, month, day] = dateStr.split("-");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { month: monthNames[parseInt(month, 10) - 1], day: String(parseInt(day, 10)), year };
}

export function EventsPage() {
  const [lightboxItem, setLightboxItem] = useState<FlattenedEventMediaItem | null>(null);

  const upcomingEvents = events.filter(isUpcoming).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const pastEvents = events.filter((e) => !isUpcoming(e)).sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              <span className="gradient-text">Events</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Live performances, installations, and happenings — past and upcoming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="px-6 mb-20">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-2xl font-bold mb-8"
            >
              <span className="text-accent">Upcoming</span>
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {upcomingEvents.map((event) => (
                <EventCard key={event.slug} event={event} upcoming />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="px-6 mb-20">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: upcomingEvents.length > 0 ? 0.6 : 0.5 }}
              className="text-2xl font-bold mb-8"
            >
              <span className="text-primary">Past Events</span>
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {pastEvents.map((event) => (
                <EventCard key={event.slug} event={event} upcoming={false} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Performance Gallery */}
      {allEventMedia.length > 0 && (
        <section className="px-6">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-8"
            >
              <span className="text-primary">Performance Gallery</span>
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {allEventMedia.map((m) => (
                <motion.div key={`${m.eventSlug}-${m.filename}`} variants={item} layout>
                  <div className="glass rounded-xl overflow-hidden group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      {m.type === "image" ? (
                        <button onClick={() => setLightboxItem(m)} className="block w-full h-full">
                          <img
                            src={m.src}
                            alt={m.alt}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </button>
                      ) : (
                        <video src={m.src} controls className="w-full h-full object-cover" />
                      )}
                      {m.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
                            <Play size={20} className="text-primary ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-background/80 to-transparent">
                        <span className="text-xs text-text-muted font-mono truncate block">
                          {m.eventTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6"
              onClick={() => setLightboxItem(null)}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              <img
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCard({
  event,
  upcoming,
}: {
  event: (typeof events)[number];
  upcoming: boolean;
}) {
  const { poster } = getEventMedia(event.slug);
  const { month, day, year } = formatEventDate(event.eventDate);

  return (
    <motion.div variants={item} layout>
      <Link to="/events/$eventSlug" params={{ eventSlug: event.slug }} className="block">
        <div className="relative rounded-xl overflow-hidden group cursor-pointer aspect-video">
          {/* Thumbnail */}
          {poster ? (
            <img
              src={poster.src}
              alt={poster.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
              <EventThumbnail slug={event.slug} title={event.title} className="w-full h-full" />
            </div>
          )}

          {/* Date badge — top left */}
          <div
            className={`absolute top-2 left-2 rounded-xl overflow-hidden text-center min-w-[44px] shadow-lg ${
              upcoming ? "bg-accent text-background" : "bg-background/70 backdrop-blur-sm"
            }`}
          >
            <div className={`text-[10px] font-bold uppercase px-2 pt-1 pb-0.5 ${upcoming ? "bg-accent/80" : "bg-surface-light/80"}`}>
              {month}
            </div>
            <div className={`text-lg font-black leading-none px-2 pb-1 ${upcoming ? "text-background" : "text-text"}`}>
              {day}
            </div>
            {upcoming && (
              <div className="text-[9px] font-medium px-2 pb-1 text-background/80">{year}</div>
            )}
          </div>

          {/* Event name + venue — bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-background/90 to-transparent">
            <span className="text-xs text-text group-hover:text-primary transition-colors font-semibold block truncate">
              {event.title}
            </span>
            {event.venue && (
              <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                <MapPin size={9} />
                {event.venue}{event.city ? `, ${event.city}` : ""}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

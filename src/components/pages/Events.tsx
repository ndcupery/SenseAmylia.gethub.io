import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MapPin, Play, X } from "lucide-react";
import { EventThumbnail } from "@/components/ui/EventVisual";
import { events, isUpcoming, getAllEventMedia } from "@/data/events";
import { getEventMedia } from "@/lib/loadEventMedia";
import type { FlattenedEventMediaItem } from "@/data/events";

const allEventMedia = getAllEventMedia();

const upcomingEvents = events.filter(isUpcoming).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
const pastEvents = events.filter((e) => !isUpcoming(e)).sort((a, b) => b.eventDate.localeCompare(a.eventDate));
const allEvents = [...upcomingEvents, ...pastEvents];
const allPhotos = allEventMedia.filter((m) => m.type === "image");
const allVideos = allEventMedia.filter((m) => m.type === "video");

type EventFilter = "upcoming" | "past" | "all" | "photos" | "videos";

const eventFilters: { value: EventFilter; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All Events" },
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
];

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
  const [activeFilter, setActiveFilter] = useState<EventFilter>(
    upcomingEvents.length > 0 ? "upcoming" : "all"
  );
  const [lightboxItem, setLightboxItem] = useState<FlattenedEventMediaItem | null>(null);

  const handleFilter = useCallback((filter: EventFilter) => {
    setActiveFilter(filter);
  }, []);

  // Determine grid class and items to display
  const isEventTab = activeFilter === "upcoming" || activeFilter === "past" || activeFilter === "all";
  const isMediaTab = activeFilter === "photos" || activeFilter === "videos";

  let eventItems: typeof events = [];
  let mediaItems: FlattenedEventMediaItem[] = [];

  if (activeFilter === "upcoming") eventItems = upcomingEvents;
  else if (activeFilter === "past") eventItems = pastEvents;
  else if (activeFilter === "all") eventItems = allEvents;
  else if (activeFilter === "photos") mediaItems = allPhotos;
  else if (activeFilter === "videos") mediaItems = allVideos;

  const upcomingGridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
  const compactGridClass = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

  const gridClass = activeFilter === "upcoming" ? upcomingGridClass : compactGridClass;

  const isEmpty = isEventTab ? eventItems.length === 0 : mediaItems.length === 0;
  const emptyMessage =
    activeFilter === "upcoming"
      ? "No upcoming events scheduled."
      : "No content found.";

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

      {/* Filter Tabs */}
      <section className="px-6 mb-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {eventFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeFilter === filter.value
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-text-muted hover:text-text hover:border-primary/20"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className={gridClass}
            >
              {isEventTab &&
                eventItems.map((event) => (
                  <EventCard
                    key={event.slug}
                    event={event}
                    upcoming={isUpcoming(event)}
                  />
                ))}
              {isMediaTab &&
                mediaItems.map((m) => (
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
          </AnimatePresence>

          {isEmpty && (
            <p className="text-center text-text-muted py-20">{emptyMessage}</p>
          )}
        </div>
      </section>

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

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { EventThumbnail } from "@/components/ui/EventVisual";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { Lightbox } from "@/components/ui/Lightbox";
import { events, isUpcoming, getAllEventMedia } from "@/data/events";
import { getEventMedia } from "@/lib/loadEventMedia";
import type { FlattenedEventMediaItem } from "@/data/events";
import { Button } from "@/components/ui/button";

const allEventMedia = getAllEventMedia();

const upcomingEvents = events.filter(isUpcoming).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
const pastEvents = events.filter((e) => !isUpcoming(e)).sort((a, b) => b.eventDate.localeCompare(a.eventDate));
const allEvents = [...upcomingEvents, ...pastEvents];
const allPhotos = allEventMedia.filter((m) => m.type === "image");
const allVideos = allEventMedia.filter((m) => m.type === "video");

/** Next upcoming event for the hero spotlight */
const nextUpcoming = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

type EventFilter = "upcoming" | "past" | "photos" | "videos" | "all";

const eventFilters: { value: EventFilter; label: string }[] = [
  { value: "all", label: "All Performances" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
];

/** Extract unique years from all events, sorted descending. */
const allYears = Array.from(new Set(events.map((e) => e.eventDate.slice(0, 4))))
  .sort((a, b) => b.localeCompare(a));

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

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<FlattenedEventMediaItem | null>(null);

  const handleFilter = useCallback((filter: EventFilter) => {
    setActiveFilter(filter);
    if (filter !== "all") setYearFilter("all");
  }, []);

  const isEventTab = activeFilter === "upcoming" || activeFilter === "past" || activeFilter === "all";
  const isMediaTab = activeFilter === "photos" || activeFilter === "videos";

  const eventItems = useMemo(() => {
    if (activeFilter === "upcoming") return upcomingEvents;
    if (activeFilter === "past") return pastEvents;
    if (activeFilter === "all") return allEvents;
    return [];
  }, [activeFilter]);

  const mediaItems = useMemo(() => {
    if (activeFilter === "photos") return allPhotos;
    if (activeFilter === "videos") return allVideos;
    return [];
  }, [activeFilter]);

  // Apply year sub-filter on "All Performances" tab
  const displayEvents = useMemo(() => {
    if (activeFilter !== "all" || yearFilter === "all") return eventItems;
    return eventItems.filter((e) => e.eventDate.startsWith(yearFilter));
  }, [activeFilter, yearFilter, eventItems]);

  const upcomingGridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
  const compactGridClass = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  const gridClass = activeFilter === "upcoming" ? upcomingGridClass : compactGridClass;

  const isEmpty = isEventTab ? displayEvents.length === 0 : mediaItems.length === 0;
  const emptyMessage =
    activeFilter === "upcoming"
      ? "No upcoming events scheduled."
      : activeFilter === "all" && yearFilter !== "all"
        ? `No events found for ${yearFilter}.`
        : "No content found.";

  return (
    <div className="pt-32 pb-20">
      {/* Featured Next Event Hero */}
      {nextUpcoming && <NextEventHero event={nextUpcoming} />}

      {/* Page heading */}
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

          {/* Year sub-filter for All Performances */}
          <AnimatePresence>
            {activeFilter === "all" && allYears.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap justify-center gap-2 mt-4 overflow-hidden"
              >
                <button
                  onClick={() => setYearFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    yearFilter === "all"
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:text-text hover:border-accent/20"
                  }`}
                >
                  All Years
                </button>
                {allYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setYearFilter(year)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      yearFilter === year
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-border text-text-muted hover:text-text hover:border-accent/20"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${yearFilter}`}
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className={gridClass}
            >
              {isEventTab &&
                displayEvents.map((event) => (
                  <EventCard
                    key={event.slug}
                    event={event}
                    upcoming={isUpcoming(event)}
                  />
                ))}
              {isMediaTab &&
                mediaItems.map((m) => (
                  <motion.div key={`${m.eventSlug}-${m.filename}`} variants={item} layout>
                    <div className="glass rounded-xl overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        {m.type === "image" ? (
                          <button onClick={() => setLightboxItem(m)} className="block w-full h-full group cursor-pointer">
                            <img
                              src={m.src}
                              alt={m.alt}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </button>
                        ) : (
                          <VideoThumbnail
                            src={m.src}
                            alt={m.alt}
                            onClick={() => setLightboxItem(m)}
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-background/80 to-transparent pointer-events-none">
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

      <Lightbox
        media={lightboxItem ? [lightboxItem] : []}
        currentIndex={lightboxItem ? 0 : null}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}

/** Hero spotlight for the next upcoming event */
function NextEventHero({ event }: { event: (typeof events)[number] }) {
  const { poster } = getEventMedia(event.slug);
  const heroSrc = poster?.src ?? event.heroImage;

  return (
    <section className="px-6 mb-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link
            to="/events/$eventSlug"
            params={{ eventSlug: event.slug }}
            className="block group"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[21/8]">
              {/* Background image */}
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-700">
                  <EventThumbnail slug={event.slug} title={event.title} className="w-full h-full" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

              {/* "Next Up" badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-accent/40 bg-accent/15 text-accent backdrop-blur-sm">
                  Next Up
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-text-muted mb-3">
                  <span className="flex items-center gap-1.5 text-accent font-semibold">
                    <Calendar size={14} />
                    {formatFullDate(event.eventDate)}
                  </span>
                  {event.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {event.venue}{event.city ? `, ${event.city}` : ""}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed line-clamp-2">
                  {event.abstract}
                </p>
                <div className="mt-4">
                  <Button className="group/btn">
                    View Event
                    <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
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
          {upcoming ? (
            <div className="absolute top-2 left-2 rounded-xl overflow-hidden text-center min-w-[44px] shadow-lg bg-accent text-background">
              <div className="text-[10px] font-bold uppercase px-2 pt-1 pb-0.5 bg-accent/80">
                {month}
              </div>
              <div className="text-lg font-black leading-none px-2 pb-1 text-background">
                {day}
              </div>
            </div>
          ) : (
            <div className="absolute top-2 left-2 rounded-xl overflow-hidden text-center min-w-[44px] shadow-lg bg-background/70 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase px-2 pt-1 pb-0.5 bg-surface-light/80">
                {month}
              </div>
              <div className="text-lg font-black leading-none px-2 pb-0.5 text-text">
                {day}
              </div>
              <div className="text-[9px] font-medium px-2 pb-1 text-text-muted">{year}</div>
            </div>
          )}

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

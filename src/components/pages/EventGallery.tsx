import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { Lightbox } from "@/components/ui/Lightbox";
import { Route } from "@/routes/events/$eventSlug/gallery";
import { getEventBySlug } from "@/data/events";
import { getEventMedia } from "@/lib/loadEventMedia";
import { Button } from "@/components/ui/button";
import { useHead } from "@/hooks/useHead";

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

export function EventGallery() {
  const { eventSlug } = Route.useParams();
  const event = getEventBySlug(eventSlug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useHead({
    title: event ? `Gallery | ${event.title} | Phazer Labs` : undefined,
    description: event
      ? `Photo and video gallery for ${event.title}`
      : undefined,
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

  const { poster, media } = getEventMedia(event.slug);
  const allMedia = poster ? [poster, ...media] : media;

  return (
    <>
      <div className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/events/$eventSlug"
            params={{ eventSlug: event.slug }}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to {event.title}
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-black tracking-tight mb-10"
          >
            <span className="text-primary">Gallery</span>
          </motion.h1>

          {allMedia.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {allMedia.map((mediaItem, index) => (
                <motion.div key={index} variants={item}>
                  <div className="glass rounded-xl overflow-hidden">
                    {mediaItem.type === "image" ? (
                      <button
                        onClick={() => setLightboxIndex(index)}
                        className="block w-full aspect-video overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={mediaItem.src}
                          alt={mediaItem.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </button>
                    ) : (
                      <div className="aspect-video overflow-hidden">
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
            </motion.div>
          ) : (
            <p className="text-center text-text-muted py-20">
              No media available for this event.
            </p>
          )}
        </div>
      </div>

      <Lightbox
        media={allMedia}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

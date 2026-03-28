import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Circle, X } from "lucide-react";
import { ProjectThumbnail } from "@/components/ui/ProjectVisual";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { projects, getAllTags, getAllMedia } from "@/data/projects";
import type { ProjectStatus, FlattenedMediaItem } from "@/data/projects";

const allTags = getAllTags(projects);
const allMedia = getAllMedia();

const BATCH_SIZE = 12;

type ContentFilter = "all" | "projects" | "photos" | "videos";

const contentFilters: { value: ContentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "projects", label: "Projects" },
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

const statusColors: Record<ProjectStatus, string> = {
  active: "text-accent",
  completed: "text-primary",
  archived: "text-text-muted",
};

export function Laboratory() {
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [lightboxItem, setLightboxItem] = useState<FlattenedMediaItem | null>(
    null,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count and tag when content filter changes
  const handleContentFilter = useCallback((filter: ContentFilter) => {
    setContentFilter(filter);
    setActiveTag(null);
    setVisibleCount(BATCH_SIZE);
  }, []);

  // Reset visible count when tag changes
  const handleTagFilter = useCallback((tag: string | null) => {
    setActiveTag(tag);
    setVisibleCount(BATCH_SIZE);
  }, []);

  // Filtered data
  const filteredProjects = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  const filteredPhotos = allMedia.filter((m) => m.type === "image");
  const filteredVideos = allMedia.filter((m) => m.type === "video");

  // Build the display items based on content filter
  type GalleryItem =
    | { kind: "project"; data: (typeof projects)[number] }
    | { kind: "media"; data: FlattenedMediaItem };

  let displayItems: GalleryItem[] = [];

  if (contentFilter === "all") {
    // Interleave: projects first, then all media
    displayItems = [
      ...projects.map(
        (p) => ({ kind: "project" as const, data: p }),
      ),
      ...allMedia.map(
        (m) => ({ kind: "media" as const, data: m }),
      ),
    ];
  } else if (contentFilter === "projects") {
    displayItems = filteredProjects.map((p) => ({
      kind: "project" as const,
      data: p,
    }));
  } else if (contentFilter === "photos") {
    displayItems = filteredPhotos.map((m) => ({
      kind: "media" as const,
      data: m,
    }));
  } else if (contentFilter === "videos") {
    displayItems = filteredVideos.map((m) => ({
      kind: "media" as const,
      data: m,
    }));
  }

  const visibleItems = displayItems.slice(0, visibleCount);
  const hasMore = visibleCount < displayItems.length;

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + BATCH_SIZE);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, contentFilter, activeTag]);

  const gridClass = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

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
              <span className="gradient-text">Laboratory</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Projects, experiments, and ongoing work from the lab.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Primary Content Filter */}
      <section className="px-6 mb-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {contentFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleContentFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  contentFilter === filter.value
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

      {/* Secondary Tag Filter (Projects only) */}
      <AnimatePresence>
        {contentFilter === "projects" && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 mb-6 overflow-hidden"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => handleTagFilter(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    activeTag === null
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:text-text hover:border-accent/20"
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      handleTagFilter(tag === activeTag ? null : tag)
                    }
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      tag === activeTag
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-border text-text-muted hover:text-text hover:border-accent/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Grid */}
      <section className="px-6 mt-6">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${contentFilter}-${activeTag ?? "all"}`}
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className={gridClass}
            >
              {visibleItems.map((galleryItem, index) =>
                galleryItem.kind === "project" ? (
                  <ProjectCard
                    key={`project-${galleryItem.data.slug}`}
                    project={galleryItem.data}
                  />
                ) : (
                  <MediaCard
                    key={`media-${galleryItem.data.projectSlug}-${index}`}
                    media={galleryItem.data}
                    onLightbox={() => setLightboxItem(galleryItem.data)}
                  />
                ),
              )}
            </motion.div>
          </AnimatePresence>

          {/* Infinite scroll sentinel */}
          {hasMore && <div ref={sentinelRef} className="h-1" />}

          {/* Empty state */}
          {displayItems.length === 0 && (
            <p className="text-center text-text-muted py-20">
              No content found.
            </p>
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
              {lightboxItem.type === "image" ? (
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.alt}
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                />
              ) : (
                <video
                  src={lightboxItem.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <motion.div variants={item} layout>
      <Link
        to="/laboratory/$projectSlug"
        params={{ projectSlug: project.slug }}
        className="block"
      >
        <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
              <ProjectThumbnail
                slug={project.slug}
                title={project.title}
                projectType={project.projectType}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Status badge — top left */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-background/60 backdrop-blur-sm flex items-center gap-1.5">
            <Circle
              size={6}
              fill="currentColor"
              className={statusColors[project.status]}
            />
            <span className="text-[10px] text-text-muted capitalize font-medium">
              {project.status}
            </span>
          </div>

          {/* Project name — bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-background/80 to-transparent">
            <span className="text-xs text-text group-hover:text-primary transition-colors font-medium">
              {project.title}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MediaCard({
  media,
  onLightbox,
}: {
  media: FlattenedMediaItem;
  onLightbox?: () => void;
}) {
  return (
    <motion.div variants={item} layout>
      <div className="glass rounded-xl overflow-hidden group cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          {media.type === "image" ? (
            <button
              onClick={onLightbox}
              className="block w-full h-full"
            >
              <img
                src={media.src}
                alt={media.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ) : (
            <VideoThumbnail
              src={media.src}
              alt={media.alt}
              onClick={onLightbox}
            />
          )}

          {/* Filename label — bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-background/80 to-transparent">
            <span className="text-xs text-text group-hover:text-primary transition-colors font-medium font-mono">
              {media.filename}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

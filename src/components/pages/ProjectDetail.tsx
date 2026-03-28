import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, ChevronRight, Circle, MessageSquare, X } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { Route } from "@/routes/laboratory/$projectSlug";
import { getProjectBySlug } from "@/data/projects";
import { ProjectHero } from "@/components/ui/ProjectVisual";
import { getProjectUpdates } from "@/lib/loadUpdates";
import { getProjectMedia } from "@/lib/loadMedia";
import type { ProjectUpdate } from "@/lib/loadUpdates";
import type { ProjectStatus } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { useHead } from "@/hooks/useHead";

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

const statusLabels: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "text-accent border-accent/30 bg-accent/10" },
  completed: { label: "Completed", color: "text-primary border-primary/30 bg-primary/10" },
  archived: { label: "Archived", color: "text-text-muted border-border bg-surface" },
};

export function ProjectDetail() {
  const { projectSlug } = Route.useParams();
  const project = getProjectBySlug(projectSlug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeUpdate, setActiveUpdate] = useState<ProjectUpdate | null>(null);

  const metaDescription = project
    ? project.description.length > 300
      ? project.description.slice(0, 297) + "..."
      : project.description
    : undefined;

  useHead({
    title: project ? `${project.title} | Phazer Labs` : undefined,
    description: metaDescription,
    ogUrl: project
      ? `https://phazerlabs.com/laboratory/${project.slug}`
      : undefined,
    ogImage: project?.thumbnail,
  });

  if (!project) {
    return (
      <div className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
          <p className="text-text-muted mb-8">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/laboratory">
            <Button>
              <ArrowLeft size={16} />
              Back to Laboratory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusLabels[project.status];
  const updates = getProjectUpdates(project.slug);
  const media = getProjectMedia(project.slug);

  return (
    <>
      {/* Full-bleed Hero */}
      {project.heroImage ? (
        <div
          className="relative w-full h-[60vh] -mt-[80px] bg-cover bg-center"
          style={{ backgroundImage: `url(${project.heroImage})` }}
        >
          <HeroOverlay project={project} status={status} />
        </div>
      ) : (
        <ProjectHero slug={project.slug} projectType={project.projectType} className="w-full h-[50vh] -mt-[80px]">
          <HeroOverlay project={project} status={status} />
        </ProjectHero>
      )}

      <div className="px-6 pb-20">
        {/* Metadata Bar */}
        <div className="mx-auto max-w-6xl -mt-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="glass rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 text-text-muted">
              <Calendar size={14} />
              <span>Started {project.startDate}</span>
            </div>
            {project.updatedDate && (
              <div className="flex items-center gap-2 text-text-muted">
                <Circle size={8} fill="currentColor" className="text-accent" />
                <span>Updated {project.updatedDate}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Description */}
        <section className="mx-auto max-w-4xl mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-lg text-text-muted leading-relaxed"
          >
            {project.description}
          </motion.p>
        </section>

        {/* Updates Timeline */}
        {updates.length > 0 && (
          <section className="mx-auto max-w-4xl mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold mb-8"
            >
              <span className="text-accent">Updates</span>
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {updates.map((update) => (
                <motion.button
                  key={update.date}
                  variants={item}
                  onClick={() => setActiveUpdate(update)}
                  className="group w-full text-left glass rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.12)] hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-text flex-1">{update.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-surface-light text-xs font-mono text-text-muted shrink-0">
                      {update.date}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300 shrink-0"
                    />
                  </div>
                  <div
                    className="relative max-h-24 overflow-hidden text-sm text-text-muted leading-relaxed update-preview"
                    dangerouslySetInnerHTML={{ __html: update.bodyHtml }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </section>
        )}

        {/* Media Gallery */}
        {media.length > 0 && (
          <section>
            <div className="mx-auto max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold mb-8"
              >
                <span className="text-primary">Media</span>
              </motion.h2>
            </div>
            <div className="mx-auto max-w-6xl">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {media.map((mediaItem, index) => (
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
            </div>
          </section>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && media[lightboxIndex] && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              {media[lightboxIndex].type === "image" ? (
                <img
                  src={media[lightboxIndex].src}
                  alt={media[lightboxIndex].alt}
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                />
              ) : (
                <video
                  src={media[lightboxIndex].src}
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

      {/* Update Modal */}
      <AnimatePresence>
        {activeUpdate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveUpdate(null)}
              className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6"
              onClick={() => setActiveUpdate(null)}
            >
              <div
                className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl glass border border-border overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-6 pb-0">
                  <h2 className="text-2xl font-bold text-text flex-1">
                    {activeUpdate.title}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-surface-light text-xs font-mono text-text-muted shrink-0">
                    {activeUpdate.date}
                  </span>
                  <button
                    onClick={() => setActiveUpdate(null)}
                    className="p-2 text-text-muted hover:text-primary transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div
                    className="update-content text-text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: activeUpdate.bodyHtml }}
                  />
                </div>

                {/* Sticky bottom footer — comment thread placeholder */}
                <div className="border-t border-border px-6 py-4">
                  <div className="flex items-center gap-3 text-text-muted">
                    <MessageSquare size={16} />
                    <span className="text-sm">Comments coming soon...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroOverlay({
  project,
  status,
}: {
  project: ReturnType<typeof getProjectBySlug> & {};
  status: { label: string; color: string };
}) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/laboratory"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to Laboratory
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
          >
            {project.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
            >
              {status.label}
            </span>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md border border-white/10 text-xs text-text-muted font-mono"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Circle,
  FileText,
  FlaskConical,
} from "lucide-react";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { Lightbox } from "@/components/ui/Lightbox";
import { Route } from "@/routes/laboratory/$projectSlug/index";
import { getProjectBySlug, getProjectDescriptionHtml } from "@/lib/loadProjects";
import { ProjectHero } from "@/components/ui/ProjectVisual";
import { getProjectUpdates } from "@/lib/loadUpdates";
import { getProjectMedia } from "@/lib/loadMedia";
import type { ProjectUpdate } from "@/lib/loadUpdates";
import type { ProjectStatus } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { useHead } from "@/hooks/useHead";

const MAX_PREVIEW = 9;

type ProjectTab = "overview" | "lab-notes";

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
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");
  const [selectedUpdateDate, setSelectedUpdateDate] = useState<string | null>(null);

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
  const descriptionHtml = getProjectDescriptionHtml(project.slug);
  const updates = getProjectUpdates(project.slug);
  const media = getProjectMedia(project.slug);
  const latestUpdate = updates.length > 0 ? updates[0] : null;
  const previewMedia = media.slice(0, MAX_PREVIEW);

  const selectedUpdate = selectedUpdateDate
    ? updates.find((u) => u.date === selectedUpdateDate) ?? null
    : null;

  function goToLabNotes(updateDate?: string) {
    setActiveTab("lab-notes");
    setSelectedUpdateDate(updateDate ?? null);
  }

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
        <div className="mx-auto max-w-6xl -mt-4 mb-8">
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
            {updates.length > 0 && (
              <div className="flex items-center gap-2 text-text-muted ml-auto">
                <FlaskConical size={14} />
                <span>{updates.length} lab note{updates.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tab Bar */}
        <div className="mx-auto max-w-6xl mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex gap-2"
          >
            <button
              onClick={() => { setActiveTab("overview"); setSelectedUpdateDate(null); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeTab === "overview"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-text-muted hover:text-text hover:border-primary/20"
              }`}
            >
              Overview
            </button>
            {updates.length > 0 && (
              <button
                onClick={() => goToLabNotes()}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeTab === "lab-notes"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-text-muted hover:text-text hover:border-primary/20"
                }`}
              >
                Lab Notes
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-surface-light text-xs font-mono">
                  {updates.length}
                </span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Latest Update Hero */}
              {latestUpdate && (
                <LatestUpdateHero update={latestUpdate} onNavigate={() => goToLabNotes(latestUpdate.date)} />
              )}

              {/* Two-column: Description + Media Aside */}
              <div className="mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left: OVERVIEW.md content */}
                  <main className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="prose prose-invert prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />
                  </main>

                  {/* Right: Media aside */}
                  {media.length > 0 && (
                    <MediaAside
                      media={previewMedia}
                      totalCount={media.length}
                      onMediaClick={setLightboxIndex}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lab-notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LabNotesView
                updates={updates}
                selectedUpdate={selectedUpdate}
                onSelectUpdate={(date) => setSelectedUpdateDate(date)}
                media={previewMedia}
                totalMediaCount={media.length}
                onMediaClick={setLightboxIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Lightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

/* ─── Hero Overlay ─────────────────────────────────────────────── */

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

/* ─── Latest Update Hero ───────────────────────────────────────── */

function LatestUpdateHero({
  update,
  onNavigate,
}: {
  update: ProjectUpdate;
  onNavigate: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <button onClick={onNavigate} className="block w-full text-left group">
          <div className="relative rounded-2xl overflow-hidden glass border border-border hover:border-primary/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.12)] transition-all duration-300">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-6 sm:p-8">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-accent/40 bg-accent/15 text-accent">
                  Latest Update
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-light text-xs font-mono text-text-muted">
                  {update.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {update.title}
              </h3>

              {/* Preview */}
              <div
                className="relative max-h-20 overflow-hidden text-sm text-text-muted leading-relaxed update-preview"
                dangerouslySetInnerHTML={{ __html: update.bodyHtml }}
              />

              {/* CTA */}
              <div className="mt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  Read full note
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    </section>
  );
}

/* ─── Media Aside ──────────────────────────────────────────────── */

function MediaAside({
  media,
  totalCount,
  onMediaClick,
}: {
  media: ReturnType<typeof getProjectMedia>;
  totalCount: number;
  onMediaClick: (index: number) => void;
}) {
  return (
    <aside className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-2xl font-bold mb-6"
      >
        <span className="text-primary">Media</span>
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3"
      >
        {media.map((mediaItem, index) => (
          <motion.div key={index} variants={item}>
            <div className="glass rounded-xl overflow-hidden">
              {mediaItem.type === "image" ? (
                <button
                  onClick={() => onMediaClick(index)}
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
                    onClick={() => onMediaClick(index)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {totalCount > media.length && (
          <motion.div variants={item} className="col-span-3">
            <Button variant="outline" className="w-full" onClick={() => onMediaClick(media.length - 1)}>
              View all media ({totalCount})
            </Button>
          </motion.div>
        )}
      </motion.div>
    </aside>
  );
}

/* ─── Lab Notes View ───────────────────────────────────────────── */

function LabNotesView({
  updates,
  selectedUpdate,
  onSelectUpdate,
  media,
  totalMediaCount,
  onMediaClick,
}: {
  updates: ProjectUpdate[];
  selectedUpdate: ProjectUpdate | null;
  onSelectUpdate: (date: string) => void;
  media: ReturnType<typeof getProjectMedia>;
  totalMediaCount: number;
  onMediaClick: (index: number) => void;
}) {
  // If no update selected, show the list view
  if (!selectedUpdate) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main: Update list */}
          <main className="flex-1 min-w-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {updates.map((update) => (
                <motion.button
                  key={update.date}
                  variants={item}
                  onClick={() => onSelectUpdate(update.date)}
                  className="group w-full text-left glass rounded-2xl p-6 border border-border cursor-pointer hover:border-primary/30 hover:shadow-[0_0_40px_rgba(0,229,255,0.12)] hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={16} className="text-primary shrink-0" />
                    <h3 className="font-semibold text-text flex-1 group-hover:text-primary transition-colors">
                      {update.title}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-surface-light text-xs font-mono text-text-muted shrink-0">
                      {update.date}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300 shrink-0"
                    />
                  </div>
                  <div
                    className="relative max-h-20 overflow-hidden text-sm text-text-muted leading-relaxed update-preview ml-7"
                    dangerouslySetInnerHTML={{ __html: update.bodyHtml }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </main>

          {/* Right: Media aside */}
          {media.length > 0 && (
            <MediaAside
              media={media}
              totalCount={totalMediaCount}
              onMediaClick={onMediaClick}
            />
          )}
        </div>
      </div>
    );
  }

  // Update selected — show left sidebar + main article
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Update sidebar */}
        <aside className="w-full lg:w-[280px] lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Lab Notes
            </h3>
            <button
              onClick={() => onSelectUpdate("")}
              className="text-xs text-primary hover:text-accent transition-colors"
            >
              Back to list
            </button>
          </div>
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
            {updates.map((update) => (
              <button
                key={update.date}
                onClick={() => onSelectUpdate(update.date)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  selectedUpdate.date === update.date
                    ? "glass border border-primary/30 text-primary font-semibold"
                    : "text-text-muted hover:text-text hover:bg-surface-light/50 border border-transparent"
                }`}
              >
                <div className="font-medium truncate">{update.title}</div>
                <div className="text-xs font-mono mt-1 opacity-60">{update.date}</div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main: Selected update article */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.article
              key={selectedUpdate.date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl border border-border overflow-hidden"
            >
              {/* Article header */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-surface-light text-xs font-mono text-text-muted">
                    {selectedUpdate.date}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text">
                  {selectedUpdate.title}
                </h2>
              </div>

              {/* Article body */}
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <div
                  className="update-content text-text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedUpdate.bodyHtml }}
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}

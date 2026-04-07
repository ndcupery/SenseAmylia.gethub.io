import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LightboxViewer } from "./LightboxViewer";
import { GalleryGrid } from "./GalleryGrid";
import type { MediaItem } from "@/data/projects";

type LightboxMode = "viewer" | "gallery";

interface LightboxProps {
  media: MediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate?: (newIndex: number) => void;
}

export function Lightbox({
  media,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const isOpen = currentIndex !== null;

  return (
    <AnimatePresence>
      {isOpen && currentIndex !== null && (
        <LightboxContent
          key="lightbox"
          media={media}
          currentIndex={currentIndex}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      )}
    </AnimatePresence>
  );
}

function LightboxContent({
  media,
  currentIndex,
  onClose,
  onNavigate,
}: {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (newIndex: number) => void;
}) {
  const [mode, setMode] = useState<LightboxMode>("viewer");

  // Lock body scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard handling — mode-aware
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode === "gallery") {
          setMode("viewer");
        } else {
          onClose();
        }
        return;
      }

      // Arrow keys only in viewer mode
      if (mode === "viewer" && onNavigate) {
        if (e.key === "ArrowLeft") {
          onNavigate((currentIndex - 1 + media.length) % media.length);
        } else if (e.key === "ArrowRight") {
          onNavigate((currentIndex + 1) % media.length);
        }
      }
    },
    [currentIndex, mode, onNavigate, onClose, media.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleNavigate = useCallback(
    (index: number) => {
      onNavigate?.(index);
    },
    [onNavigate],
  );

  const handleGallerySelect = useCallback(
    (index: number) => {
      onNavigate?.(index);
      setMode("viewer");
    },
    [onNavigate],
  );

  return (
    <LayoutGroup>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <AnimatePresence mode="wait">
        {mode === "viewer" ? (
          <LightboxViewer
            key="viewer"
            media={media}
            currentIndex={currentIndex}
            onClose={onClose}
            onNavigate={handleNavigate}
            onOpenGallery={() => setMode("gallery")}
          />
        ) : (
          <GalleryGrid
            key="gallery"
            media={media}
            currentIndex={currentIndex}
            onSelect={handleGallerySelect}
            onClose={onClose}
            onBackToViewer={() => setMode("viewer")}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

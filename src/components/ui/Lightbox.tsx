import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@/data/projects";

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
  const hasPrev = onNavigate && media.length > 1;
  const hasNext = onNavigate && media.length > 1;

  const goPrev = useCallback(() => {
    if (!onNavigate || currentIndex === null) return;
    onNavigate((currentIndex - 1 + media.length) % media.length);
  }, [onNavigate, currentIndex, media.length]);

  const goNext = useCallback(() => {
    if (!onNavigate || currentIndex === null) return;
    onNavigate((currentIndex + 1) % media.length);
  }, [onNavigate, currentIndex, media.length]);

  useEffect(() => {
    if (currentIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, onClose, goPrev, goNext]);

  const current = currentIndex !== null ? media[currentIndex] : null;

  return (
    <AnimatePresence>
      {current && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-6"
            onClick={onClose}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-text-muted hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-background/60 backdrop-blur-sm text-text-muted hover:text-primary hover:bg-background/80 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-background/60 backdrop-blur-sm text-text-muted hover:text-primary hover:bg-background/80 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {current.type === "image" ? (
              <img
                src={current.src}
                alt={current.alt}
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={current.src}
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
  );
}

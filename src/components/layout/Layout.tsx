import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/nav/Navbar";
import { CommandPalette } from "@/components/nav/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { VideoBackground } from "@/components/video/VideoBackground";
import { useCommandPalette } from "@/lib/useCommandPalette";

const BACKGROUND_VIDEOS = [
  "/content/video/background.mp4",
  "/content/video/background_alt.mp4",
];

export function Layout({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useCommandPalette();
  const routerState = useRouterState();
  const locationKey = routerState.location.pathname;

  return (
    <div className="relative min-h-screen flex flex-col">
      <VideoBackground sources={BACKGROUND_VIDEOS} />
      <Navbar onCommandOpen={() => setIsOpen(true)} />
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={locationKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

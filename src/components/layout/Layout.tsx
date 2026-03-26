import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/nav/Navbar";
import { CommandPalette } from "@/components/nav/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { useCommandPalette } from "@/lib/useCommandPalette";

export function Layout({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useCommandPalette();
  const routerState = useRouterState();
  const locationKey = routerState.location.pathname;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar onCommandOpen={() => setIsOpen(true)} />
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AnimatePresence mode="wait">
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

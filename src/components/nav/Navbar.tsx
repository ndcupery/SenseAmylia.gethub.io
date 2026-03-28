import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/laboratory" as const, label: "Laboratory" },
  { to: "/events" as const, label: "Events" },
  { to: "/contact" as const, label: "Booking" },
];

export function Navbar({ onCommandOpen }: { onCommandOpen: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <nav className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-shadow">
              <span className="text-background font-black text-sm">P</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg tracking-tight text-primary">
                PHAZER
              </span>
              <span className="font-bold text-sm tracking-widest text-accent">
                LABS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? currentPath === "/" || currentPath === ""
                  : currentPath.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCommandOpen}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-text-muted hover:text-primary hover:border-primary/30 transition-colors"
            >
              <Command size={14} />
              <span>K</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl mt-2 p-4 md:hidden"
          >
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? currentPath === "/" || currentPath === ""
                  : currentPath.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                onCommandOpen();
              }}
              className="w-full mt-2 flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-text-muted hover:text-primary transition-colors"
            >
              <Command size={14} />
              <span>Command Palette</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

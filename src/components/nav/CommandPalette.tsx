import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Image, Mail, ArrowRight } from "lucide-react";

const commands = [
  {
    id: "home",
    label: "Home",
    description: "Go to the home page",
    icon: Home,
    to: "/" as const,
  },
  {
    id: "about",
    label: "About",
    description: "Learn about Sense Amylia",
    icon: User,
    to: "/about" as const,
  },
  {
    id: "laboratory",
    label: "Laboratory",
    description: "Browse projects and experiments",
    icon: Image,
    to: "/laboratory" as const,
  },
  {
    id: "booking",
    label: "Booking",
    description: "Book Phazer Visuals for your event",
    icon: Mail,
    to: "/contact" as const,
  },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && <CommandPaletteInner onClose={onClose} />}
    </AnimatePresence>
  );
}

function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = useCallback(
    (to: (typeof commands)[number]["to"]) => {
      onClose();
      navigate({ to });
    },
    [onClose, navigate],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      handleSelect(filtered[activeIndex].to);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
      />

      {/* Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg px-4"
      >
        <div className="glass rounded-2xl overflow-hidden border border-primary/20 glow-border-primary">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Search size={18} className="text-primary" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent text-text placeholder:text-text-muted outline-none text-sm"
            />
            <kbd className="px-2 py-0.5 rounded-md bg-surface text-text-muted text-xs border border-border">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="p-2 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-text-muted text-sm">
                No results found
              </p>
            ) : (
              filtered.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.to)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-colors ${
                    index === activeIndex
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <cmd.icon size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className="text-xs text-text-muted">
                      {cmd.description}
                    </p>
                  </div>
                  {index === activeIndex && (
                    <ArrowRight size={14} className="text-primary" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-border text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">
                &uarr;&darr;
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">
                &crarr;
              </kbd>
              Select
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

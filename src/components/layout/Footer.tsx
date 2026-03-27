import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="glass border-t border-border py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">PHAZER</span>
            <span className="text-lg font-bold text-accent">LABS</span>
          </div>
          <nav className="flex items-center gap-8 text-sm text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link
              to="/gallery"
              className="hover:text-primary transition-colors"
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary transition-colors"
            >
              Booking
            </Link>
          </nav>
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Phazer Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

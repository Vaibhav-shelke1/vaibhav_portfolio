"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  label: string;
  number: string;
}

interface Props {
  sections: Section[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function Navbar({ sections, activeSection, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo — always visible */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleNav("about"); }}
          className="font-mono text-sm font-bold text-green-glow glow-green flex items-center gap-2"
        >
          <span className="text-[var(--muted)]">&gt;</span>
          vaibhav.shelke
          <span className="inline-block w-2 h-4 bg-green-glow animate-blink" />
        </a>

        {/* Desktop: status badge only (side nav handles section links) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
          <span className="status-dot" />
          <span>ONLINE</span>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden text-[var(--muted)] hover:text-green-glow transition-colors p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div
            className={`w-5 h-0.5 bg-current mb-1.5 transition-all origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <div
            className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <div
            className={`w-5 h-0.5 bg-current transition-all origin-center ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile full-screen nav overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--surface)]/98 backdrop-blur-md border-t border-[var(--border)] px-4 py-4 space-y-1"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNav(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-sm transition-colors flex items-center gap-3 ${
                  activeSection === section.id
                    ? "text-green-glow bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
                }`}
              >
                <span className="text-[var(--muted)] text-xs">{section.number}</span>
                {section.label}
              </button>
            ))}

            <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2 px-3 text-xs font-mono text-[var(--muted)]">
              <span className="status-dot" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

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

export default function SideNav({ sections, activeSection, onNavigate }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const activeIdx = sections.findIndex((s) => s.id === activeSection);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-0 select-none"
    >
      {/* Level counter */}
      <div className="text-right mb-5">
        <div className="text-[9px] font-mono text-green-glow tracking-[0.2em] uppercase mb-0.5">
          Level
        </div>
        <div className="font-mono font-bold leading-none flex items-baseline gap-1 justify-end">
          <motion.span
            key={activeIdx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl text-[var(--text)]"
          >
            {String(activeIdx + 1).padStart(2, "0")}
          </motion.span>
          <span className="text-xs text-[var(--muted)]">
            /{String(sections.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-px h-16 bg-[var(--border)] relative mb-4 overflow-hidden rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-green-glow rounded-full"
          style={{ boxShadow: "0 0 6px rgba(0,255,136,0.7)" }}
          animate={{ height: `${((activeIdx + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Section dots */}
      <div className="flex flex-col items-end gap-3.5">
        {sections.map((section, i) => {
          const isActive = activeSection === section.id;
          const isPast = i < activeIdx;

          return (
            <div key={section.id} className="flex items-center gap-2.5">
              {/* Hover label */}
              <AnimatePresence>
                {hovered === section.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="bg-[var(--card)] border border-[var(--border)] rounded px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                  >
                    <span className="text-[var(--muted)]">{section.number}</span>
                    <span className="text-[var(--text)] ml-1">{section.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot button */}
              <button
                onClick={() => onNavigate(section.id)}
                onMouseEnter={() => setHovered(section.id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Go to ${section.label}`}
                className="relative flex items-center justify-center w-5 h-5"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-dot-ring"
                    className="absolute inset-0 rounded-full border border-green-glow opacity-50"
                    style={{ boxShadow: "0 0 8px rgba(0,255,136,0.4)" }}
                  />
                )}
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width:  isActive ? "10px" : "6px",
                    height: isActive ? "10px" : "6px",
                    background: isActive
                      ? "#00ff88"
                      : isPast
                      ? "rgba(0,255,136,0.35)"
                      : "var(--border)",
                    boxShadow: isActive ? "0 0 10px rgba(0,255,136,0.8)" : "none",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Arrow buttons */}
      <div className="flex flex-col items-center gap-1.5 mt-5">
        <button
          onClick={() => activeIdx > 0 && onNavigate(sections[activeIdx - 1].id)}
          disabled={activeIdx === 0}
          aria-label="Previous section"
          className="font-mono text-[10px] text-[var(--muted)] hover:text-green-glow disabled:opacity-20 transition-colors leading-none"
        >
          ▲
        </button>
        <button
          onClick={() =>
            activeIdx < sections.length - 1 && onNavigate(sections[activeIdx + 1].id)
          }
          disabled={activeIdx === sections.length - 1}
          aria-label="Next section"
          className="font-mono text-[10px] text-[var(--muted)] hover:text-green-glow disabled:opacity-20 transition-colors leading-none"
        >
          ▼
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-3 text-[9px] font-mono text-[var(--muted)] text-center opacity-50">
        ↑↓ keys
      </div>
    </nav>
  );
}

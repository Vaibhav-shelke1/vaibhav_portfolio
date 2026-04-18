"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { NavigationContext } from "@/context/NavigationContext";
import Hero from "./Hero";
import Skills from "./Skills";
import Experience from "./Experience";
import Education from "./Education";
import GitHubContributions from "./GitHubContributions";
import Projects from "./Projects";
import LeetCode from "./LeetCode";
import Contact from "./Contact";
import Terminal from "./Terminal";
import CursorTrail from "./CursorTrail";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const FILES = [
  { id: "about",        label: "about.tsx",        lang: "TypeScript JSX", icon: "⚛",  col: "#61DAFB" },
  { id: "skills",       label: "skills.ts",         lang: "TypeScript",     icon: "ts", col: "#3178C6" },
  { id: "experience",   label: "experience.json",   lang: "JSON",           icon: "{}",col: "#ffd32a" },
  { id: "education",    label: "education.json",    lang: "JSON",           icon: "{}",col: "#ffd32a" },
  { id: "github",       label: "github.md",         lang: "Markdown",       icon: "#",  col: "#9d4edd" },
  { id: "projects",     label: "projects.ts",       lang: "TypeScript",     icon: "ts", col: "#3178C6" },
  { id: "leetcode",     label: "leetcode.ts",       lang: "TypeScript",     icon: "ts", col: "#f89f1b" },
  { id: "contact",      label: "contact.tsx",       lang: "TypeScript JSX", icon: "⚛",  col: "#61DAFB" },
] as const;

type FileId = (typeof FILES)[number]["id"];
const FILE_MAP = Object.fromEntries(FILES.map((f) => [f.id, f])) as Record<
  FileId,
  (typeof FILES)[number]
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_MAP: Record<FileId, React.ComponentType<any>> = {
  about:        Hero,
  skills:       Skills,
  experience:   Experience,
  education:    Education,
  github:       GitHubContributions,
  projects:     Projects,
  leetcode:     LeetCode,
  contact:      Contact,
};

const ALL_IDS = FILES.map((f) => f.id as FileId);

/* ─── TitleBar ──────────────────────────────────────────────────────────── */

function TitleBar({
  label,
  onMenuOpen,
}: {
  label: string;
  onMenuOpen: () => void;
}) {
  return (
    <div
      className="flex items-center h-8 px-3 select-none flex-shrink-0 gap-2"
      style={{ background: "#010409", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {[
          { bg: "#ff5f57", hover: "#7d1f1f", glyph: "✕" },
          { bg: "#febc2e", hover: "#7d5800", glyph: "−" },
          { bg: "#28c840", hover: "#0a4d1f", glyph: "+" },
        ].map(({ bg, hover, glyph }) => (
          <div
            key={bg}
            className="w-3 h-3 rounded-full cursor-pointer hover:brightness-125 transition-all group relative flex-shrink-0"
            style={{ background: bg }}
          >
            <span
              className="absolute inset-0 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 font-bold leading-none"
              style={{ color: hover }}
            >
              {glyph}
            </span>
          </div>
        ))}
      </div>

      {/* Title — truncated on small screens */}
      <p className="flex-1 text-center text-[11px] font-mono text-[#666] truncate px-2">
        <span className="hidden sm:inline">{label} — </span>
        <span>vaibhav.portfolio</span>
        <span className="hidden lg:inline"> — Visual Studio Code</span>
      </p>

      {/* Mobile: file picker button */}
      <button
        onClick={onMenuOpen}
        className="md:hidden flex items-center gap-1 text-[#858585] hover:text-[#d4d4d4] transition-colors text-[11px] font-mono flex-shrink-0 px-1"
        title="Open file"
      >
        <span>⌕</span>
      </button>

      {/* Right spacer (desktop only) */}
      <div className="hidden md:block w-20 flex-shrink-0" />
    </div>
  );
}

/* ─── MenuBar ───────────────────────────────────────────────────────────── */

function MenuBar() {
  return (
    <div
      className="hidden md:flex items-center h-7 px-3 gap-0.5 select-none flex-shrink-0"
      style={{ background: "#010409", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"].map((item) => (
        <button
          key={item}
          className="px-2.5 h-full text-[11px] font-mono text-[#cccccc] hover:bg-white/10 transition-colors rounded-sm"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

/* ─── ActivityBar ───────────────────────────────────────────────────────── */

const ACTIVITY = [
  { id: "explorer", glyph: "⬚", label: "Explorer (Ctrl+Shift+E)" },
  { id: "search",   glyph: "⌕", label: "Search (Ctrl+Shift+F)" },
  { id: "git",      glyph: "⎇", label: "Source Control" },
  { id: "debug",    glyph: "▷", label: "Run and Debug" },
  { id: "ext",      glyph: "⊞", label: "Extensions" },
];

function ActivityBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="hidden md:flex flex-col items-center w-12 py-2 flex-shrink-0"
      style={{ background: "#010409", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <LayoutGroup id="activity">
        <div className="flex flex-col gap-0.5 flex-1">
          {ACTIVITY.map(({ id, glyph, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => onSelect(id)}
              className={`relative w-10 h-10 flex items-center justify-center text-base font-mono transition-colors ${
                active === id ? "text-white" : "text-[#858585] hover:text-white"
              }`}
            >
              {active === id && (
                <motion.div
                  layoutId="act-bar"
                  className="absolute left-0 inset-y-2 w-[2px] bg-white rounded-r"
                  transition={{ duration: 0.2 }}
                />
              )}
              {glyph}
            </button>
          ))}
        </div>
      </LayoutGroup>
      <button
        title="Settings"
        className="w-10 h-10 flex items-center justify-center text-base text-[#858585] hover:text-white transition-colors"
      >
        ⚙
      </button>
    </div>
  );
}

/* ─── Sidebar / File Tree ───────────────────────────────────────────────── */

function Sidebar({
  activeId,
  openTabs,
  onOpen,
}: {
  activeId: FileId;
  openTabs: FileId[];
  onOpen: (id: FileId) => void;
}) {
  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ background: "#0d1117", borderRight: "1px solid #1e293b" }}
    >
      <p className="px-4 py-2 text-[10px] font-mono text-[#bbbbbb] tracking-[0.12em] uppercase flex-shrink-0">
        Explorer
      </p>
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
        {/* Root folder */}
        <div className="flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-mono text-[#bbbbbb] select-none">
          <span className="text-[9px]">▼</span>
          <span className="font-semibold tracking-wide uppercase text-[10px]">
            VAIBHAV-PORTFOLIO
          </span>
        </div>

        {/* src/ */}
        <div className="ml-2">
          <div className="flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-mono text-[#858585] select-none">
            <span className="text-[9px]">▼</span>
            <span>src</span>
          </div>

          <div className="ml-3">
            {FILES.map((file, i) => {
              const isActive = activeId === file.id;
              const isOpen = openTabs.includes(file.id);
              return (
                <motion.button
                  key={file.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  onClick={() => onOpen(file.id as FileId)}
                  className={`w-full flex items-center gap-2 px-3 py-[3px] text-[12px] font-mono rounded-sm text-left transition-colors ${
                    isActive
                      ? "bg-[rgba(255,255,255,0.1)] text-[#d4d4d4]"
                      : "text-[#858585] hover:text-[#d4d4d4] hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <span
                    style={{ color: file.col }}
                    className="text-[9px] font-bold w-4 text-center flex-shrink-0"
                  >
                    {file.icon === "ts" ? "TS" : file.icon}
                  </span>
                  <span className="truncate">{file.label}</span>
                  {isOpen && !isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#858585] opacity-50 flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TabBar ────────────────────────────────────────────────────────────── */

function TabBar({
  tabs,
  activeId,
  onActivate,
  onClose,
}: {
  tabs: FileId[];
  activeId: FileId;
  onActivate: (id: FileId) => void;
  onClose: (id: FileId) => void;
}) {
  return (
    <div
      className="flex h-9 overflow-x-auto flex-shrink-0 scrollbar-none"
      style={{ background: "#010409", borderBottom: "1px solid #1e293b" }}
    >
      <AnimatePresence initial={false}>
        {tabs.map((id) => {
          const file = FILE_MAP[id];
          const isActive = id === activeId;
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0, overflow: "hidden" }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`flex items-center gap-1.5 px-3 min-w-0 max-w-[180px] flex-shrink-0 cursor-pointer group border-r font-mono text-[12px] select-none transition-colors ${
                isActive ? "text-[#d4d4d4]" : "text-[#858585] hover:text-[#cccccc]"
              }`}
              style={{
                background: isActive ? "#0d1117" : "transparent",
                borderColor: "#1e293b",
                borderTop: isActive ? "1px solid #00ff88" : "1px solid transparent",
              }}
              onClick={() => onActivate(id)}
            >
              <span
                style={{ color: file.col }}
                className="text-[9px] font-bold flex-shrink-0 leading-none"
              >
                {file.icon === "ts" ? "TS" : file.icon}
              </span>
              <span className="truncate text-[11px]">{file.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(id);
                }}
                className={`flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-sm text-[9px] hover:bg-white/10 transition-all ${
                  isActive
                    ? "text-[#858585] hover:text-[#d4d4d4]"
                    : "text-transparent group-hover:text-[#858585]"
                }`}
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── Breadcrumb ────────────────────────────────────────────────────────── */

function Breadcrumb({ activeId }: { activeId: FileId }) {
  const file = FILE_MAP[activeId];
  return (
    <div
      className="hidden md:flex h-7 items-center px-4 gap-1 text-[11px] font-mono flex-shrink-0"
      style={{ background: "#0d1117", borderBottom: "1px solid #1e293b" }}
    >
      <span className="text-[#858585] hover:text-[#d4d4d4] cursor-pointer transition-colors">
        vaibhav-portfolio
      </span>
      <span className="text-[#444]">›</span>
      <span className="text-[#858585] hover:text-[#d4d4d4] cursor-pointer transition-colors">
        src
      </span>
      <span className="text-[#444]">›</span>
      <span style={{ color: file.col }} className="font-medium">
        {file.label}
      </span>
    </div>
  );
}

/* ─── Minimap ───────────────────────────────────────────────────────────── */

function Minimap({ activeId }: { activeId: FileId }) {
  const COLORS = ["#00ff88", "#00d4ff", "#3178C6", "#ffd32a", "#9d4edd", "#858585", "#ff4757"];
  const lines = useMemo(
    () =>
      Array.from({ length: 150 }, () => ({
        w: Math.random() * 65 + 10,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        ml: Math.floor(Math.random() * 5) * 5,
        o: Math.random() * 0.35 + 0.1,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeId]
  );

  return (
    <div
      className="hidden xl:block w-[72px] flex-shrink-0 overflow-hidden py-2 px-2"
      style={{ background: "#0a0d14", borderLeft: "1px solid #1e293b" }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="h-[2px] mb-[1.5px] rounded-full"
          style={{
            width: `${line.w}%`,
            background: line.c,
            opacity: line.o,
            marginLeft: line.ml,
          }}
        />
      ))}
    </div>
  );
}

/* ─── StatusBar ─────────────────────────────────────────────────────────── */

function StatusBar({ activeId }: { activeId: FileId }) {
  const file = FILE_MAP[activeId];
  const [time, setTime] = useState(
    () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        ),
      10000
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/visitors")
      .then((r) => r.json())
      .then((d) => { if (d.count) setVisitors(d.count); })
      .catch(() => {});
  }, []);

  return (
    <div
      className="flex items-center h-6 text-[10px] font-mono flex-shrink-0 select-none"
      style={{ background: "#010409", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Left */}
      <div className="flex items-center h-full">
        <span className="flex items-center gap-1.5 px-3 h-full bg-[#00ff88] text-[#010409] font-bold text-[10px] flex-shrink-0">
          ⎇ main
        </span>
        <span className="px-2.5 h-full flex items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors">
          ✓ 0
        </span>
        <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden sm:flex">
          △ 0
        </span>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center h-full">
        <span className="px-3 h-full flex items-center gap-1.5 hover:bg-white/5 cursor-pointer transition-colors">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff88] flex-shrink-0"
            style={{ boxShadow: "0 0 5px #00ff88", animation: "pulse 2s ease-in-out infinite" }}
          />
          <span className="text-[#00ff88]">Available for hire</span>
        </span>
        {visitors !== null && (
          <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden sm:flex gap-1">
            <span>👥</span>
            <span>{visitors.toLocaleString()} views</span>
          </span>
        )}
        <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden sm:flex">
          {time}
        </span>
        <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden md:flex">
          Ln 1, Col 1
        </span>
        <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden lg:flex">
          UTF-8
        </span>
        <span className="px-2.5 h-full flex items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors">
          {file.lang}
        </span>
        <span className="px-2.5 h-full items-center text-[#858585] hover:bg-white/5 cursor-pointer transition-colors hidden sm:flex">
          ⚡ Port: 3000
        </span>
      </div>
    </div>
  );
}

/* ─── Command Palette ───────────────────────────────────────────────────── */

function CommandPalette({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: (id: FileId) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const filtered = FILES.filter(
    (f) =>
      f.label.toLowerCase().includes(query.toLowerCase()) ||
      f.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg shadow-2xl overflow-hidden"
            style={{ background: "#1e1e1e", border: "1px solid #3c3c3c", borderRadius: 4 }}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-4 border-b"
              style={{ borderColor: "#3c3c3c" }}
            >
              <span className="text-[#858585] text-sm flex-shrink-0">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Go to file..."
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "Enter" && filtered.length > 0) {
                    onOpen(filtered[0].id as FileId);
                    onClose();
                  }
                }}
                className="flex-1 py-3 bg-transparent text-[#d4d4d4] text-[13px] font-mono focus:outline-none placeholder:text-[#555]"
              />
              <kbd className="hidden sm:flex items-center px-1.5 py-0.5 text-[9px] font-mono text-[#555] border border-[#3c3c3c] rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto py-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="px-4 py-4 text-[12px] font-mono text-[#555] text-center">
                  No matching files
                </p>
              ) : (
                filtered.map((file, i) => (
                  <motion.button
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => {
                      onOpen(file.id as FileId);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-mono hover:bg-[rgba(255,255,255,0.07)] transition-colors text-left"
                  >
                    <span
                      style={{ color: file.col }}
                      className="text-[9px] font-bold w-4 text-center flex-shrink-0"
                    >
                      {file.icon === "ts" ? "TS" : file.icon}
                    </span>
                    <span className="text-[#d4d4d4]">{file.label}</span>
                    <span className="ml-auto text-[#555] text-[10px]">src/</span>
                  </motion.button>
                ))
              )}
            </div>

            <div
              className="flex items-center gap-4 px-4 py-2 border-t text-[10px] font-mono text-[#555]"
              style={{ borderColor: "#3c3c3c" }}
            >
              <span>↵ open</span>
              <span>↑↓ navigate</span>
              <span>esc close</span>
              <span className="ml-auto">Ctrl+P</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Welcome Screen ────────────────────────────────────────────────────── */

function WelcomeScreen({ onOpen }: { onOpen: (id: FileId) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="text-5xl font-mono text-green-glow glow-green mb-5"
      >
        {"</>"}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold font-mono text-[var(--text)] mb-2"
      >
        vaibhav.portfolio
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--muted)] font-mono text-sm mb-10"
      >
        Open a file from the sidebar, or press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[10px]">
          Ctrl+P
        </kbd>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-xl"
      >
        {FILES.map((f, i) => (
          <motion.button
            key={f.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.04 }}
            onClick={() => onOpen(f.id as FileId)}
            className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-[#858585] hover:text-[#d4d4d4] hover:bg-white/5 rounded-sm transition-colors text-left border border-transparent hover:border-[rgba(255,255,255,0.08)]"
          >
            <span style={{ color: f.col }} className="flex-shrink-0 font-bold text-[10px]">
              {f.icon === "ts" ? "TS" : f.icon}
            </span>
            <span className="truncate">{f.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Mobile Navigation Bar ─────────────────────────────────────────────── */

function MobileNav({
  activeId,
  onNavigate,
}: {
  activeId: FileId;
  onNavigate: (id: FileId) => void;
}) {
  const idx = FILES.findIndex((f) => f.id === activeId);
  const prev = idx > 0 ? FILES[idx - 1] : null;
  const next = idx < FILES.length - 1 ? FILES[idx + 1] : null;
  const file = FILE_MAP[activeId];

  return (
    <div
      className="md:hidden flex items-center justify-between px-4 py-2.5 flex-shrink-0 border-t"
      style={{ background: "#0a0d14", borderColor: "#1e293b" }}
    >
      {/* Prev */}
      <button
        onClick={() => prev && onNavigate(prev.id as FileId)}
        disabled={!prev}
        className="flex items-center gap-1.5 text-[11px] font-mono text-[#858585] hover:text-[#d4d4d4] disabled:opacity-25 transition-colors min-w-[80px]"
      >
        {prev ? (
          <>
            <span className="text-xs">←</span>
            <span
              style={{ color: prev.col }}
              className="text-[9px] font-bold"
            >
              {prev.icon === "ts" ? "TS" : prev.icon}
            </span>
            <span className="truncate max-w-[60px]">{prev.label}</span>
          </>
        ) : (
          <span className="opacity-0">·</span>
        )}
      </button>

      {/* Current file */}
      <div className="flex items-center gap-2 text-[11px] font-mono">
        <span style={{ color: file.col }} className="text-[10px] font-bold flex-shrink-0">
          {file.icon === "ts" ? "TS" : file.icon}
        </span>
        <span className="text-[#d4d4d4] font-medium">{file.label}</span>
        <span className="text-[#444] text-[9px]">
          {idx + 1}/{FILES.length}
        </span>
      </div>

      {/* Next */}
      <button
        onClick={() => next && onNavigate(next.id as FileId)}
        disabled={!next}
        className="flex items-center gap-1.5 text-[11px] font-mono text-[#858585] hover:text-[#d4d4d4] disabled:opacity-25 transition-colors justify-end min-w-[80px]"
      >
        {next ? (
          <>
            <span className="truncate max-w-[60px]">{next.label}</span>
            <span
              style={{ color: next.col }}
              className="text-[9px] font-bold"
            >
              {next.icon === "ts" ? "TS" : next.icon}
            </span>
            <span className="text-xs">→</span>
          </>
        ) : (
          <span className="opacity-0">·</span>
        )}
      </button>
    </div>
  );
}

/* ─── Hiring Manager Overlay ─────────────────────────────────────────────── */

function HiringManagerOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(1,4,9,0.92)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-lg overflow-hidden font-mono"
        style={{ background: "#0d1117", border: "1px solid rgba(0,255,136,0.25)", boxShadow: "0 0 60px rgba(0,255,136,0.1)" }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(0,255,136,0.15)", background: "#010409" }}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded border font-bold text-[#00ff88] border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.08)]">HIRING MANAGER MODE</span>
            <span className="text-[#444] text-[10px]">— TL;DR view</span>
          </div>
          <button onClick={onClose} className="text-[#444] hover:text-[#858585] text-xs transition-colors">
            ESC / H to close
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5">
          {/* Left: identity */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2" style={{ borderColor: "rgba(0,255,136,0.3)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profile_pic.png" alt="Vaibhav Shelke" className="w-full h-full object-cover" style={{ objectPosition: "center 30%", transform: "scale(1.35)", transformOrigin: "center 35%" }} />
            </div>
            <div>
              <p className="text-[var(--text)] font-bold text-base">Vaibhav Shelke</p>
              <p className="text-[#00d4ff] text-xs mt-0.5">Full Stack Developer</p>
              <p className="text-[#444] text-[10px] mt-0.5">B.Tech CSE · 2025</p>
            </div>
            <div className="space-y-1.5 text-[10px] w-full">
              {[
                { icon: "📧", val: "shelkevaibhav218@gmail.com" },
                { icon: "📍", val: "India · Open to Remote" },
                { icon: "⚡", val: "1yr Production Experience" },
              ].map(({ icon, val }) => (
                <div key={val} className="flex items-center gap-2 text-[#858585]">
                  <span>{icon}</span><span>{val}</span>
                </div>
              ))}
            </div>
            <a
              href="/Vaibhav_Shelke_Resume_April.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 text-xs rounded border font-bold text-[#00ff88] border-[rgba(0,255,136,0.4)] hover:bg-[rgba(0,255,136,0.08)] transition-all"
            >
              ↓ Download Resume
            </a>
          </div>

          {/* Right: summary */}
          <div className="space-y-4 text-xs">
            <div>
              <p className="text-[#444] mb-2">// experience</p>
              <div className="space-y-1.5">
                {[
                  { role: "Full Stack Dev Intern", co: "Konax Technology", when: "Apr 2025 → Now", color: "#00ff88" },
                  { role: "React Dev Intern", co: "Konax Technology", when: "Oct 2024 → Mar 2025", color: "#00d4ff" },
                ].map((e) => (
                  <div key={e.role} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: e.color }} />
                    <div>
                      <span className="text-[var(--text)]">{e.role}</span>
                      <span className="text-[#444] mx-1">·</span>
                      <span className="text-[#858585]">{e.co}</span>
                      <span className="text-[#333] ml-2">{e.when}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#444] mb-2">// top_skills</p>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "React", "Node.js", "TypeScript", "MongoDB", "Redis", "PostgreSQL", "Express.js"].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[10px] text-[#858585] border" style={{ borderColor: "#1e293b", background: "#111827" }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#444] mb-2">// highlights</p>
              <div className="space-y-1">
                {[
                  "50K+ daily API requests in production · 99.9% uptime",
                  "1st Runner-Up — NewGenAI Hackathon 2024 (100+ teams)",
                  "B.Tech First Class, CGPA 7.24 · Dr. BATU 2025",
                  "200+ LeetCode problems · 100-day consistency badge",
                ].map((h) => (
                  <div key={h} className="flex gap-2 text-[#858585]">
                    <span className="text-[#00ff88] flex-shrink-0">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a href="https://github.com/Vaibhav-shelke1" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-1.5 text-[10px] rounded border text-[#858585] border-[#1e293b] hover:text-[#d4d4d4] hover:border-[rgba(255,255,255,0.15)] transition-all">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-1.5 text-[10px] rounded border text-[#858585] border-[#1e293b] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.3)] transition-all">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main IDELayout ────────────────────────────────────────────────────── */

export default function IDELayout() {
  const [activeId, setActiveId] = useState<FileId>("about");
  const [openTabs, setOpenTabs] = useState<FileId[]>(ALL_IDS);
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hiringMode, setHiringMode] = useState(false);

  const openFile = useCallback((id: FileId) => {
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveId(id);
  }, []);

  const closeTab = useCallback(
    (id: FileId) => {
      setOpenTabs((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((t) => t !== id);
        if (id === activeId) {
          const idx = prev.indexOf(id);
          setActiveId(next[Math.max(0, idx - 1)]);
        }
        return next;
      });
    },
    [activeId]
  );

  const navigate = useCallback(
    (id: string) => {
      openFile(id as FileId);
    },
    [openFile]
  );

  const handleActivitySelect = useCallback(
    (actId: string) => {
      if (actId === activeActivity && actId === "explorer") {
        setSidebarVisible((v) => !v);
      } else {
        setActiveActivity(actId);
        setSidebarVisible(true);
      }
    },
    [activeActivity]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarVisible((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setHiringMode(false);
      }
      if (e.key === "h" || e.key === "H") {
        setHiringMode((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const ActiveSection = SECTION_MAP[activeId];
  const hasOpenTabs = openTabs.length > 0;

  return (
    <NavigationContext.Provider value={navigate}>
      <div className="w-screen h-screen flex flex-col overflow-hidden font-mono">
        {/* Window Chrome */}
        <TitleBar label={FILE_MAP[activeId].label} onMenuOpen={() => setCmdOpen(true)} />
        <MenuBar />

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Activity Bar */}
          <ActivityBar active={activeActivity} onSelect={handleActivitySelect} />

          {/* Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarVisible && activeActivity === "explorer" && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden flex-shrink-0 hidden md:block"
              >
                <Sidebar activeId={activeId} openTabs={openTabs} onOpen={openFile} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Column */}
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            {/* Tab Bar */}
            <TabBar
              tabs={openTabs}
              activeId={activeId}
              onActivate={openFile}
              onClose={closeTab}
            />

            {/* Breadcrumb */}
            {hasOpenTabs && <Breadcrumb activeId={activeId} />}

            {/* Content + Minimap */}
            <div
              className="flex flex-1 overflow-hidden"
              style={{ background: "#0d1117" }}
            >
              {/* Content */}
              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!hasOpenTabs ? (
                    <motion.div
                      key="welcome"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <WelcomeScreen onOpen={openFile} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute inset-0 overflow-y-auto scrollbar-thin"
                    >
                      <ActiveSection onNavigate={navigate} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Minimap */}
              <Minimap activeId={activeId} />
            </div>
          </div>
        </div>

        {/* Mobile prev/next navigation */}
        <MobileNav activeId={activeId} onNavigate={openFile} />

        {/* Status Bar */}
        <StatusBar activeId={activeId} />
      </div>

      {/* Floating Terminal */}
      <Terminal />

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onOpen={openFile} />

      {/* Hiring Manager Mode overlay */}
      <AnimatePresence>
        {hiringMode && <HiringManagerOverlay onClose={() => setHiringMode(false)} />}
      </AnimatePresence>

      {/* Cursor trail */}
      <CursorTrail />
    </NavigationContext.Provider>
  );
}

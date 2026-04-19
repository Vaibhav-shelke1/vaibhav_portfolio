"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Line { type: "input" | "output" | "error" | "system"; text: string; }

const HELP_TEXT = `
Available commands:
  whoami            — About Vaibhav
  skills            — List technical skills
  experience        — Work experience
  projects          — View projects
  contact           — Get contact info
  ping              — Test connection
  resume            — Download resume PDF
  sudo hire vaibhav — Submit hire request
  git log           — Recent activity
  clear             — Clear terminal
  exit              — Close terminal
`.trim();

const COMMANDS: Record<string, string | (() => string)> = {
  whoami: `Vaibhav Shelke — Full Stack Developer
B.Tech CSE @ MIT Chh. Sambhajinagar (2025)
Stack: React · Next.js · Node.js · TypeScript · MongoDB · Redis
Status: Available for hire`,

  skills: `Frontend:  TypeScript · React.js · Next.js · Tailwind CSS · Shadcn/ui
Backend:   Node.js · Express.js · REST APIs · JWT Auth · Flask
Databases: MongoDB · PostgreSQL · MySQL · Redis
DevOps:    Docker · AWS · Vercel · Git`,

  experience: `[APR 2025 → NOW]  Full Stack Dev Intern @ Konax Technology
                  50K+ daily API requests · 99.9% uptime · −40% query time
[OCT 2024 → MAR]  React Dev Intern @ Konax Technology
                  Next.js · 10K+ MAU · 3+ client projects`,

  projects: `[GET]  /projects/krushimitra     — Agricultural Support Platform
[POST] /projects/taskmanager     — Project Management + Kanban
→ Send requests via the Projects section of this portfolio`,

  contact: `Email:    shelkevaibhav218@gmail.com
Phone:    +91-8010161242
LinkedIn: linkedin.com/in/vaibhav-shelke-264ba22b7
GitHub:   github.com/Vaibhav-shelke1`,

  ping: () => `PONG! Response time: ${Math.floor(Math.random() * 3) + 1}ms — Connection healthy`,

  "sudo hire vaibhav": `[sudo] password: ••••••••
Verifying credentials...
✓ Authorization granted.
✓ Hire request submitted.
→ Email: shelkevaibhav218@gmail.com`,

  "git log": `* a7f3c21 feat: optimized Redis caching — 35% faster API
* b8d1e09 fix: resolved N+1 query in MongoDB aggregation
* c3a9f44 feat: built role-based dashboard for 200+ agents
* d5b2k11 feat: JWT auth middleware with refresh tokens
* e1c7m88 init: portfolio v2.0 — deployed 🚀`,

  resume: () => {
    setTimeout(() => window.open("/Vaibhav_Shelke_Resume_April.pdf", "_blank"), 600);
    return `Cloning vaibhav/resume.git...
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
Receiving objects: 100% ━━━━━━━━━━━━━━━━ 142 KB
✓ Vaibhav_Shelke_Resume_April.pdf
→ Opening in new tab...`;
  },

  "download resume": () => {
    setTimeout(() => window.open("/Vaibhav_Shelke_Resume_April.pdf", "_blank"), 600);
    return `Cloning vaibhav/resume.git...
remote: Enumerating objects: 1, done.
Receiving objects: 100% ━━━━━━━━━━━━━━━━ 142 KB
✓ Vaibhav_Shelke_Resume_April.pdf → Opening in new tab...`;
  },

  help: HELP_TEXT,
};

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "system", text: "Vaibhav Shelke — Portfolio Terminal v2.0" },
    { type: "system", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Konami code easter egg
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          setOpen(true);
          setLines((prev) => [...prev, {
            type: "system",
            text: "🎮 Konami code activated! Welcome, Power User.",
          }]);
          idx = 0;
        }
      } else { idx = 0; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setLines((prev) => [...prev, { type: "input", text: `$ ${raw.trim()}` }]);

    if (cmd === "clear") {
      setLines([{ type: "system", text: 'Terminal cleared. Type "help" for commands.' }]);
      return;
    }
    if (cmd === "exit") {
      setOpen(false);
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      const result = typeof handler === "function" ? handler() : handler;
      result.split("\n").forEach((line) =>
        setLines((prev) => [...prev, { type: "output", text: line }])
      );
    } else {
      setLines((prev) => [
        ...prev,
        { type: "error", text: `command not found: ${cmd} — try "help"` },
      ]);
    }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full bg-[var(--card)] border border-[rgba(0,255,136,0.4)] text-green-glow font-mono text-lg flex items-center justify-center shadow-lg hover:bg-[rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-200"
        title="Open terminal"
        aria-label="Open terminal"
      >
        &gt;_
      </motion.button>

      {/* Terminal drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-[88px] right-6 z-[70] w-[min(520px,calc(100vw-24px))] h-80 bg-[var(--surface)] border border-[rgba(0,255,136,0.25)] rounded-lg shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--card)] flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-3 h-3 rounded-full bg-[rgba(255,77,77,0.8)] hover:bg-[rgba(255,77,77,1)] transition-colors"
              />
              <span className="w-3 h-3 rounded-full bg-[rgba(255,211,42,0.8)]" />
              <span className="w-3 h-3 rounded-full bg-[rgba(0,255,136,0.8)]" />
              <span className="ml-3 text-xs font-mono text-[var(--muted)]">
                terminal — vaibhav@portfolio
              </span>
            </div>

            {/* Output area */}
            <div
              className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5 cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "input"   ? "text-[var(--text)]" :
                    line.type === "error"   ? "text-[rgba(255,77,77,0.9)]" :
                    line.type === "system"  ? "text-cyan-glow" :
                    "text-green-glow"
                  }
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-[var(--border)] flex-shrink-0">
              <span className="text-green-glow font-mono text-xs flex-shrink-0">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent font-mono text-xs text-[var(--text)] focus:outline-none caret-green-glow placeholder:text-[var(--muted)]"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

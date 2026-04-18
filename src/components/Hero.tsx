"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "Node.js API Architect",
  "TypeScript Specialist",
];

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "アイウエオカキクケコabcdef0123456789ABCDEF{}[]<>/|\\".split("");
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      cols = Math.floor(canvas.width / fontSize);
      ctx.fillStyle = "rgba(10,14,26,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,255,136,0.18)";
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (i >= cols) break;
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}

function UptimeCounter() {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const deployed = new Date("2025-06-01T00:00:00Z").getTime();
    const update = () => {
      const diff = Date.now() - deployed;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return <span className="text-green-glow font-mono tabular-nums">{elapsed}</span>;
}

function RoleTyper() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = ROLES[roleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

  return (
    <span className="text-cyan-glow glow-cyan">
      {displayed}
      <span className="inline-block w-0.5 h-6 bg-cyan-glow align-middle ml-0.5 animate-blink" />
    </span>
  );
}

const METRICS = [
  { label: "Daily API Requests", value: "50K+", color: "#00ff88" },
  { label: "System Uptime",      value: "99.9%", color: "#00d4ff" },
  { label: "Query Optimized",    value: "−40%",  color: "#9d4edd" },
  { label: "Monthly Txns",       value: "$100K+", color: "#ffd32a" },
];

export default function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden scan-overlay"
    >
      <MatrixRain />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/40 to-bg pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2 mb-8 text-xs font-mono text-[var(--muted)] flex-wrap"
        >
          <span className="flex items-center gap-2">
            <span className="status-dot" />
            <span className="text-green-glow">SYSTEM ONLINE</span>
          </span>
          <span className="hidden sm:block text-[var(--border)]">|</span>
          <span>
            UPTIME: <UptimeCounter />
          </span>
          <span className="hidden sm:block text-[var(--border)]">|</span>
          <span>BUILD v2.0.25</span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold font-mono tracking-tight mb-2">
            <span className="text-[var(--text)]">VAIBHAV</span>
            <br />
            <span className="text-green-glow glow-green">SHELKE</span>
          </h1>
        </motion.div>

        {/* Role typer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl font-mono mt-3 mb-2 h-9"
        >
          <span className="text-[var(--muted)]">&gt; </span>
          <RoleTyper />
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[var(--muted)] font-mono text-sm max-w-xl mt-4 mb-8 leading-relaxed"
        >
          // B.Tech CSE graduate building production-grade applications.
          <br />
          // Specialized in scalable APIs, real-time systems, and clean UI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 mb-14"
        >
          <a
            href="#projects"
            className="font-mono text-sm px-5 py-2.5 rounded border border-green-glow text-green-glow hover:bg-[rgba(0,255,136,0.1)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            GET /projects
          </a>
          <a
            href="#contact"
            className="font-mono text-sm px-5 py-2.5 rounded border border-[rgba(0,212,255,0.4)] text-cyan-glow hover:bg-[rgba(0,212,255,0.08)] transition-all duration-200"
          >
            POST /contact
          </a>
          <a
            href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm px-5 py-2.5 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-200"
          >
            → LinkedIn
          </a>
        </motion.div>

        {/* Metrics grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded p-4 hover:border-[rgba(0,255,136,0.3)] transition-all duration-300 group"
            >
              <div
                className="text-2xl font-bold font-mono mb-1 transition-all duration-300"
                style={{ color: m.color }}
              >
                {m.value}
              </div>
              <div className="text-[var(--muted)] text-xs font-mono">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Next section button — replaces old scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => onNavigate("skills")}
            className="group flex items-center gap-3 font-mono text-xs text-[var(--muted)] hover:text-green-glow transition-all duration-200"
          >
            <span className="text-[var(--border)] group-hover:text-green-glow transition-colors">$</span>
            <span>cd <span className="text-[var(--text)] group-hover:text-green-glow transition-colors">/skills</span></span>
            <span className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="block w-3 h-px bg-current" />
              <span className="block w-2 h-px bg-current mx-auto" />
              <span className="block w-1 h-px bg-current mx-auto" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

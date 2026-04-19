"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Full Stack Developer",
  "React & Next.js Engineer",
  "Node.js API Architect",
  "TypeScript Specialist",
];

/* ─── Matrix Rain ───────────────────────────────────────────────── */

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
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(() => {
      if (!document.hidden) draw();
    }, 80);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
    />
  );
}

/* ─── Uptime Counter ────────────────────────────────────────────── */

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

/* ─── Role Typer ────────────────────────────────────────────────── */

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
      <span className="inline-block w-0.5 h-5 bg-cyan-glow align-middle ml-0.5 animate-blink" />
    </span>
  );
}

/* ─── Profile Avatar ────────────────────────────────────────────── */

function ProfileAvatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.5, type: "spring", stiffness: 160 }}
      className="flex flex-col items-center"
    >
      {/* Avatar ring */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #00ff88 0%, #00d4ff 33%, #9d4edd 66%, #00ff88 100%)",
            padding: 2,
            borderRadius: "50%",
            animation: "spin 6s linear infinite",
          }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "#0a0e1a" }} />
        </div>

        {/* Inner avatar */}
        <div
          className="absolute inset-[3px] rounded-full overflow-hidden"
          style={{ border: "1px solid rgba(0,255,136,0.15)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile_pic.png"
            alt="Vaibhav Shelke"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 80%",
              transform: "scale(1.5)",
              transformOrigin: "center 35%",
            }}
          />
          {/* Scan lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)",
            }}
          />
        </div>

        {/* Online dot — positioned on circle edge at ~135° (bottom-right) */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 bg-[#00ff88]"
          style={{
            borderColor: "#0a0e1a",
            boxShadow: "0 0 8px #00ff88",
            animation: "pulse 2s ease-in-out infinite",
            bottom: "11%",
            right: "7%",
          }}
        />
      </div>

      {/* Info card */}
      <div
        className="mt-4 w-full rounded-lg p-4 font-mono text-xs"
        style={{
          background: "#111827",
          border: "1px solid #1e293b",
        }}
      >
        <p className="text-[#e2e8f0] font-semibold text-sm text-center mb-3">Vaibhav Shelke</p>
        <div className="space-y-2">
          {[
            { key: "role",     val: "Full Stack Dev",  color: "#00d4ff" },
            { key: "status",   val: "● Available",     color: "#00ff88" },
            { key: "location", val: "India",           color: "#e2e8f0" },
            { key: "exp",      val: "1yr production",  color: "#9d4edd" },
          ].map(({ key, val, color }) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-[#64748b]">{key}:</span>
              <span style={{ color }} className="font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="flex gap-2 mt-3 w-full">
        <a
          href="https://github.com/Vaibhav-shelke1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 text-center text-[10px] font-mono rounded border transition-all duration-200 text-[#64748b] border-[#1e293b] hover:text-[#e2e8f0] hover:border-[rgba(255,255,255,0.15)]"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 text-center text-[10px] font-mono rounded border transition-all duration-200 text-[#64748b] border-[#1e293b] hover:text-cyan-glow hover:border-[rgba(0,212,255,0.3)]"
        >
          LinkedIn
        </a>
        <a
          href="/blog"
          className="flex-1 py-1.5 text-center text-[10px] font-mono rounded border transition-all duration-200 text-[#00ff88] border-[rgba(0,255,136,0.25)] hover:bg-[rgba(0,255,136,0.08)] hover:border-[rgba(0,255,136,0.5)]"
          style={{ boxShadow: "0 0 12px rgba(0,255,136,0.06)" }}
        >
          &gt;_ Blog
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Metrics ───────────────────────────────────────────────────── */

const METRICS = [
  { label: "DSA Problems Solved", value: "200+", color: "#00ff88" },
  { label: "Projects Shipped",    value: "4+",   color: "#00d4ff" },
  { label: "Internships Done",    value: "2",    color: "#9d4edd" },
  { label: "Technologies Used",   value: "10+",  color: "#ffd32a" },
];

/* ─── Hero ──────────────────────────────────────────────────────── */

export default function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section
      id="about"
      className="relative overflow-hidden scan-overlay"
    >
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/40 to-bg pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-10">

        {/* File header comment */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 font-mono text-[11px] text-[var(--muted)] mb-6 border-b border-[var(--border)] pb-3"
        >
          <span className="text-cyan-glow">⚛</span>
          <span>about.tsx</span>
          <span className="text-[var(--border)] hidden sm:block">·</span>
          <span className="text-[var(--border)] hidden sm:block">
            <span className="text-[var(--muted)]">export const </span>
            <span className="text-cyan-glow">profile</span>
            <span className="text-[var(--muted)]"> = {"{"} Vaibhav Shelke {"}"}</span>
          </span>
        </motion.div>

        {/* Main grid: left content + right avatar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 xl:gap-14 items-start">

          {/* ── Left column ── */}
          <div>
            {/* Status bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 mb-6 text-xs font-mono text-[var(--muted)] flex-wrap"
            >
              <span className="flex items-center gap-2">
                <span className="status-dot" />
                <span className="text-green-glow">SYSTEM ONLINE</span>
              </span>
              <span className="text-[var(--border)]">|</span>
              <span>UPTIME: <UptimeCounter /></span>
              <span className="text-[var(--border)] hidden sm:block">|</span>
              <span className="hidden sm:block">BUILD v2.0.25</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-2 leading-none"
            >
              <span className="text-[var(--text)]">VAIBHAV</span>
              <br />
              <span className="text-green-glow glow-green">SHELKE</span>
            </motion.h1>

            {/* Role typer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-2xl font-mono mt-4 mb-2 h-8"
            >
              <span className="text-[var(--muted)]">&gt; </span>
              <RoleTyper />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[var(--muted)] font-mono text-sm mt-4 mb-7 leading-relaxed space-y-1 max-w-lg"
            >
              <p><span className="text-[var(--border)]">//</span> B.Tech CSE &apos;25 — MIT Chh. Sambhajinagar</p>
              <p><span className="text-[var(--border)]">//</span> Building scalable web applications</p>
              <p><span className="text-[var(--border)]">//</span> Open to full-time roles &amp; exciting collaborations</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-3"
            >
              <button
                onClick={() => onNavigate("projects")}
                className="font-mono text-sm px-5 py-2.5 rounded border border-green-glow text-green-glow hover:bg-[rgba(0,255,136,0.1)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] text-center"
              >
                GET /projects
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="font-mono text-sm px-5 py-2.5 rounded border border-[rgba(0,212,255,0.4)] text-cyan-glow hover:bg-[rgba(0,212,255,0.08)] transition-all duration-200 text-center"
              >
                POST /contact
              </button>
              <button
                onClick={() => onNavigate("experience")}
                className="font-mono text-sm px-5 py-2.5 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-200 text-center"
              >
                GET /experience
              </button>
            </motion.div>

            {/* Tech stack hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-1.5 mt-4"
            >
              {["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "Redis", "Docker"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded font-mono text-[var(--muted)] border border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(0,255,136,0.3)] hover:text-[var(--text)] transition-all duration-200 cursor-default"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: Profile Avatar (desktop) ── */}
          <div className="hidden lg:block">
            <ProfileAvatar />
          </div>
        </div>

        {/* Mobile Avatar (below main content on small screens) */}
        <div className="lg:hidden flex justify-center mt-8">
          <div className="w-full max-w-xs">
            <ProfileAvatar />
          </div>
        </div>

        {/* Metrics grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 + i * 0.08 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:border-[rgba(0,255,136,0.3)] transition-all duration-300 group cursor-default"
            >
              <div
                className="text-xl sm:text-2xl font-bold font-mono mb-1 transition-all duration-300 group-hover:scale-105"
                style={{ color: m.color }}
              >
                {m.value}
              </div>
              <div className="text-[var(--muted)] text-[10px] sm:text-xs font-mono leading-tight">
                {m.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigate to skills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex justify-center mt-10"
        >
          <button
            onClick={() => onNavigate("skills")}
            className="group flex items-center gap-3 font-mono text-xs text-[var(--muted)] hover:text-green-glow transition-all duration-200 py-2 px-4 rounded border border-transparent hover:border-[rgba(0,255,136,0.2)] hover:bg-[rgba(0,255,136,0.04)]"
          >
            <span className="text-[var(--border)] group-hover:text-green-glow transition-colors">$</span>
            <span>
              cd{" "}
              <span className="text-[var(--text)] group-hover:text-green-glow transition-colors">
                /skills
              </span>
            </span>
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

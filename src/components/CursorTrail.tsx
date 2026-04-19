"use client";

import { useEffect, useRef } from "react";

const SNIPPETS = [
  "const", "=>", "async", "await", "{}",
  "null", "true", ".map()", ".then()",
  "useState", "useEffect", "fetch()",
  "redis.get()", "JWT", "50K+", "O(log n)",
  "import", "export", "return", "[]",
];

interface Particle {
  x: number; y: number;
  text: string;
  opacity: number;
  vy: number; vx: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (dx * dx + dy * dy < 900) return; // emit every ~30px
      lastPos.current = { x: e.clientX, y: e.clientY };
      particles.current.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        opacity: 0.65,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.6 - Math.random() * 0.5,
      });
      if (particles.current.length > 40) particles.current.shift();
      // Restart RAF loop if it stopped
      if (rafRef.current === 0) rafRef.current = requestAnimationFrame(draw);
    };

    const draw = () => {
      if (particles.current.length === 0) {
        rafRef.current = 0;
        return; // pause loop when nothing to draw
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.opacity > 0.02);
      for (const p of particles.current) {
        ctx.globalAlpha = p.opacity;
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillStyle = "#00ff88";
        ctx.fillText(p.text, p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= 0.94;
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    // Only start RAF loop when mouse moves and adds a particle

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-40"
    />
  );
}

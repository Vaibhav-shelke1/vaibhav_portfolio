"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import NextSection from "./NextSection";

const ACHIEVEMENTS = [
  {
    id: "ACH-001",
    severity: "TROPHY",
    color: "#ffd32a",
    title: "1st Runner-Up — NewGenAI Hackathon 2024",
    org: "MIT Chhatrapati Sambhajinagar",
    description:
      "Secured 1st Runner-Up among 100+ competing teams. Demonstrated full-stack development and problem-solving expertise under time constraints.",
    resolvedAt: "2024",
    badge: "🏆",
  },
  {
    id: "ACH-002",
    severity: "MILESTONE",
    color: "#00d4ff",
    title: "LeetCode 100-Day Consistency Badge",
    org: "LeetCode Platform",
    description:
      "Earned the 100-day consistency badge. Solved 200+ data structures and algorithm problems with a focus on time complexity optimization and clean code.",
    resolvedAt: "2024",
    badge: "⚡",
  },
  {
    id: "ACH-003",
    severity: "MILESTONE",
    color: "#00ff88",
    title: "B.Tech — First Class",
    org: "Dr. Babasaheb Ambedkar Technological University",
    description:
      "Graduated with First Class in Computer Science & Engineering. Passed the Final Year examination held in Summer 2025.",
    resolvedAt: "2025",
    badge: "🎓",
  },
  {
    id: "ACH-004",
    severity: "PRODUCTION",
    color: "#9d4edd",
    title: "Production API — 50K+ Daily Requests",
    org: "Konax Technology Private Limited",
    description:
      "Engineered RESTful APIs in production handling over 50,000 requests per day with 99.9% uptime. Optimized database query times by 40% via Redis caching and indexing.",
    resolvedAt: "2025",
    badge: "🚀",
  },
];

export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="achievements" ref={ref}>
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_05</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          Resolved{" "}
          <span className="text-green-glow">Alerts</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; All incidents resolved. Systems performing above benchmark.
        </p>
      </motion.div>

      <div className="space-y-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-5 hover:border-[rgba(0,255,136,0.25)] transition-all duration-200 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Left: badge + id */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="text-3xl">{a.badge}</span>
                <span className="text-[9px] font-mono text-[var(--muted)]">{a.id}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded border font-bold"
                    style={{ color: a.color, borderColor: a.color + "44", background: a.color + "11" }}
                  >
                    {a.severity}
                  </span>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded border border-[rgba(0,255,136,0.3)] text-green-glow bg-[rgba(0,255,136,0.06)]"
                  >
                    RESOLVED
                  </span>
                  <span className="text-[var(--muted)] text-xs font-mono ml-auto">{a.resolvedAt}</span>
                </div>
                <h3 className="text-sm font-bold font-mono text-[var(--text)] mb-1 group-hover:text-green-glow transition-colors">
                  {a.title}
                </h3>
                <p className="text-[var(--muted)] text-xs font-mono mb-2">{a.org}</p>
                <p className="text-[var(--muted)] text-xs font-mono leading-relaxed">{a.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <NextSection to="contact" label="contact" />
      </div>
    </section>
  );
}

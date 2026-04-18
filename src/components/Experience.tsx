"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import NextSection from "./NextSection";

const EXPERIENCES = [
  {
    timestamp: "APR 2025 → PRESENT",
    event: "DEPLOYED",
    role: "Full Stack Development Intern",
    company: "Konax Technology Private Limited",
    location: "Hyderabad, India",
    status: "ACTIVE",
    statusColor: "#00ff88",
    commits: [
      "Built RESTful APIs handling 50,000+ daily requests at 99.9% uptime",
      "Optimized MongoDB, PostgreSQL, Redis — 40% query response improvement",
      "Designed Redis caching strategies supporting 15,000+ concurrent users",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "Redis", "PostgreSQL"],
  },
  {
    timestamp: "OCT 2024 → MAR 2025",
    event: "DEPLOYED",
    role: "React Developer Intern",
    company: "Konax Technology Private Limited",
    location: "Hyderabad, India",
    status: "COMPLETED",
    statusColor: "#00d4ff",
    commits: [
      "Shipped production features in Next.js + TypeScript for 3+ client projects",
      "Built responsive UI components — 25% engagement boost, 30% faster loads",
      "Contributed to applications serving 10,000+ monthly active users",
    ],
    stack: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    timestamp: "DEC 2021 → JUN 2025",
    event: "INITIALIZED",
    role: "B.Tech — Computer Science & Engineering",
    company: "Marathwada Institute of Technology",
    location: "Chh Sambhajinagar, India",
    status: "GRADUATED",
    statusColor: "#9d4edd",
    commits: [
      "Graduated with First Class — Dr. Babasaheb Ambedkar Technological University",
      "Built full-stack projects across web development and systems",
      "Runner-up at NewGenAI Hackathon 2024 among 100+ teams",
    ],
    stack: ["Java", "Python", "DSA", "DBMS", "Networks"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref}>
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_03</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          Deployment{" "}
          <span className="text-green-glow">Log</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; git log --all --oneline --graph
        </p>
      </motion.div>

      {/* Log header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-t-lg px-4 py-2 flex items-center gap-2 font-mono text-xs text-[var(--muted)]"
      >
        <span className="text-[rgba(255,77,77,0.8)]">●</span>
        <span className="text-[rgba(255,211,42,0.8)]">●</span>
        <span className="text-[rgba(0,255,136,0.8)]">●</span>
        <span className="ml-2">deployment_log.sh — bash</span>
      </motion.div>

      {/* Timeline entries */}
      <div className="border border-t-0 border-[var(--border)] rounded-b-lg overflow-hidden">
        {EXPERIENCES.map((exp, i) => (
          <motion.div
            key={exp.role}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            className={`p-5 font-mono ${
              i < EXPERIENCES.length - 1 ? "border-b border-[var(--border)]" : ""
            } hover:bg-[var(--card)] transition-colors duration-200 group`}
          >
            {/* Timestamp line */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-[var(--muted)] text-xs">[{exp.timestamp}]</span>
              <span className="text-green-glow text-xs font-bold">{exp.event}</span>
              <span
                className="text-[9px] px-2 py-0.5 rounded border font-bold"
                style={{ color: exp.statusColor, borderColor: exp.statusColor + "44", background: exp.statusColor + "11" }}
              >
                {exp.status}
              </span>
            </div>

            {/* Role and company */}
            <div className="mb-3">
              <h3 className="text-base font-bold text-[var(--text)] group-hover:text-green-glow transition-colors">
                {exp.role}
              </h3>
              <p className="text-[var(--muted)] text-sm">
                {exp.company} · {exp.location}
              </p>
            </div>

            {/* Commit messages */}
            <div className="space-y-1.5 mb-4">
              {exp.commits.map((c, ci) => (
                <div key={ci} className="flex gap-2 text-xs text-[var(--muted)]">
                  <span className="text-green-glow flex-shrink-0">✓</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* Stack tags */}
            <div className="flex flex-wrap gap-1.5">
              {exp.stack.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <NextSection to="github" label="github" />
      </div>
    </section>
  );
}

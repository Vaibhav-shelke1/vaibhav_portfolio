"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import NextSection from "./NextSection";

const EDUCATION = [
  {
    level: "B.Tech",
    badge: "🎓",
    degree: "Computer Science & Engineering",
    institution: "Marathwada Institute of Technology",
    location: "Chh. Sambhajinagar, India",
    duration: "DEC 2021 → JUN 2025",
    score: "7.24",
    scoreLabel: "CGPA",
    outOf: "/ 10.0",
    status: "GRADUATED",
    statusColor: "#00ff88",
    affiliation: "Dr. Babasaheb Ambedkar Technological University",
    color: "#00ff88",
    highlights: [
      "Graduated with First Class — Summer 2025",
      "Specialised in Full Stack Web Development & System Design",
      "1st Runner-Up at NewGenAI Hackathon 2024 among 100+ teams",
      "Completed 2 production internships during final year",
    ],
  },
  {
    level: "HSC — 12th",
    badge: "📘",
    degree: "Higher Secondary Certificate",
    institution: "Jijamata Junior College",
    location: "Chh. Sambhajinagar, India",
    duration: "2019 → 2021",
    score: "91.00",
    scoreLabel: "%",
    outOf: "/ 100",
    status: "COMPLETED",
    statusColor: "#00d4ff",
    affiliation: "Maharashtra State Board (HSC)",
    color: "#00d4ff",
    highlights: [
      "Science stream — Physics, Chemistry, Mathematics",
      "Scored 91% in Maharashtra HSC Board examinations",
    ],
  },
  {
    level: "SSC — 10th",
    badge: "📗",
    degree: "Secondary School Certificate",
    institution: "Holy Faith English School",
    location: "Chh. Sambhajinagar, India",
    duration: "2019",
    score: "87.00",
    scoreLabel: "%",
    outOf: "/ 100",
    status: "COMPLETED",
    statusColor: "#9d4edd",
    affiliation: "Maharashtra State Board (SSC)",
    color: "#9d4edd",
    highlights: [
      "English medium school with strong academic foundation",
      "Scored 87% with distinction in Mathematics & Science",
    ],
  },
];

/* ─── Timeline dots ─────────────────────────────────────────────── */

function TimelineBar() {
  const EVENTS = [
    { year: "2019", label: "SSC",    color: "#9d4edd" },
    { year: "2021", label: "HSC",    color: "#00d4ff" },
    { year: "2025", label: "B.Tech", color: "#00ff88" },
  ];

  return (
    <div className="relative flex items-center gap-0 mb-10 px-4 overflow-x-auto py-4">
      {EVENTS.map((e, i) => (
        <div key={e.year} className="flex items-center flex-1 min-w-[80px]">
          {/* Dot + label */}
          <motion.div
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.2, type: "spring" }}
          >
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{
                background: e.color,
                borderColor: e.color,
                boxShadow: `0 0 10px ${e.color}80`,
              }}
            />
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold" style={{ color: e.color }}>
                {e.label}
              </p>
              <p className="font-mono text-[9px] text-[var(--muted)]">{e.year}</p>
            </div>
          </motion.div>
          {/* Connector line after each dot */}
          <motion.div
            className="flex-1 h-px"
            style={{
              background: i < EVENTS.length - 1
                ? `linear-gradient(90deg, ${e.color}, ${EVENTS[i + 1].color})`
                : `linear-gradient(90deg, ${e.color}, ${e.color}40)`,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
          />
        </div>
      ))}
      {/* "Present" marker */}
      <motion.div
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <span className="status-dot" />
        <p className="font-mono text-[9px] text-green-glow">Now</p>
      </motion.div>
    </div>
  );
}

/* ─── Score Badge ───────────────────────────────────────────────── */

function ScoreBadge({ score, label, outOf, color }: {
  score: string; label: string; outOf: string; color: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 flex-shrink-0"
      style={{
        borderColor: color,
        background: `${color}10`,
        boxShadow: `0 0 16px ${color}25`,
      }}
    >
      <span className="font-mono text-lg font-bold leading-none" style={{ color }}>
        {score}
      </span>
      <span className="font-mono text-[8px] text-[var(--muted)] leading-none mt-0.5">
        {label}
      </span>
      <span className="font-mono text-[8px] leading-none mt-0.5" style={{ color: `${color}80` }}>
        {outOf}
      </span>
    </div>
  );
}

/* ─── Education Card ────────────────────────────────────────────── */

function EduCard({ edu, index, inView }: {
  edu: typeof EDUCATION[number];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
      className="bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[rgba(0,255,136,0.2)] transition-all duration-300 overflow-hidden group"
    >
      {/* Card top bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${edu.color}, transparent)` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            {/* Level + status */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-lg">{edu.badge}</span>
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                style={{
                  color: edu.statusColor,
                  borderColor: `${edu.statusColor}44`,
                  background: `${edu.statusColor}11`,
                }}
              >
                {edu.level}
              </span>
              <span
                className="font-mono text-[9px] px-2 py-0.5 rounded border"
                style={{
                  color: edu.statusColor,
                  borderColor: `${edu.statusColor}33`,
                  background: `${edu.statusColor}08`,
                }}
              >
                {edu.status}
              </span>
            </div>

            {/* Degree + institution */}
            <h3 className="font-mono text-base font-bold text-[var(--text)] mb-0.5 group-hover:text-green-glow transition-colors">
              {edu.degree}
            </h3>
            <p className="font-mono text-sm text-[var(--muted)] mb-0.5">{edu.institution}</p>
            <p className="font-mono text-[11px] text-[var(--border)] mb-3">{edu.affiliation}</p>

            {/* Duration + location */}
            <div className="flex flex-wrap gap-3 mb-4 text-[10px] font-mono text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <span style={{ color: edu.color }}>◷</span>
                {edu.duration}
              </span>
              <span className="flex items-center gap-1">
                <span style={{ color: edu.color }}>◎</span>
                {edu.location}
              </span>
            </div>

            {/* Highlights */}
            <div className="space-y-1.5">
              {edu.highlights.map((h, i) => (
                <div key={i} className="flex gap-2 text-[11px] font-mono text-[var(--muted)]">
                  <span style={{ color: edu.color }} className="flex-shrink-0 mt-0.5">✓</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: score badge */}
          <ScoreBadge
            score={edu.score}
            label={edu.scoreLabel}
            outOf={edu.outOf}
            color={edu.color}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Education ─────────────────────────────────────────────────── */

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="education" ref={ref}>
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-green-glow font-mono text-sm mb-2">// section_04</p>
          <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
            Academic{" "}
            <span className="text-green-glow">Record</span>
          </h2>
          <p className="text-[var(--muted)] font-mono text-sm mt-2">
            &gt; Parsing education.json — 3 entries found
          </p>
        </motion.div>

        {/* Timeline visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-6 mb-6"
        >
          <p className="font-mono text-[10px] text-[var(--muted)] pt-3 pb-1">
            // academic_timeline
          </p>
          <TimelineBar />
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          {EDUCATION.map((edu, i) => (
            <EduCard key={edu.level} edu={edu} index={i} inView={inView} />
          ))}
        </div>

        <NextSection to="github" label="github" />
      </div>
    </section>
  );
}

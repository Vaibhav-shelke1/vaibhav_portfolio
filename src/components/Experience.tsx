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
      "Developed RESTful APIs using Node.js and Express.js to support core application features and business logic",
      "Integrated Redis caching to reduce redundant database calls and improve API response times",
      "Worked with MongoDB and PostgreSQL for data modeling, query optimization, and efficient indexing",
      "Collaborated with the frontend team to ensure smooth API integration and consistent data flow",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Redis", "TypeScript"],
    impact: [
      { label: "Daily Requests", value: "50K+" },
      { label: "Uptime",         value: "99.9%" },
      { label: "Query Speed",    value: "+40%" },
    ],
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
      "Built reusable UI components using React.js and Next.js with TypeScript for 3+ client projects",
      "Designed responsive layouts using Tailwind CSS, improving usability across desktop and mobile devices",
      "Participated in the full development lifecycle from requirements gathering to deployment on Vercel",
      "Coordinated with backend developers to consume REST APIs and implement dynamic data rendering",
    ],
    stack: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Vercel"],
    impact: [
      { label: "Client Projects", value: "3+" },
      { label: "MAU",             value: "10K+" },
      { label: "Load Time",       value: "−30%" },
    ],
  },
  {
    timestamp: "DEC 2021 → JUN 2025",
    event: "INITIALIZED",
    role: "B.Tech — Computer Science & Engineering",
    company: "Marathwada Institute of Technology",
    location: "Chh. Sambhajinagar, India",
    status: "GRADUATED",
    statusColor: "#9d4edd",
    commits: [
      "Graduated with First Class — Dr. Babasaheb Ambedkar Technological University (Summer 2025)",
      "Built full-stack projects across web development, APIs, and database systems",
      "1st Runner-Up at NewGenAI Hackathon 2024 among 100+ competing teams",
      "Solved 200+ DSA problems on LeetCode — earned 50-Day & 100-Day consistency badges",
    ],
    stack: ["Java", "Python", "JavaScript", "DSA", "DBMS", "Computer Networks"],
    impact: [
      { label: "CGPA",     value: "7.24" },
      { label: "LeetCode", value: "200+" },
      { label: "Hackathon",value: "Top 2" },
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref}>
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
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

        {/* Terminal chrome */}
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
          <span className="ml-auto text-[9px] text-[var(--border)]">
            {EXPERIENCES.length} entries
          </span>
        </motion.div>

        {/* Log entries */}
        <div className="border border-t-0 border-[var(--border)] rounded-b-lg overflow-hidden">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.15 }}
              className={`p-5 font-mono ${
                i < EXPERIENCES.length - 1 ? "border-b border-[var(--border)]" : ""
              } hover:bg-[var(--card)] transition-colors duration-200 group`}
            >
              {/* Timestamp + badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[var(--muted)] text-[10px]">[{exp.timestamp}]</span>
                <span className="text-green-glow text-[10px] font-bold">{exp.event}</span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded border font-bold"
                  style={{
                    color: exp.statusColor,
                    borderColor: `${exp.statusColor}44`,
                    background: `${exp.statusColor}11`,
                  }}
                >
                  {exp.status}
                </span>
              </div>

              {/* Role + company */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-[var(--text)] group-hover:text-green-glow transition-colors mb-0.5">
                  {exp.role}
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  {exp.company}
                  <span className="text-[var(--border)] mx-1.5">·</span>
                  {exp.location}
                </p>
              </div>

              {/* Commits */}
              <div className="space-y-1.5 mb-4">
                {exp.commits.map((c, ci) => (
                  <div key={ci} className="flex gap-2 text-xs text-[var(--muted)]">
                    <span className="text-green-glow flex-shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>

              {/* Impact metrics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {exp.impact.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <span className="text-[var(--muted)]">{m.label}:</span>
                    <span
                      className="font-bold"
                      style={{ color: exp.statusColor }}
                    >
                      {m.value}
                    </span>
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

        <NextSection to="education" label="education" />
      </div>
    </section>
  );
}

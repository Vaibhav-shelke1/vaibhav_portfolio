"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiMysql, SiRedis, SiDocker, SiPostman,
  SiVercel, SiGit, SiPython, SiFlask, SiJavascript, SiGithub,
} from "react-icons/si";
import NextSection from "./NextSection";

const TECH_ICONS = [
  { Icon: SiJavascript, label: "JavaScript", color: "#F7DF1E" },
  { Icon: SiTypescript, label: "TypeScript",  color: "#3178C6" },
  { Icon: SiReact,      label: "React",       color: "#61DAFB" },
  { Icon: SiNextdotjs,  label: "Next.js",     color: "#e2e8f0" },
  { Icon: SiTailwindcss,label: "Tailwind",    color: "#38BDF8" },
  { Icon: SiNodedotjs,  label: "Node.js",     color: "#6DB33F" },
  { Icon: SiExpress,    label: "Express",     color: "#e2e8f0" },
  { Icon: SiPython,     label: "Python",      color: "#3776AB" },
  { Icon: SiFlask,      label: "Flask",       color: "#e2e8f0" },
  { Icon: SiMongodb,    label: "MongoDB",     color: "#47A248" },
  { Icon: SiPostgresql, label: "PostgreSQL",  color: "#336791" },
  { Icon: SiMysql,      label: "MySQL",       color: "#4479A1" },
  { Icon: SiRedis,      label: "Redis",       color: "#DC382D" },
  { Icon: SiDocker,     label: "Docker",      color: "#2496ED" },
  { Icon: SiPostman,    label: "Postman",     color: "#FF6C37" },
  { Icon: SiVercel,     label: "Vercel",      color: "#e2e8f0" },
  { Icon: SiGit,        label: "Git",         color: "#F05032" },
  { Icon: SiGithub,     label: "GitHub",      color: "#e2e8f0" },
];

interface Skill { name: string; level: number; }
interface Group { category: string; icon: string; skills: Skill[]; }

const SKILL_GROUPS: Group[] = [
  {
    category: "Frontend",
    icon: "◈",
    skills: [
      { name: "TypeScript",    level: 92 },
      { name: "React.js",      level: 95 },
      { name: "Next.js",       level: 90 },
      { name: "Tailwind CSS",  level: 93 },
      { name: "Shadcn/ui",     level: 85 },
    ],
  },
  {
    category: "Backend",
    icon: "⬡",
    skills: [
      { name: "Node.js",       level: 90 },
      { name: "Express.js",    level: 92 },
      { name: "REST APIs",     level: 95 },
      { name: "JWT Auth",      level: 88 },
      { name: "Flask",         level: 72 },
    ],
  },
  {
    category: "Databases & Cache",
    icon: "◉",
    skills: [
      { name: "MongoDB",       level: 90 },
      { name: "PostgreSQL",    level: 82 },
      { name: "MySQL",         level: 80 },
      { name: "Redis",         level: 85 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: "⬢",
    skills: [
      { name: "Git / GitHub",  level: 92 },
      { name: "Docker",        level: 75 },
      { name: "AWS EC2/S3",    level: 70 },
      { name: "Vercel",        level: 90 },
    ],
  },
  {
    category: "Core CS",
    icon: "◆",
    skills: [
      { name: "DSA",           level: 82 },
      { name: "System Design", level: 75 },
      { name: "OOP",           level: 88 },
      { name: "DBMS",          level: 85 },
    ],
  },
];

function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono text-[var(--text)]">{skill.name}</span>
        <div className="flex items-center gap-2">
          {hovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[rgba(0,255,136,0.4)] text-green-glow bg-[rgba(0,255,136,0.08)]"
            >
              CACHE HIT
            </motion.span>
          )}
          <span className="text-xs font-mono text-[var(--muted)]">{skill.level}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded overflow-hidden">
        <motion.div
          className="h-full rounded"
          style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff)" }}
          initial={{ width: "0%" }}
          animate={animate ? { width: `${skill.level}%` } : { width: "0%" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref}>
      <div className="section-inner">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_02</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          Service Health{" "}
          <span className="text-green-glow">&amp; Skills</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; Running diagnostics on all services...
        </p>
      </motion.div>

      {/* Tech icon strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap gap-3 mb-8 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]"
      >
        {TECH_ICONS.map(({ Icon, label, color }) => (
          <div
            key={label}
            title={label}
            className="group flex flex-col items-center gap-1 cursor-default"
          >
            <Icon
              size={22}
              style={{ color }}
              className="transition-transform duration-200 group-hover:scale-125 group-hover:drop-shadow-[0_0_6px_currentColor]"
            />
            <span className="text-[8px] font-mono text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            className="bg-[var(--card)] rounded-lg p-5 border-glow"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="text-green-glow font-mono">{group.icon}</span>
                <span className="text-sm font-mono font-semibold text-[var(--text)]">
                  {group.category}
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-[rgba(0,255,136,0.3)] text-green-glow bg-[rgba(0,255,136,0.06)]">
                HEALTHY
              </span>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              {group.skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} animate={inView} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-[rgba(0,255,136,0.04)] rounded-lg p-5 border border-[rgba(0,255,136,0.2)] flex flex-col justify-between"
        >
          <div>
            <p className="text-green-glow font-mono text-xs mb-3">// system_summary</p>
            {[
              { label: "Services Running",  value: "23/23" },
              { label: "Avg Health Score",  value: "87%" },
              { label: "Cache Hit Rate",    value: "94%" },
              { label: "Incidents Today",   value: "0" },
            ].map((s) => (
              <div key={s.label} className="flex justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--muted)] text-xs font-mono">{s.label}</span>
                <span className="text-green-glow text-xs font-mono font-bold">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-green-glow font-mono text-xs glow-green">
              ● ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </motion.div>
      </div>

      <NextSection to="experience" label="experience" />
      </div>
    </section>
  );
}

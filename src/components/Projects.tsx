"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import NextSection from "./NextSection";

interface Project {
  method: "GET" | "POST";
  endpoint: string;
  name: string;
  description: string;
  details: string;
  stack: string[];
  metrics?: string[];
  github?: string;
}

const PROJECTS: Project[] = [
  {
    method: "GET",
    endpoint: "/projects/krushimitra",
    name: "KrushiMitra",
    description: "Agricultural Support Platform",
    details:
      "React-based web application supporting farmers with real-time weather updates, commodity price tracking, and an intelligent chatbot for agricultural guidance. Features a clean dashboard for farmers to monitor crop data.",
    stack: ["React.js", "Flask", "Python", "REST API"],
    metrics: ["Real-time weather API", "Commodity price tracker", "Chatbot integration"],
    github: "https://github.com/Vaibhav-shelke1",
  },
  {
    method: "POST",
    endpoint: "/projects/taskmanager",
    name: "TaskManager",
    description: "Project Management Platform",
    details:
      "Full-stack task management platform with a Kanban board interface, JWT-based authentication, and drag-and-drop functionality. Built to streamline project workflows with real-time task updates.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    metrics: ["Kanban board", "Drag & drop", "JWT Auth", "Real-time updates"],
    github: "https://github.com/Vaibhav-shelke1",
  },
];

type RequestState = "idle" | "loading" | "done";

function ProjectCard({ project, index, inView }: { project: Project; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);
  const [reqState, setReqState] = useState<RequestState>("idle");

  const handleRequest = () => {
    if (reqState === "loading") return;
    if (open) { setOpen(false); setReqState("idle"); return; }
    setReqState("loading");
    setTimeout(() => {
      setReqState("done");
      setOpen(true);
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-[var(--card)] rounded-lg overflow-hidden border-glow"
    >
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--muted)]">
        <span className="text-[rgba(255,77,77,0.8)]">●</span>
        <span className="text-[rgba(255,211,42,0.8)]">●</span>
        <span className="text-[rgba(0,255,136,0.8)]">●</span>
        <span className="ml-2 text-[var(--muted)]">{project.name.toLowerCase()}.ts</span>
      </div>

      <div className="p-5">
        {/* Method + endpoint */}
        <div className="flex items-center gap-3 mb-3 font-mono flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-bold ${
              project.method === "GET" ? "badge-get" : "badge-post"
            }`}
          >
            {project.method}
          </span>
          <span className="text-[var(--muted)] text-sm">{project.endpoint}</span>
        </div>

        {/* Name + desc */}
        <h3 className="text-lg font-bold font-mono text-[var(--text)] mb-1">{project.name}</h3>
        <p className="text-[var(--muted)] text-sm font-mono mb-4">{project.description}</p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] font-mono"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Send Request button */}
        <button
          onClick={handleRequest}
          className={`w-full py-2 text-sm font-mono rounded border transition-all duration-200 ${
            open
              ? "border-[rgba(0,255,136,0.4)] text-green-glow bg-[rgba(0,255,136,0.06)]"
              : "border-[var(--border)] text-[var(--muted)] hover:border-[rgba(0,212,255,0.4)] hover:text-cyan-glow"
          }`}
        >
          {reqState === "loading"
            ? "⟳ Sending request..."
            : open
            ? "✓ 200 OK — collapse response"
            : "→ Send Request"}
        </button>
      </div>

      {/* Response panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--border)]"
          >
            <div className="p-5 bg-[var(--surface)] font-mono text-xs">
              {/* Status line */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-green-glow font-bold">HTTP/1.1 200 OK</span>
                <span className="text-[var(--muted)]">·</span>
                <span className="text-cyan-glow">Content-Type: application/json</span>
              </div>

              {/* JSON body */}
              <pre className="text-[var(--muted)] leading-relaxed">
                <span className="text-[var(--border)]">{"{"}</span>
                {"\n"}
                {"  "}<span className="text-cyan-glow">"project"</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-[rgba(255,211,42,0.9)]">"{project.name}"</span>,{"\n"}
                {"  "}<span className="text-cyan-glow">"description"</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-[rgba(255,211,42,0.9)]">"{project.details.slice(0, 80)}..."</span>,{"\n"}
                {"  "}<span className="text-cyan-glow">"features"</span>
                <span className="text-[var(--muted)]">: [</span>
                {project.metrics?.map((m, i) => (
                  <span key={m}>
                    {"\n    "}
                    <span className="text-green-glow">"{m}"</span>
                    {i < (project.metrics?.length ?? 0) - 1 ? "," : ""}
                  </span>
                ))}
                {"\n  "}<span className="text-[var(--muted)]">],</span>
                {"\n"}
                {"  "}<span className="text-cyan-glow">"stack"</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-green-glow">["{project.stack.join('", "')}"</span>
                <span className="text-[var(--muted)]">],</span>
                {"\n"}
                {"  "}<span className="text-cyan-glow">"status"</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-green-glow">"deployed"</span>
                {"\n"}
                <span className="text-[var(--border)]">{"}"}</span>
              </pre>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-cyan-glow hover:text-green-glow transition-colors text-xs"
                >
                  → View on GitHub
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref}>
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_04</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          API{" "}
          <span className="text-green-glow">Endpoints</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; Click "Send Request" to explore each project
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.endpoint} project={project} index={i} inView={inView} />
        ))}
      </div>
      <NextSection to="achievements" label="achievements" />
      </div>
    </section>
  );
}

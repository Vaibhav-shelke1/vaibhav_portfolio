"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import NextSection from "./NextSection";

interface Project {
  method: "GET" | "POST" | "PUT" | "PATCH";
  endpoint: string;
  name: string;
  description: string;
  details: string;
  stack: string[];
  metrics?: string[];
  github?: string;
  type: "internship" | "personal";
}

const PROJECTS: Project[] = [
  {
    method: "PUT",
    endpoint: "/projects/iami",
    name: "IAMI",
    description: "Insurance Platform",
    details:
      "Full-stack insurance web application supporting policy purchase, claims management, and role-based access control. Built a multi-tier admin dashboard for managing agencies and agents. Implemented payment processing and quote generation with Zod schema validation.",
    stack: ["Next.js", "Node.js", "Express.js", "TypeScript", "MongoDB", "Redis", "Shadcn/ui"],
    metrics: [
      "Role-based access control (admin, agent, customer)",
      "Payment processing & quote generation",
      "Redis caching on frequently accessed endpoints",
      "Multi-tier admin dashboard for 200+ agents",
    ],
    type: "internship",
  },
  {
    method: "PATCH",
    endpoint: "/projects/rielverse",
    name: "Rielverse",
    description: "Insurance CRM Platform",
    details:
      "Full-stack CRM platform to manage policyholder records across multiple insurance categories. Designed a multi-role system with granular permissions supporting super admins, agents, customers, and employees. Implemented dynamic form validation and RESTful APIs to support daily operations at scale.",
    stack: ["Next.js", "Node.js", "Express.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    metrics: [
      "Multi-role system with granular permissions",
      "Dynamic form validation — reduced input errors",
      "RESTful APIs supporting daily CRM operations",
      "Responsive UI for desktop & mobile",
    ],
    type: "internship",
  },
  {
    method: "GET",
    endpoint: "/projects/krushimitra",
    name: "KrushiMitra",
    description: "Agricultural Support Platform",
    details:
      "React-based web application supporting farmers with real-time weather updates, commodity price tracking, and an intelligent chatbot for agricultural guidance. Features a clean dashboard for farmers to monitor crop data.",
    stack: ["React.js", "Flask", "Python", "REST API"],
    metrics: ["Real-time weather API integration", "Commodity price tracker", "AI chatbot for farm guidance"],
    github: "https://github.com/Vaibhav-shelke1",
    type: "personal",
  },
  {
    method: "POST",
    endpoint: "/projects/taskmanager",
    name: "TaskManager",
    description: "Project Management Platform",
    details:
      "Full-stack task management platform with a Kanban board interface, JWT-based authentication, and drag-and-drop functionality. Built to streamline project workflows with real-time task updates.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    metrics: ["Kanban board with drag & drop", "JWT auth with refresh tokens", "Real-time task updates"],
    github: "https://github.com/Vaibhav-shelke1",
    type: "personal",
  },
];

type RequestState = "idle" | "loading" | "done";

const METHOD_STYLES: Record<Project["method"], string> = {
  GET:   "badge-get",
  POST:  "badge-post",
  PUT:   "badge-put",
  PATCH: "text-[#a78bfa] border-[rgba(167,139,250,0.3)] bg-[rgba(167,139,250,0.08)]",
};

function TypeBadge({ type }: { type: Project["type"] }) {
  if (type === "internship") {
    return (
      <span className="text-[9px] font-mono px-2 py-0.5 rounded border font-bold text-[#ffd32a] border-[rgba(255,211,42,0.35)] bg-[rgba(255,211,42,0.08)]">
        INTERNSHIP
      </span>
    );
  }
  return (
    <span className="text-[9px] font-mono px-2 py-0.5 rounded border font-bold text-[#9d4edd] border-[rgba(157,78,221,0.35)] bg-[rgba(157,78,221,0.08)]">
      PERSONAL
    </span>
  );
}

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: Project;
  index: number;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reqState, setReqState] = useState<RequestState>("idle");

  const handleRequest = () => {
    if (reqState === "loading") return;
    if (open) {
      setOpen(false);
      setReqState("idle");
      return;
    }
    setReqState("loading");
    setTimeout(() => {
      setReqState("done");
      setOpen(true);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="bg-[var(--card)] rounded-lg overflow-hidden border-glow flex flex-col"
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--muted)] flex-shrink-0">
        <span className="text-[rgba(255,77,77,0.8)]">●</span>
        <span className="text-[rgba(255,211,42,0.8)]">●</span>
        <span className="text-[rgba(0,255,136,0.8)]">●</span>
        <span className="ml-2">{project.name.toLowerCase()}.ts</span>
        <span className="ml-auto">
          <TypeBadge type={project.type} />
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Method + endpoint */}
        <div className="flex items-center gap-3 mb-3 font-mono flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-bold ${METHOD_STYLES[project.method]}`}
          >
            {project.method}
          </span>
          <span className="text-[var(--muted)] text-sm truncate">{project.endpoint}</span>
        </div>

        {/* Name + description */}
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
          className={`mt-auto w-full py-2 text-sm font-mono rounded border transition-all duration-200 ${
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
              <div className="flex items-center gap-3 mb-3">
                <span className="text-green-glow font-bold">HTTP/1.1 200 OK</span>
                <span className="text-[var(--muted)]">·</span>
                <span className="text-cyan-glow">Content-Type: application/json</span>
              </div>

              <pre className="text-[var(--muted)] leading-relaxed overflow-x-auto">
                <span className="text-[var(--border)]">{"{"}</span>{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;project&quot;</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-[rgba(255,211,42,0.9)]">&quot;{project.name}&quot;</span>,{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;type&quot;</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-[rgba(255,211,42,0.9)]">&quot;{project.type}&quot;</span>,{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;description&quot;</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-[rgba(255,211,42,0.9)]">&quot;{project.details.slice(0, 80)}...&quot;</span>,{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;features&quot;</span>
                <span className="text-[var(--muted)]">: [</span>
                {project.metrics?.map((m, i) => (
                  <span key={m}>
                    {"\n    "}
                    <span className="text-green-glow">&quot;{m}&quot;</span>
                    {i < (project.metrics?.length ?? 0) - 1 ? "," : ""}
                  </span>
                ))}
                {"\n  "}<span className="text-[var(--muted)]">],</span>{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;stack&quot;</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-green-glow">[&quot;{project.stack.join('", "')}&quot;</span>
                <span className="text-[var(--muted)]">],</span>{"\n"}
                {"  "}<span className="text-cyan-glow">&quot;status&quot;</span>
                <span className="text-[var(--muted)]">: </span>
                <span className="text-green-glow">&quot;deployed&quot;</span>{"\n"}
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

  const internship = PROJECTS.filter((p) => p.type === "internship");
  const personal   = PROJECTS.filter((p) => p.type === "personal");

  return (
    <section id="projects" ref={ref}>
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-green-glow font-mono text-sm mb-2">// section_06</p>
          <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
            API{" "}
            <span className="text-green-glow">Endpoints</span>
          </h2>
          <p className="text-[var(--muted)] font-mono text-sm mt-2">
            &gt; Click &quot;Send Request&quot; to inspect each project
          </p>
        </motion.div>

        {/* Internship projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <p className="font-mono text-xs text-[#ffd32a]">// internship_contributions</p>
            <div className="flex-1 h-px bg-[rgba(255,211,42,0.15)]" />
            <span className="text-[9px] font-mono text-[rgba(255,211,42,0.6)] border border-[rgba(255,211,42,0.25)] px-2 py-0.5 rounded">
              @ Konax Technology
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internship.map((project, i) => (
              <ProjectCard key={project.endpoint} project={project} index={i} inView={inView} />
            ))}
          </div>
        </motion.div>

        {/* Personal projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <p className="font-mono text-xs text-[#9d4edd]">// personal_projects</p>
            <div className="flex-1 h-px bg-[rgba(157,78,221,0.15)]" />
            <span className="text-[9px] font-mono text-[rgba(157,78,221,0.6)] border border-[rgba(157,78,221,0.25)] px-2 py-0.5 rounded">
              Open Source
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personal.map((project, i) => (
              <ProjectCard
                key={project.endpoint}
                project={project}
                index={i + internship.length}
                inView={inView}
              />
            ))}
          </div>
        </motion.div>

        <NextSection to="leetcode" label="leetcode" />
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!form.name.trim()) { setValidationError("name is required"); return; }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError("valid email is required");
      return;
    }
    if (!form.message.trim()) { setValidationError("message is required"); return; }
    setStatus("loading");
    const start = Date.now();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setResponseTime(Date.now() - start);
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setResponseTime(Date.now() - start);
    }
  };

  return (
    <section id="contact" ref={ref}>
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_09</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          Send a{" "}
          <span className="text-green-glow">Request</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; Open for internships, full-time roles, and collaborations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-3xl"
      >
        {/* Postman window chrome */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-t-lg px-4 py-2 flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
          <span className="text-[rgba(255,77,77,0.8)]">●</span>
          <span className="text-[rgba(255,211,42,0.8)]">●</span>
          <span className="text-[rgba(0,255,136,0.8)]">●</span>
          <span className="ml-2">contact_vaibhav.http</span>
        </div>

        {/* Method + URL bar */}
        <div className="flex items-center bg-[var(--card)] border-x border-[var(--border)] px-3 py-2 gap-3">
          <span className="badge-post text-xs font-mono px-2 py-1 rounded border font-bold flex-shrink-0">
            POST
          </span>
          <span className="text-[var(--muted)] font-mono text-sm flex-1 truncate">
            https://vaibhav.shelke.dev
            <span className="text-green-glow">/api/contact/vaibhav</span>
          </span>
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={`flex-shrink-0 text-xs font-mono px-4 py-1.5 rounded transition-all duration-200 ${
              status === "loading"
                ? "bg-[rgba(0,255,136,0.1)] text-green-glow border border-[rgba(0,255,136,0.3)] cursor-wait"
                : "bg-green-glow text-[var(--bg)] font-bold hover:shadow-[0_0_16px_rgba(0,255,136,0.4)]"
            }`}
          >
            {status === "loading" ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-x border-[var(--border)] bg-[var(--surface)] text-xs font-mono">
          {(["body", "headers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 transition-colors ${
                activeTab === tab
                  ? "text-green-glow border-b border-green-glow"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="ml-auto px-4 py-2 text-[var(--muted)]">
            Authorization: <span className="text-cyan-glow">None required</span>
          </span>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--card)] border-x border-[var(--border)] p-5"
        >
          {activeTab === "body" ? (
            <div className="space-y-4 font-mono text-sm">
              <div className="text-[var(--muted)] text-xs mb-3">// application/json</div>
              {validationError && (
                <div className="text-[rgba(255,77,77,0.9)] text-xs font-mono px-3 py-2 rounded border border-[rgba(255,77,77,0.2)] bg-[rgba(255,77,77,0.06)] mb-2">
                  ✕ {validationError}
                </div>
              )}
              <div>
                <label className="text-cyan-glow text-xs block mb-1">"name"</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>
              <div>
                <label className="text-cyan-glow text-xs block mb-1">"email"</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>
              <div>
                <label className="text-cyan-glow text-xs block mb-1">"message"</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about the opportunity..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors placeholder:text-[var(--muted)] resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs space-y-2 text-[var(--muted)]">
              {[
                ["Content-Type",  "application/json"],
                ["Accept",        "application/json"],
                ["X-Powered-By",  "React / Next.js"],
                ["X-Cache",       "Redis HIT"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-cyan-glow w-36 flex-shrink-0">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Response panel */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-x border-[var(--border)]"
            >
              <div className="bg-[var(--surface)] border-t border-[var(--border)] p-5 font-mono text-xs">
                <div className="flex items-center gap-3 mb-3">
                  {status === "loading" ? (
                    <span className="text-[var(--muted)] flex items-center gap-2">
                      <span className="inline-block w-2 h-4 bg-green-glow animate-blink" />
                      Awaiting response...
                    </span>
                  ) : status === "error" ? (
                    <>
                      <span className="text-[rgba(255,77,77,0.9)] font-bold">HTTP/1.1 500 Error</span>
                      <span className="text-[var(--muted)]">·</span>
                      <span className="text-[rgba(255,77,77,0.7)]">{responseTime}ms</span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-glow font-bold">HTTP/1.1 201 Created</span>
                      <span className="text-[var(--muted)]">·</span>
                      <span className="text-cyan-glow">{responseTime}ms</span>
                    </>
                  )}
                </div>
                {status === "error" && (
                  <pre className="text-[var(--muted)] leading-relaxed">
                    <span className="text-[var(--border)]">{"{"}</span>{"\n"}
                    {"  "}<span className="text-cyan-glow">"status"</span>{": "}
                    <span className="text-[rgba(255,77,77,0.9)]">500</span>,{"\n"}
                    {"  "}<span className="text-cyan-glow">"error"</span>{": "}
                    <span className="text-[rgba(255,211,42,0.9)]">"Failed to send message. Please email directly."</span>,{"\n"}
                    {"  "}<span className="text-cyan-glow">"fallback"</span>{": "}
                    <span className="text-[rgba(255,211,42,0.9)]">"shelkevaibhav218@gmail.com"</span>{"\n"}
                    <span className="text-[var(--border)]">{"}"}</span>
                  </pre>
                )}
                {status === "success" && (
                  <pre className="text-[var(--muted)] leading-relaxed">
                    <span className="text-[var(--border)]">{"{"}</span>{"\n"}
                    {"  "}<span className="text-cyan-glow">"status"</span>{": "}
                    <span className="text-green-glow">200</span>,{"\n"}
                    {"  "}<span className="text-cyan-glow">"message"</span>{": "}
                    <span className="text-[rgba(255,211,42,0.9)]">"Request received! Will respond within 24h."</span>,{"\n"}
                    {"  "}<span className="text-cyan-glow">"from"</span>{": "}
                    <span className="text-[rgba(255,211,42,0.9)]">"Vaibhav Shelke"</span>,{"\n"}
                    {"  "}<span className="text-cyan-glow">"email"</span>{": "}
                    <span className="text-[rgba(255,211,42,0.9)]">"shelkevaibhav218@gmail.com"</span>{"\n"}
                    <span className="text-[var(--border)]">{"}"}</span>
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="bg-[var(--surface)] border border-t-0 border-[var(--border)] rounded-b-lg px-4 py-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
          <span>📧 shelkevaibhav218@gmail.com</span>
          <span>📱 +91-8010161242</span>
          <a
            href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-glow hover:text-green-glow transition-colors ml-auto"
          >
            → LinkedIn
          </a>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

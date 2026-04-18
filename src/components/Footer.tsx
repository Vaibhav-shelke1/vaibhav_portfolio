"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--muted)]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="status-dot" />
          <span>
            vaibhav.shelke <span className="text-green-glow">@</span> portfolio — All systems operational
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <a
            href="https://github.com/Vaibhav-shelke1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-glow transition-colors"
          >
            GitHub
          </a>
          <span className="text-[var(--border)]">|</span>
          <a
            href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-glow transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-[var(--border)]">|</span>
          <a href="mailto:shelkevaibhav218@gmail.com" className="hover:text-green-glow transition-colors">
            Email
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[var(--muted)]"
        >
          Built with <span className="text-green-glow">Next.js</span> + <span className="text-cyan-glow">TypeScript</span>
        </motion.div>
      </div>
    </footer>
  );
}

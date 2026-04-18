"use client";

import { motion } from "framer-motion";

interface Props {
  to: string;
  label: string;
}

/**
 * Terminal-style "go to next level" button shown at the bottom of each section.
 * Clicking it scrolls the snap container to the target section.
 */
export default function NextSection({ to, label }: Props) {
  const handleClick = () => {
    document.getElementById(to)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex justify-center pt-10 pb-6"
    >
      <button
        onClick={handleClick}
        className="group flex items-center gap-3 font-mono text-xs text-[var(--muted)] hover:text-green-glow transition-all duration-200"
      >
        <span className="text-[var(--border)] group-hover:text-green-glow transition-colors">$</span>
        <span>
          cd{" "}
          <span className="text-[var(--text)] group-hover:text-green-glow transition-colors">
            /{label}
          </span>
        </span>
        <span className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="block w-3 h-px bg-current" />
          <span className="block w-2 h-px bg-current mx-auto" />
          <span className="block w-1 h-px bg-current mx-auto" />
        </span>
      </button>
    </motion.div>
  );
}

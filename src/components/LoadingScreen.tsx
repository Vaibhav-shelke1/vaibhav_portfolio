"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_STEPS = [
  { text: "Initializing vaibhav.shelke...", delay: 0 },
  { text: "Connecting to portfolio.db...", delay: 400 },
  { text: "Loading experience data...", delay: 800 },
  { text: "Warming Redis cache...", delay: 1200 },
  { text: "Optimizing query response time...", delay: 1600 },
  { text: "✓ 99.9% systems operational", delay: 2000 },
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
        if (i === BOOT_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true);
            setTimeout(onDone, 600);
          }, 500);
        }
      }, step.delay);
    });
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center"
        >
          <div className="w-full max-w-lg px-8">
            {/* Logo */}
            <div className="mb-8">
              <p className="text-green-glow font-mono text-xl font-bold glow-green">
                &gt; vaibhav.shelke
              </p>
              <p className="text-[var(--muted)] font-mono text-sm mt-1">
                v2.0.25 — Full Stack Developer
              </p>
            </div>

            {/* Boot steps */}
            <div className="space-y-2 font-mono text-sm">
              {BOOT_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={visibleSteps.includes(i) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 ${
                    step.text.startsWith("✓")
                      ? "text-green-glow glow-green"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {!step.text.startsWith("✓") && (
                    <span className="text-cyan-glow">$</span>
                  )}
                  <span>{step.text}</span>
                  {i === visibleSteps[visibleSteps.length - 1] &&
                    !step.text.startsWith("✓") && (
                      <span className="inline-block w-2 h-4 bg-green-glow animate-blink" />
                    )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-[2px] bg-[var(--border)] rounded overflow-hidden">
              <motion.div
                className="h-full bg-green-glow"
                initial={{ width: "0%" }}
                animate={{ width: `${(visibleSteps.length / BOOT_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[var(--muted)] text-xs mt-2 text-right">
              {Math.round((visibleSteps.length / BOOT_STEPS.length) * 100)}% loaded
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

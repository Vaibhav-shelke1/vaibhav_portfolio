"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import NextSection from "./NextSection";

interface DiffStat {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: string;
  description: string;
}

const BADGES = [
  { label: "50-Day Streak",  icon: "🔥", color: "#ffd32a", desc: "Solved problems 50 days straight" },
  { label: "100-Day Streak", icon: "⚡", color: "#00d4ff", desc: "Solved problems 100 days straight" },
  { label: "200+ Solved",    icon: "✓",  color: "#00ff88", desc: "Over 200 accepted submissions" },
];

function CircleProgress({
  easy, medium, hard, total,
}: {
  easy: number; medium: number; hard: number; total: number;
}) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const easyPct   = total > 0 ? easy   / total : 0;
  const mediumPct = total > 0 ? medium / total : 0;
  const hardPct   = total > 0 ? hard   / total : 0;

  const easyLen   = circumference * easyPct;
  const mediumLen = circumference * mediumPct;
  const hardLen   = circumference * hardPct;

  const easyOffset   = 0;
  const mediumOffset = -(circumference - easyLen);
  const hardOffset   = -(circumference - easyLen - mediumLen);

  return (
    <div className="relative flex items-center justify-center w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        {/* Easy — green */}
        {easyLen > 0 && (
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="#00ff88"
            strokeWidth="10"
            strokeDasharray={`${easyLen} ${circumference - easyLen}`}
            strokeDashoffset={easyOffset}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${easyLen} ${circumference - easyLen}` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        )}
        {/* Medium — yellow */}
        {mediumLen > 0 && (
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="#ffd32a"
            strokeWidth="10"
            strokeDasharray={`${mediumLen} ${circumference - mediumLen}`}
            strokeDashoffset={mediumOffset}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${mediumLen} ${circumference - mediumLen}` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          />
        )}
        {/* Hard — red */}
        {hardLen > 0 && (
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="#ff4757"
            strokeWidth="10"
            strokeDasharray={`${hardLen} ${circumference - hardLen}`}
            strokeDashoffset={hardOffset}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${hardLen} ${circumference - hardLen}` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
          />
        )}
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-[var(--text)]">{total}</span>
        <span className="text-[9px] font-mono text-[var(--muted)]">solved</span>
      </div>
    </div>
  );
}

function AnimatedCount({ target, color }: { target: number; color: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-3xl font-bold font-mono" style={{ color }}>
      {val}
    </span>
  );
}

export default function LeetCode() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/leetcode")
      .then((r) => r.json())
      .then((data) => {
        const nums = data?.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];
        const get = (d: string) =>
          (nums.find((x: { difficulty: string; count: number }) => x.difficulty === d)?.count ?? 0);
        setStats({
          total:  get("All"),
          easy:   get("Easy"),
          medium: get("Medium"),
          hard:   get("Hard"),
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const DIFF_STATS: DiffStat[] = [
    { label: "Easy",   value: stats.easy,   color: "#00ff88", bg: "rgba(0,255,136,0.08)",  icon: "◎", description: "Fundamental patterns" },
    { label: "Medium", value: stats.medium, color: "#ffd32a", bg: "rgba(255,211,42,0.08)", icon: "◈", description: "Core problem solving" },
    { label: "Hard",   value: stats.hard,   color: "#ff4757", bg: "rgba(255,71,87,0.08)",  icon: "◆", description: "Advanced algorithms" },
  ];

  return (
    <section id="leetcode" ref={ref}>
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-green-glow font-mono text-sm mb-2">// section_08</p>
          <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
            LeetCode{" "}
            <span className="text-green-glow">Stats</span>
          </h2>
          <p className="text-[var(--muted)] font-mono text-sm mt-2">
            &gt; Consistent problem solving — 200+ accepted submissions
          </p>
        </motion.div>

        {loading ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-12 flex items-center justify-center">
            <span className="font-mono text-sm text-[var(--muted)] flex items-center gap-3">
              <span className="inline-block w-2 h-5 bg-green-glow animate-blink" />
              Fetching LeetCode data...
            </span>
          </div>
        ) : error ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 text-center font-mono text-sm text-[var(--muted)]">
            Unable to load LeetCode data — check profile at{" "}
            <a
              href="https://leetcode.com/u/Vaibhav_Shelke1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-glow hover:text-green-glow transition-colors"
            >
              leetcode.com/u/Vaibhav_Shelke1
            </a>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Main stats panel */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 border-glow">
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                {/* Donut chart */}
                <div className="flex flex-col items-center gap-3">
                  <CircleProgress
                    easy={stats.easy}
                    medium={stats.medium}
                    hard={stats.hard}
                    total={stats.total}
                  />
                  {/* Legend */}
                  <div className="flex gap-3 text-[10px] font-mono">
                    {[
                      { label: "Easy",   color: "#00ff88" },
                      { label: "Medium", color: "#ffd32a" },
                      { label: "Hard",   color: "#ff4757" },
                    ].map(({ label, color }) => (
                      <span key={label} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                        <span className="text-[var(--muted)]">{label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Difficulty breakdown */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="mb-2">
                    <p className="font-mono text-xs text-[var(--muted)] mb-1">// difficulty_breakdown</p>
                    <div className="flex items-baseline gap-2">
                      <AnimatedCount target={stats.total} color="#00d4ff" />
                      <span className="text-[var(--muted)] font-mono text-sm">total solved</span>
                    </div>
                  </div>

                  {DIFF_STATS.map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span style={{ color: d.color }}>{d.icon}</span>
                          <span className="text-[var(--text)]">{d.label}</span>
                          <span className="text-[var(--muted)] hidden sm:inline">— {d.description}</span>
                        </div>
                        <span
                          className="font-mono text-sm font-bold"
                          style={{ color: d.color }}
                        >
                          {d.value}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: d.color }}
                          initial={{ width: "0%" }}
                          animate={
                            inView
                              ? { width: stats.total > 0 ? `${(d.value / stats.total) * 100}%` : "0%" }
                              : { width: "0%" }
                          }
                          transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BADGES.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 flex items-center gap-4 hover:border-[rgba(0,255,136,0.25)] transition-all group"
                >
                  <span className="text-2xl flex-shrink-0">{badge.icon}</span>
                  <div>
                    <p
                      className="font-mono text-sm font-semibold group-hover:text-[var(--text)] transition-colors"
                      style={{ color: badge.color }}
                    >
                      {badge.label}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--muted)]">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Profile link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <motion.a
                href="https://leetcode.com/u/Vaibhav_Shelke1/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 font-mono text-sm rounded border border-[rgba(0,255,136,0.4)] text-green-glow hover:bg-[rgba(0,255,136,0.08)] hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all duration-200"
              >
                <span>↗</span>
                View LeetCode Profile
                <span className="text-[var(--muted)] text-xs">@Vaibhav_Shelke1</span>
              </motion.a>
            </motion.div>
          </motion.div>
        )}

        <NextSection to="contact" label="contact" />
      </div>
    </section>
  );
}

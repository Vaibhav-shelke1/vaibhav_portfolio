"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import NextSection from "./NextSection";

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface Language {
  name: string;
  count: number;
  color: string;
}

interface GitHubData {
  totalContributions: number;
  days: ContributionDay[];
  totalRepos: number;
  totalStars: number;
  topLanguages: Language[];
  followers: number;
}

function getColor(count: number): string {
  if (count === 0) return "#161b22";
  if (count < 3)  return "rgba(0,255,136,0.25)";
  if (count < 6)  return "rgba(0,255,136,0.50)";
  if (count < 10) return "rgba(0,255,136,0.75)";
  return "#00ff88";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function getMonthLabels(weeks: ContributionDay[][]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(week[0]?.date ?? "").getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });
  return labels;
}

export default function GitHubContributions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const weeks = data ? buildWeeks(data.days) : [];
  const monthLabels = weeks.length ? getMonthLabels(weeks) : [];

  return (
    <section id="github" ref={ref}>
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-green-glow font-mono text-sm mb-2">// section_03b</p>
        <h2 className="text-3xl font-bold font-mono text-[var(--text)]">
          GitHub{" "}
          <span className="text-green-glow">Activity</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          &gt; Fetched live via GitHub GraphQL API
        </p>
      </motion.div>

      {loading ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 flex items-center justify-center">
          <span className="font-mono text-sm text-[var(--muted)] flex items-center gap-2">
            <span className="inline-block w-2 h-4 bg-green-glow animate-blink" />
            Loading contribution data...
          </span>
        </div>
      ) : !data ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 text-center font-mono text-sm text-[var(--muted)]">
          Unable to load GitHub data
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Contributions (yr)", value: data.totalContributions.toLocaleString() },
              { label: "Repositories",       value: data.totalRepos },
              { label: "Total Stars",        value: data.totalStars },
              { label: "Followers",          value: data.followers },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:border-[rgba(0,255,136,0.3)] transition-colors"
              >
                <div className="text-xl font-bold font-mono text-green-glow">{s.value}</div>
                <div className="text-[var(--muted)] text-xs font-mono mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Contribution heatmap */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 overflow-hidden">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-sm text-[var(--text)]">
                Contribution Calendar
              </span>
              <span className="font-mono text-xs text-[var(--muted)] flex items-center gap-2">
                Less
                {[0,1,3,6,10].map((v) => (
                  <span
                    key={v}
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: getColor(v) }}
                  />
                ))}
                More
              </span>
            </div>

            <div className="overflow-x-auto">
              <div style={{ minWidth: 660 }}>
                {/* Month labels */}
                <div className="relative h-5 mb-1" style={{ marginLeft: 28 }}>
                  {monthLabels.map(({ label, col }) => (
                    <span
                      key={`${label}-${col}`}
                      className="absolute font-mono text-[10px] text-[var(--muted)]"
                      style={{ left: col * 14 }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-[3px] mr-1">
                    {["","Mon","","Wed","","Fri",""].map((d, i) => (
                      <span key={i} className="text-[9px] font-mono text-[var(--muted)] h-[11px] flex items-center" style={{ width: 24 }}>
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className="w-[11px] h-[11px] rounded-sm cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-green-glow hover:ring-offset-1 hover:ring-offset-[var(--card)]"
                            style={{ background: getColor(day.contributionCount) }}
                            onMouseEnter={(e) => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setTooltip({
                                text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                                x: rect.left,
                                y: rect.top,
                              });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top languages */}
          {data.topLanguages.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <p className="font-mono text-sm text-[var(--text)] mb-4">Top Languages</p>
              <div className="space-y-2.5">
                {data.topLanguages.map((lang, i) => {
                  const total = data.topLanguages.reduce((a, b) => a + b.count, 0);
                  const pct = Math.round((lang.count / total) * 100);
                  return (
                    <motion.div
                      key={lang.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="flex items-center gap-2 text-xs font-mono text-[var(--text)]">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full"
                            style={{ background: lang.color || "#00ff88" }}
                          />
                          {lang.name}
                        </span>
                        <span className="text-[var(--muted)] text-xs font-mono">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded overflow-hidden">
                        <motion.div
                          className="h-full rounded"
                          style={{ background: lang.color || "#00ff88" }}
                          initial={{ width: "0%" }}
                          animate={inView ? { width: `${pct}%` } : {}}
                          transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Global tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono text-xs text-[var(--text)] shadow-lg -translate-x-1/2 -translate-y-full -mt-2"
          style={{ left: tooltip.x + 6, top: tooltip.y - 6 }}
        >
          {tooltip.text}
        </div>
      )}
      <NextSection to="projects" label="projects" />
      </div>
    </section>
  );
}

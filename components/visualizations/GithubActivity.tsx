"use client";

import { motion } from "framer-motion";
import { activity } from "@/lib/data";

const colorFor = (count: number) => {
  if (count === 0) return "var(--rule)";
  if (count < 4) return "rgba(217, 150, 104, 0.3)";
  if (count < 9) return "rgba(217, 150, 104, 0.55)";
  if (count < 14) return "rgba(232, 183, 90, 0.75)";
  return "var(--accent)";
};

export function GithubActivity() {
  const max = Math.max(...activity.weeks.map((d) => d.count));
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return (
    <div className="border border-[var(--rule)] bg-[var(--bg-paper)] p-6">
      <div className="mb-4 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>fig. 04 — contributions (52w)</span>
        <span className="metric text-[var(--accent)]">
          {activity.streak}d streak
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {Array.from({ length: 52 }, (_, w) => (
              <div key={w} className="grid grid-rows-7 gap-[3px]">
                {Array.from({ length: 7 }, (_, d) => {
                  const cell = activity.weeks.find((c) => c.w === w && c.d === d)!;
                  return (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (w * 7 + d) * 0.003, duration: 0.2 }}
                      className="h-3 w-3 transition-transform hover:scale-125"
                      style={{ background: colorFor(cell.count) }}
                      title={`${cell.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            <span>less</span>
            {[0, 4, 9, 14, max].map((c, i) => (
              <span
                key={i}
                className="h-3 w-3"
                style={{ background: colorFor(c) }}
              />
            ))}
            <span>more</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[var(--rule)] pt-6 md:grid-cols-4">
        <Stat label="commits" value={activity.totalCommits} />
        <Stat label="PRs" value={activity.totalPRs} />
        <Stat label="issues" value={activity.totalIssues} />
        <Stat label="stars" value={activity.totalStars} />
      </div>

      <div className="mt-8">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          languages
        </div>
        <div className="flex h-px w-full bg-[var(--rule)]">
          {activity.topLanguages.map((l) => (
            <div
              key={l.name}
              className="h-full"
              style={{
                width: `${l.value}%`,
                background:
                  l.name === "Python"
                    ? "var(--accent)"
                    : l.name === "TypeScript"
                    ? "#7aa8c4"
                    : l.name === "Rust"
                    ? "var(--syntax-fn)"
                    : l.name === "C++"
                    ? "var(--syntax-kw)"
                    : "var(--fg-faint)",
              }}
              title={`${l.name} ${l.value}%`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--fg-mute)]">
          {activity.topLanguages.map((l, i) => (
            <span key={l.name} className="flex items-center gap-2">
              <span
                className="h-2 w-2"
                style={{
                  background:
                    l.name === "Python"
                      ? "var(--accent)"
                      : l.name === "TypeScript"
                      ? "#7aa8c4"
                      : l.name === "Rust"
                      ? "var(--syntax-fn)"
                      : l.name === "C++"
                      ? "var(--syntax-kw)"
                      : "var(--fg-faint)",
                }}
              />
              <span>{l.name}</span>
              <span className="metric text-[var(--fg-soft)]">{l.value}%</span>
              {i < activity.topLanguages.length - 1 && (
                <span className="text-[var(--fg-ghost)]">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {label}
      </div>
      <div className="metric mt-1 text-[26px] text-[var(--fg)]">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
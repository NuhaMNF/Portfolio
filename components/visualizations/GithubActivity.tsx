"use client";

import { motion } from "framer-motion";
import { activity } from "@/lib/data";

const colorFor = (count: number) => {
  if (count === 0) return "bg-zinc-900/80";
  if (count < 4) return "bg-emerald-900/70";
  if (count < 9) return "bg-emerald-700/80";
  if (count < 14) return "bg-emerald-500/80";
  return "bg-amber-300/90";
};

export function GithubActivity() {
  const max = Math.max(...activity.weeks.map((d) => d.count));
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return (
    <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <span>fig. 3 — contributions (52w)</span>
        <span className="text-amber-300">{activity.streak}d streak</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 pb-1 font-mono text-[9px] text-zinc-500">
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
                      transition={{ delay: (w * 7 + d) * 0.004, duration: 0.2 }}
                      className={`h-3 w-3 rounded-[3px] ${colorFor(cell.count)} transition-transform hover:scale-125`}
                      title={`${cell.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
            <span>less</span>
            {[0, 4, 9, 14, max].map((c, i) => (
              <span key={i} className={`h-3 w-3 rounded-[3px] ${colorFor(c)}`} />
            ))}
            <span>more</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="commits" value={activity.totalCommits} />
        <Stat label="PRs" value={activity.totalPRs} />
        <Stat label="issues" value={activity.totalIssues} />
        <Stat label="stars" value={activity.totalStars} />
      </div>

      <div className="mt-6">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          languages
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-zinc-900/80 ring-1 ring-zinc-800">
          {activity.topLanguages.map((l) => (
            <div
              key={l.name}
              className="h-full"
              style={{
                width: `${l.value}%`,
                background:
                  l.name === "Python"
                    ? "#fbbf24"
                    : l.name === "TypeScript"
                    ? "#38bdf8"
                    : l.name === "Rust"
                    ? "#f59e0b"
                    : l.name === "C++"
                    ? "#a78bfa"
                    : "#52525b",
              }}
              title={`${l.name} ${l.value}%`}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] text-zinc-400">
          {activity.topLanguages.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background:
                    l.name === "Python"
                      ? "#fbbf24"
                      : l.name === "TypeScript"
                      ? "#38bdf8"
                      : l.name === "Rust"
                      ? "#f59e0b"
                      : l.name === "C++"
                      ? "#a78bfa"
                      : "#52525b",
                }}
              />
              {l.name} {l.value}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-zinc-800/60 bg-zinc-950/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="font-mono text-2xl text-zinc-50 tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

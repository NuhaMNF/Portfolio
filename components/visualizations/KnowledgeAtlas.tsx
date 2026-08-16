"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillsGraph } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "data", "sw", "web", "db", "biz"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  all: "all nodes",
  data: "data analysis",
  sw: "software dev",
  web: "web systems",
  db: "databases",
  biz: "management",
};

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  group: string;
  isCenter?: boolean;
  isDomain?: boolean;
}

export function KnowledgeAtlas() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<string | null>(null);

  const w = 720;
  const h = 460;
  const cx = w / 2;
  const cy = h / 2;
  const domainR = 170;
  const toolR = 70;

  const points = useMemo(() => {
    const arr: Node[] = [];
    arr.push({ id: "nuha", label: skillsGraph.center.label, x: cx, y: cy, group: "nuha", isCenter: true });
    skillsGraph.domains.forEach((d, di) => {
      const a = (Math.PI * 2 * di) / skillsGraph.domains.length - Math.PI / 2;
      const dx = cx + Math.cos(a) * domainR;
      const dy = cy + Math.sin(a) * domainR;
      arr.push({ id: d.id, label: d.label, x: dx, y: dy, group: d.id, isDomain: true });
      d.tools.forEach((t, ti) => {
        const spread = (Math.PI * 2) / Math.max(d.tools.length, 3);
        const sa = a + (ti - (d.tools.length - 1) / 2) * spread * 0.5;
        const tx = dx + Math.cos(sa) * toolR;
        const ty = dy + Math.sin(sa) * toolR;
        arr.push({ id: `${d.id}-${t}`, label: t, x: tx, y: ty, group: d.id });
      });
    });
    return arr;
  }, [cx, cy]);

  const edges = useMemo(() => {
    const e: Array<{ a: string; b: string }> = [];
    const center = points.find((p) => p.isCenter)!;
    skillsGraph.domains.forEach((d) => {
      e.push({ a: center.id, b: d.id });
      d.tools.forEach((t) => e.push({ a: d.id, b: `${d.id}-${t}` }));
    });
    return e;
  }, [points]);

  const isDim = (p: Node) => {
    if (filter === "all") return false;
    if (p.isCenter) return false;
    if (p.id === filter || p.group === filter) return false;
    return true;
  };

  return (
    <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-6 md:p-8 backdrop-blur-xl shadow-lg">
      <div className="mb-4 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
        <span className="flex items-center gap-2 text-[var(--accent)] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Knowledge Atlas
        </span>
        <span className="metric text-[var(--fg-mute)]">{points.length} Connected Nodes</span>
      </div>

      {/* Filter Tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5 font-mono text-[11px]">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md border px-2.5 py-1 transition-all duration-200 uppercase tracking-wider text-[10px]",
              filter === f
                ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs"
                : "border-[var(--rule)] bg-[var(--surface-2)]/60 text-[var(--fg-mute)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="relative aspect-[720/460] w-full select-none">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          {edges.map((e, i) => {
            const a = points.find((p) => p.id === e.a);
            const b = points.find((p) => p.id === e.b);
            if (!a || !b) return null;
            const dim = isDim(a) || isDim(b);
            const active =
              !dim && (hover === a.id || hover === b.id || filter !== "all");
            return (
              <motion.line
                key={`${e.a}->${e.b}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "var(--accent)" : "var(--rule)"}
                strokeWidth={active ? 1.5 : 0.8}
                strokeDasharray="3 4"
                opacity={dim ? 0.08 : active ? 0.9 : 0.45}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.01 }}
              />
            );
          })}
          {points.map((p, i) => {
            const dim = isDim(p);
            const active = hover === p.id || (!dim && filter !== "all" && (p.id === filter || p.group === filter));
            const r = p.isCenter ? 22 : p.isDomain ? 12 : 4;
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dim ? 0.16 : 1, scale: 1 }}
                transition={{ delay: i * 0.015, duration: 0.4 }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                {p.isCenter && (
                  <>
                    <circle cx={p.x} cy={p.y} r={r + 16} fill="none" stroke="var(--accent)" strokeOpacity={0.2} strokeDasharray="2 4" />
                    <circle cx={p.x} cy={p.y} r={r + 8} fill="none" stroke="var(--accent)" strokeOpacity={0.4} />
                  </>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={p.isCenter ? "var(--accent)" : active ? "var(--accent)" : "var(--surface-2)"}
                  stroke={p.isCenter ? "var(--surface)" : "var(--accent)"}
                  strokeWidth={p.isCenter ? 2 : active ? 2 : 1}
                />
                <text
                  x={p.x}
                  y={p.y + r + 12}
                  textAnchor="middle"
                  fontSize={p.isDomain ? 10.5 : 9}
                  fontFamily="var(--font-mono)"
                  fill={dim ? "var(--fg-ghost)" : active ? "var(--accent)" : "var(--fg-soft)"}
                  fontWeight={p.isDomain || active ? "bold" : "normal"}
                  style={{
                    textTransform: p.isDomain ? "uppercase" : "none",
                    letterSpacing: p.isDomain ? "0.14em" : "0.02em",
                  }}
                  opacity={dim ? 0.25 : 1}
                >
                  {p.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
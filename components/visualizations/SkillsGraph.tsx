"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillsGraph } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "ai", "ml", "sw", "web", "data", "cloud", "research"] as const;
type Filter = (typeof FILTERS)[number];

export function SkillsGraph() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<string | null>(null);

  const w = 720;
  const h = 480;
  const cx = w / 2;
  const cy = h / 2;
  const domainR = 165;
  const toolR = 65;

  const isDim = (id: string) => {
    if (filter === "all") return false;
    if (id === "nuha") return false;
    if (id === filter) return false;
    const inDomain = skillsGraph.domains.find((d) => d.id === filter)?.tools.includes(id);
    return !inDomain;
  };

  const points = useMemo(() => {
    const arr: Array<{ id: string; label: string; x: number; y: number; group: string; isCenter?: boolean }> = [];
    arr.push({ id: "nuha", label: skillsGraph.center.label, x: cx, y: cy, group: "nuha", isCenter: true });
    skillsGraph.domains.forEach((d, di) => {
      const a = (Math.PI * 2 * di) / skillsGraph.domains.length - Math.PI / 2;
      const dx = cx + Math.cos(a) * domainR;
      const dy = cy + Math.sin(a) * domainR;
      arr.push({ id: d.id, label: d.label, x: dx, y: dy, group: d.id });
      d.tools.forEach((t, ti) => {
        const spread = (Math.PI * 2) / Math.max(d.tools.length, 3);
        const sa = a + (ti - (d.tools.length - 1) / 2) * spread * 0.5;
        const tx = dx + Math.cos(sa) * toolR;
        const ty = dy + Math.sin(sa) * toolR;
        arr.push({ id: t, label: t, x: tx, y: ty, group: d.id });
      });
    });
    return arr;
  }, []);

  const edges = useMemo(() => {
    const e: Array<{ a: string; b: string }> = [];
    const center = points.find((p) => p.isCenter)!;
    skillsGraph.domains.forEach((d) => {
      e.push({ a: center.id, b: d.id });
      d.tools.forEach((t) => e.push({ a: d.id, b: t }));
    });
    return e;
  }, [points]);

  return (
    <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <span>fig. 2 — knowledge graph</span>
        <span className="text-amber-300">{points.length} nodes</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
              filter === f ? "border-amber-300/50 text-amber-200" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative aspect-[720/480] w-full">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          {edges.map((e, i) => {
            const a = points.find((p) => p.id === e.a)!;
            const b = points.find((p) => p.id === e.b)!;
            const dim = isDim(a.id) || isDim(b.id);
            const active = !dim && (hover === a.id || hover === b.id || filter !== "all");
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "#fbbf24" : "#3f3f46"}
                strokeWidth={active ? 1.2 : 0.8}
                strokeDasharray="3 4"
                opacity={dim ? 0.15 : 0.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.01 }}
              />
            );
          })}
          {points.map((p, i) => {
            const dim = isDim(p.id);
            const active = hover === p.id || (!dim && filter !== "all" && (p.id === filter || skillsGraph.domains.find((d) => d.id === filter)?.tools.includes(p.id)));
            const r = p.isCenter ? 22 : skillsGraph.domains.find((d) => d.id === p.id) ? 14 : 5;
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dim ? 0.2 : 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
              >
                <circle cx={p.x} cy={p.y} r={r} fill={p.isCenter ? "#fbbf24" : active ? "#fbbf24" : "#10b981"} />
                {p.isCenter && <circle cx={p.x} cy={p.y} r={r + 8} fill="none" stroke="#fbbf24" opacity={0.3} />}
                <text
                  x={p.x}
                  y={p.y + r + 12}
                  textAnchor="middle"
                  className="fill-zinc-300 font-mono pointer-events-none"
                  fontSize={skillsGraph.domains.find((d) => d.id === p.id) ? 11 : 9}
                  style={{ textTransform: skillsGraph.domains.find((d) => d.id === p.id) ? "uppercase" : "none", letterSpacing: "0.1em" }}
                  opacity={dim ? 0.3 : 1}
                >
                  {p.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 font-mono text-[10px] text-zinc-500">
        click a filter to isolate a subtree — hover to inspect nodes
      </div>
    </div>
  );
}

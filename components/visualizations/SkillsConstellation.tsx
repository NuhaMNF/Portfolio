"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";

interface Node {
  id: string;
  group: string;
  x: number;
  y: number;
}

export function SkillsConstellation() {
  const [hover, setHover] = useState<string | null>(null);
  const groups = Object.entries(skills);
  const w = 720;
  const h = 420;
  const cx = w / 2;
  const cy = h / 2;
  const groupRadius = 150;

  const nodes: Node[] = [];
  groups.forEach(([group, items], gi) => {
    const a = (Math.PI * 2 * gi) / groups.length - Math.PI / 2;
    const gx = cx + Math.cos(a) * groupRadius;
    const gy = cy + Math.sin(a) * groupRadius;
    items.forEach((item, ii) => {
      const subtend = (Math.PI * 2) / Math.max(items.length, 3);
      const sa = a + (ii - (items.length - 1) / 2) * subtend * 0.55;
      nodes.push({
        id: item,
        group,
        x: gx + Math.cos(sa) * 50,
        y: gy + Math.sin(sa) * 50,
      });
    });
  });

  const connected = (n: Node) => {
    if (hover === n.id) return new Set([n.id, n.group]);
    if (hover === n.group) return new Set([n.id, n.group]);
    return new Set();
  };

  return (
    <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        fig. 2 — skill constellation
      </div>
      <div className="relative aspect-[720/420] w-full">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          {groups.map(([group], gi) => {
            const a = (Math.PI * 2 * gi) / groups.length - Math.PI / 2;
            const x = cx + Math.cos(a) * groupRadius;
            const y = cy + Math.sin(a) * groupRadius;
            const isGroupActive = hover === group || nodes.some((n) => n.id === hover && n.group === group);
            return (
              <g key={group}>
                <circle
                  cx={x}
                  cy={y}
                  r={50}
                  fill="none"
                  stroke={isGroupActive ? "#fbbf24" : "#3f3f46"}
                  strokeDasharray="3 4"
                  opacity={hover && !isGroupActive ? 0.2 : 0.8}
                />
                <text
                  x={x}
                  y={y - 56}
                  textAnchor="middle"
                  className="fill-zinc-100 font-mono"
                  fontSize={11}
                  style={{ textTransform: "uppercase", letterSpacing: "0.18em" }}
                >
                  {group}
                </text>
              </g>
            );
          })}
          {nodes.map((n, i) => {
            const set = connected(n);
            const active = hover && set.has(n.id);
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 6 : 4}
                  fill={active ? "#fbbf24" : hover ? "#52525b" : "#10b981"}
                  opacity={hover && !active ? 0.5 : 1}
                />
                <text
                  x={n.x}
                  y={n.y + 14}
                  textAnchor="middle"
                  className="fill-zinc-300 font-mono pointer-events-none"
                  fontSize={9}
                  opacity={active ? 1 : 0.7}
                >
                  {n.id}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 font-mono text-[10px] text-zinc-500">
        hover to inspect — {nodes.length} technologies across {groups.length} domains
      </div>
    </div>
  );
}

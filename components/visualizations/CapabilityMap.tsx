"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillsRadar } from "@/lib/data";

/**
 * CapabilityMap — Precision radar instrument diagram with interactive hover axes.
 */
export function CapabilityMap() {
  const [hover, setHover] = useState<number | null>(null);

  const cx = 220;
  const cy = 220;
  const r = 150;
  const axes = skillsRadar.length;
  const angle = (i: number) => (Math.PI * 2 * i) / axes - Math.PI / 2;

  const polygon = skillsRadar
    .map((d, i) => {
      const a = angle(i);
      const rr = (r * d.value) / 100;
      return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-6 md:p-8 backdrop-blur-xl shadow-lg">
      <div className="mb-4 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
        <span className="flex items-center gap-2 text-[var(--accent)] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Capability Radar
        </span>
        <span className="metric text-[var(--fg-mute)]">{axes} Core Axes</span>
      </div>

      <div className="relative aspect-square w-full max-w-[440px] mx-auto">
        <svg viewBox="0 0 440 440" className="h-full w-full select-none">
          {/* Concentric rings with labeled values */}
          {[0.25, 0.5, 0.75, 1].map((ring) => (
            <g key={ring}>
              <circle
                cx={cx}
                cy={cy}
                r={r * ring}
                fill="none"
                stroke="var(--rule)"
                strokeDasharray="2 4"
              />
              <text
                x={cx + 4}
                y={cy - r * ring + 4}
                className="metric font-mono"
                fontSize={9}
                fill="var(--fg-faint)"
              >
                {ring * 100}%
              </text>
            </g>
          ))}

          {/* Axes */}
          {skillsRadar.map((d, i) => {
            const a = angle(i);
            const isHovered = hover === i;
            return (
              <g key={d.axis} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + Math.cos(a) * (r + 8)}
                  y2={cy + Math.sin(a) * (r + 8)}
                  stroke={isHovered ? "var(--accent)" : "var(--rule)"}
                  strokeWidth={isHovered ? 1.5 : 1}
                  strokeDasharray={isHovered ? undefined : "2 4"}
                />
              </g>
            );
          })}

          {/* Data polygon */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            points={polygon}
            fill="var(--accent)"
            fillOpacity={0.12}
            stroke="var(--accent)"
            strokeWidth={1.5}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Axis Labels & Interactive Points */}
          {skillsRadar.map((d, i) => {
            const a = angle(i);
            const rr = (r * d.value) / 100;
            const x = cx + Math.cos(a) * rr;
            const y = cy + Math.sin(a) * rr;
            const lx = cx + Math.cos(a) * (r + 26);
            const ly = cy + Math.sin(a) * (r + 26);
            const isHovered = hover === i;

            return (
              <g
                key={`${d.axis}-node`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="var(--surface-2)"
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />

                {/* Text label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono text-[10.5px] uppercase tracking-wider transition-colors duration-150"
                  fill={isHovered ? "var(--accent)" : "var(--fg-soft)"}
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {d.axis}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
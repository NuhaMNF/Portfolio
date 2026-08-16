"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillsRadar } from "@/lib/data";

/**
 * CapabilityMap — replaces the generic radar chart with a precision
 * research-instrument diagram. Coordinate ticks, labeled axes, value markers.
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
    <div className="border border-[var(--rule)] bg-[var(--bg-paper)] p-6">
      <div className="mb-3 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>fig. 01 — capability map</span>
        <span className="metric text-[var(--accent)]">{axes} axes</span>
      </div>

      <div className="relative aspect-square w-full max-w-[460px] mx-auto">
        <svg viewBox="0 0 440 440" className="h-full w-full">
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
                className="metric"
                fontSize={9}
                fill="var(--fg-faint)"
              >
                {ring * 100}
              </text>
            </g>
          ))}

          {/* Axes */}
          {skillsRadar.map((d, i) => {
            const a = angle(i);
            return (
              <line
                key={d.axis}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(a) * (r + 8)}
                y2={cy + Math.sin(a) * (r + 8)}
                stroke="var(--rule)"
                strokeDasharray="2 4"
              />
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
            fillOpacity={0.08}
            stroke="var(--accent)"
            strokeWidth={1}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Tick marks */}
          {skillsRadar.flatMap((d, i) => {
            const a = angle(i);
            const rr = (r * d.value) / 100;
            const x = cx + Math.cos(a) * rr;
            const y = cy + Math.sin(a) * rr;
            return (
              <g key={`${d.axis}-tick`}>
                <circle
                  cx={x}
                  cy={y}
                  r={hover === i ? 4 : 2.5}
                  fill={hover === i ? "var(--accent)" : "var(--accent-soft)"}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity={hover === i ? 0.5 : 0}
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {/* Axis labels */}
          {skillsRadar.map((d, i) => {
            const a = angle(i);
            const x = cx + Math.cos(a) * (r + 24);
            const y = cy + Math.sin(a) * (r + 24);
            const isHover = hover === i;
            return (
              <g
                key={`${d.axis}-label`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill={isHover ? "var(--accent)" : "var(--fg-soft)"}
                  style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                  {d.axis}
                </text>
                {isHover && (
                  <text
                    x={x}
                    y={y + 14}
                    textAnchor="middle"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    fill="var(--accent)"
                  >
                    {d.value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-2 border-t border-[var(--rule)] pt-4 font-mono text-[11px]">
        {skillsRadar.map((d, i) => (
          <div
            key={d.axis}
            className={`flex items-center justify-between transition-colors ${
              hover === i ? "text-[var(--accent)]" : "text-[var(--fg-mute)]"
            }`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span>{d.axis}</span>
            <span className="metric text-[var(--fg-soft)]">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
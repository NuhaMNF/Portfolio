"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillsRadar } from "@/lib/data";

export function SkillsRadar() {
  const [hover, setHover] = useState<number | null>(null);
  const cx = 160;
  const cy = 160;
  const r = 110;
  const axes = skillsRadar.length;
  const angle = (i: number) => (Math.PI * 2 * i) / axes - Math.PI / 2;

  const polygon = (scale: number) =>
    skillsRadar
      .map((d, i) => {
        const a = angle(i);
        const rr = (r * scale * d.value) / 100;
        return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
      })
      .join(" ");

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="self-start font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        fig. 1 — capability radar
      </div>
      <svg viewBox="0 0 320 320" className="w-full max-w-[360px]">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r * ring}
            fill="none"
            stroke="#27272a"
            strokeDasharray="2 4"
          />
        ))}
        {skillsRadar.map((_, i) => {
          const a = angle(i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="#27272a"
              strokeDasharray="2 4"
            />
          );
        })}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          points={polygon(1)}
          fill="url(#radarFill)"
          stroke="#fbbf24"
          strokeWidth={1.5}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {skillsRadar.map((d, i) => {
          const a = angle(i);
          const x = cx + Math.cos(a) * (r + 18);
          const y = cy + Math.sin(a) * (r + 18);
          const isHover = hover === i;
          return (
            <g
              key={d.axis}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <circle
                cx={cx + Math.cos(a) * (r * d.value) / 100}
                cy={cy + Math.sin(a) * (r * d.value) / 100}
                r={isHover ? 5 : 3}
                fill={isHover ? "#fbbf24" : "#10b981"}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-zinc-300 font-mono"
                fontSize={11}
              >
                {d.axis}
              </text>
              {isHover && (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  className="fill-amber-300 font-mono"
                  fontSize={10}
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="grid w-full grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 md:grid-cols-3">
        {skillsRadar.map((d, i) => (
          <div
            key={d.axis}
            className={`flex items-center justify-between rounded border border-zinc-800/60 px-2 py-1 transition-colors ${
              hover === i ? "border-amber-400/60 text-amber-200" : ""
            }`}
          >
            <span>{d.axis}</span>
            <span className="text-amber-300 tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export function BarMeter({
  label,
  value,
  max = 100,
  delay = 0,
}: {
  label: string;
  value: number;
  max?: number;
  delay?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="font-mono text-[12px]">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-zinc-400">{label}</span>
        <span className="text-amber-300 tabular-nums">{value}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-900/80 ring-1 ring-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-300 to-amber-200"
        />
      </div>
    </div>
  );
}

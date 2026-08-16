"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  cellId,
  title,
  subtitle,
  meta,
}: {
  cellId: string;
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3 font-mono text-[12px]">
        <span className="text-zinc-500">In</span>
        <span className="text-zinc-600">[</span>
        <span className="text-amber-300">{cellId}</span>
        <span className="text-zinc-600">]:</span>
        {meta && (
          <span className="rounded bg-zinc-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {meta}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base text-zinc-400">{subtitle}</p>
      )}
    </motion.div>
  );
}

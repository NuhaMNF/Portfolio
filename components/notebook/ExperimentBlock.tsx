"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExperimentBlockProps {
  number: string;
  title: string;
  className?: string;
  status?: string;
  meta?: React.ReactNode;
}

/**
 * EXPERIMENT N — large editorial marker.
 * The numbered title that introduces each experiment/log entry.
 */
export function ExperimentBlock({
  number,
  title,
  className,
  status,
  meta,
}: ExperimentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative pt-12", className)}
    >
      <div className="absolute left-0 top-0 right-0 h-px bg-[var(--rule)]" />
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-5">
          <span className="experiment-marker">
            <span className="num">{number}</span>
            <span>experiment</span>
          </span>
          <h2 className="display text-[44px] sm:text-[56px] md:text-[68px] text-[var(--fg)]">
            {title}
          </h2>
        </div>
        {meta && (
          <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            {meta}
          </div>
        )}
      </div>
      {status && (
        <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-mute)]">
          {status}
        </div>
      )}
    </motion.div>
  );
}
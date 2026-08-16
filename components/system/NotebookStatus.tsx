"use client";

import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

/**
 * Top-right notebook position indicator. Tracks the same spy as the outline.
 */
export function NotebookStatus() {
  const { index } = useActiveSection();
  const TOTAL = navItems.length;
  const done = index + 1;
  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div
      className="pointer-events-none fixed right-8 top-6 z-40 hidden select-none md:block"
      aria-hidden
    >
      <div className="flex items-baseline gap-3 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--fg-mute)]">
        <span>notebook</span>
        <span className="metric text-[var(--accent)]">
          {String(done).padStart(2, "0")}/{String(TOTAL).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2 h-px w-28 overflow-hidden bg-[var(--rule)]">
        <motion.div
          className="h-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--fg-faint)]">
        {pct}% traversed
      </div>
    </div>
  );
}

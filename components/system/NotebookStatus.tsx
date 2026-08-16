"use client";

import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Top-right notebook navigation status & theme controls.
 */
export function NotebookStatus() {
  const { index } = useActiveSection();
  const TOTAL = navItems.length;
  const done = index + 1;
  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div className="fixed right-4 sm:right-6 md:right-8 top-4 md:top-5 z-40 flex items-center gap-4 select-none">
      {/* Notebook Position Indicator (Desktop) */}
      <div className="pointer-events-none hidden md:flex flex-col items-end" aria-hidden>
        <div className="flex items-baseline gap-2.5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--fg-mute)]">
          <span className="text-[10px] text-[var(--fg-faint)]">notebook</span>
          <span className="metric font-semibold text-[var(--accent)]">
            {String(done).padStart(2, "0")}/{String(TOTAL).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-1.5 h-[2px] w-24 overflow-hidden rounded-full bg-[var(--rule)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-soft)] to-[var(--accent)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-1 font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--fg-faint)]">
          {pct}% traversed
        </div>
      </div>

      {/* Top Theme Toggle Button */}
      <ThemeToggle variant="pill" />
    </div>
  );
}

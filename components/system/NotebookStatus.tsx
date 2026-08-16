"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";

/**
 * Top-right notebook position indicator. Subtle, replaces the chunky progress bar.
 */
export function NotebookStatus() {
  const [done, setDone] = useState(0);
  const TOTAL = navItems.length;

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = ids.indexOf(id);
            if (idx !== -1) setDone((d) => Math.max(d, idx + 1));
          }
        });
      },
      { threshold: 0.3, rootMargin: "-15% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

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
      <div className="mt-2 h-px w-28 bg-[var(--rule)] overflow-hidden">
        <motion.div
          className="h-full bg-[var(--accent)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--fg-faint)]">
        {pct}% traversed
      </div>
    </div>
  );
}
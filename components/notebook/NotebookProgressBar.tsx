"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";

const TOTAL = navItems.length;

export function NotebookProgressBar() {
  const [done, setDone] = useState(0);

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
      { threshold: 0.35, rootMargin: "-10% 0px -40% 0px" }
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
      className="pointer-events-none fixed right-4 top-4 z-40 hidden select-none rounded-md border border-zinc-800/80 bg-[#0c0c0e]/80 px-3 py-2 font-mono text-[10px] text-zinc-400 backdrop-blur md:block"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <span className="uppercase tracking-[0.18em] text-zinc-500">notebook</span>
        <span className="text-amber-300 tabular-nums">
          {String(done).padStart(2, "0")}/{String(TOTAL).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-zinc-900">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-amber-300"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

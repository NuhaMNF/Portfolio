"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function NotebookSidebar() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) setActive(id);
        }
      },
      { threshold: [0.18, 0.5, 0.85], rootMargin: "-15% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-[220px] lg:block">
        <div className="pointer-events-auto flex h-full flex-col gap-6 px-5 py-6">
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-200">NUHA.NIZAR</span>
            <span className="text-zinc-500">.ipynb</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Cells
          </div>
          <nav className="flex flex-1 flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "group relative flex items-center gap-3 rounded px-2 py-1.5 font-mono text-[12px] transition-colors",
                    isActive
                      ? "bg-zinc-900/80 text-zinc-50"
                      : "text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "tabular-nums",
                      isActive ? "text-amber-300" : "text-zinc-600"
                    )}
                  >
                    {item.cellId}
                  </span>
                  <span className="uppercase tracking-[0.14em]">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-dot"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300"
                    />
                  )}
                </a>
              );
            })}
          </nav>
          <div className="mt-auto rounded border border-zinc-800/80 bg-zinc-900/40 p-3 font-mono text-[10px] text-zinc-500">
            <div className="mb-1 uppercase tracking-[0.18em] text-zinc-600">Runtime</div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-zinc-300">Python 3.12</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-zinc-600">kernel</span>
              <span className="text-emerald-300">idle</span>
            </div>
            <div className="mt-2 text-zinc-600">⌘K command palette</div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-3 top-3 z-40 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur lg:hidden"
        aria-label="Toggle navigation"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
        nn.ipynb
        <span className="text-zinc-500">≡</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[260px] border-r border-zinc-800 bg-[#0d0d0f] p-5"
            >
              <div className="mb-4 flex items-center gap-2 font-mono text-[12px]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-200">NUHA.NIZAR</span>
                <span className="text-zinc-500">.ipynb</span>
              </div>
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded px-2 py-2 font-mono text-[12px] text-zinc-400 hover:bg-zinc-900/60"
                  >
                    <span className="text-amber-300">{item.cellId}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

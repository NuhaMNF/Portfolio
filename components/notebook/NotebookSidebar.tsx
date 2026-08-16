"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionHistory } from "./ExecutionHistory";

export function NotebookSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-[220px] lg:block">
        <div className="pointer-events-auto flex h-full flex-col gap-6 px-5 py-6">
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-200">NUHA_NIZAR</span>
            <span className="text-zinc-500">.ipynb</span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            python 3.12 · kernel idle
          </div>

          <ExecutionHistory />

          <div className="mt-auto rounded border border-zinc-800/80 bg-zinc-900/40 p-3 font-mono text-[10px] text-zinc-500">
            <div className="mb-1 uppercase tracking-[0.18em] text-zinc-600">Shortcuts</div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="rounded border border-zinc-800 px-1.5 py-0.5">⌘K</span>
              <span>command palette</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-zinc-300">
              <span className="rounded border border-zinc-800 px-1.5 py-0.5">⌘R</span>
              <span>restart kernel</span>
            </div>
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
                <span className="text-zinc-200">NUHA_NIZAR</span>
                <span className="text-zinc-500">.ipynb</span>
              </div>
              <ExecutionHistory />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

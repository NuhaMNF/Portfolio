"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionHistory } from "./ExecutionHistory";
import { navItems } from "@/lib/data";

/**
 * Notebook Explorer — the persistent research notebook sidebar.
 * portfolio.ipynb metadata, cell list, file information.
 */
export function NotebookExplorer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[calc(100vh-24px)] w-[260px] lg:block">
        <div className="pointer-events-auto flex h-full flex-col px-7 py-7">
          {/* File header */}
          <div className="flex items-baseline gap-2 font-mono text-[11px] tracking-tight">
            <span className="state-dot state-dot--online state-dot--done" />
            <span className="text-[var(--fg)]">NUHA_NIZAR</span>
            <span className="text-[var(--fg-faint)]">.ipynb</span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            personal_workspace
          </div>

          {/* File meta */}
          <div className="mt-5 space-y-1 font-mono text-[10.5px] text-[var(--fg-mute)]">
            <div className="flex items-center justify-between">
              <span>cells</span>
              <span className="metric text-[var(--fg-soft)]">
                {String(navItems.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>outputs</span>
              <span className="metric text-[var(--fg-soft)]">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span>experiments</span>
              <span className="metric text-[var(--fg-soft)]">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>last saved</span>
              <span className="metric text-[var(--fg-soft)]">now</span>
            </div>
          </div>

          <div className="my-6 h-px bg-[var(--rule)]" />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <ExecutionHistory />
          </div>

          <div className="mt-4 space-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--fg-mute)]">⌘ K</span>
              <span>command palette</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--fg-mute)]">⌘ ⏎</span>
              <span>run_nuha()</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--fg-mute)]">⌘ R</span>
              <span>restart kernel</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-3 top-3 z-40 inline-flex items-center gap-2 border border-[var(--rule)] bg-[var(--bg-paper)]/95 px-2.5 py-1.5 font-mono text-[11px] text-[var(--fg-soft)] backdrop-blur lg:hidden"
        aria-label="Toggle navigation"
      >
        <span className="state-dot state-dot--done" />
        nn.ipynb
        <span className="text-[var(--fg-faint)]">≡</span>
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
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[280px] flex-col border-r border-[var(--rule)] bg-[var(--bg-paper)] p-6"
            >
              <div className="mb-4 flex items-baseline gap-2 font-mono text-[11px]">
                <span className="state-dot state-dot--done" />
                <span>NUHA_NIZAR</span>
                <span className="text-[var(--fg-faint)]">.ipynb</span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ExecutionHistory onNavigate={() => setOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
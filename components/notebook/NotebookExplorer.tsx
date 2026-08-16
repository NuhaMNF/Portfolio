"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionHistory } from "./ExecutionHistory";
import { navItems } from "@/lib/data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Notebook Explorer — the persistent research notebook sidebar.
 * portfolio.ipynb metadata, outline navigation, quick actions.
 */
export function NotebookExplorer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[calc(100vh-24px)] w-[260px] lg:block">
        <div className="liquid-glass notebook-rail pointer-events-auto flex h-full flex-col px-4.5 py-5">
          {/* Notebook Top Header Card with Quick Theme Toggle */}
          <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)]/40 p-2.5 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-tight">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--state-done)] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--state-done)]" />
                </span>
                <span className="text-[var(--fg)]">NUHA_NIZAR</span>
                <span className="text-[var(--fg-faint)]">.ipynb</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThemeToggle variant="icon-only" />
              </div>
            </div>
            
            <div className="mt-1.5 flex items-center justify-between font-mono text-[9.5px] text-[var(--fg-faint)]">
              <span className="tracking-[0.16em] uppercase">workspace</span>
              <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.2 font-mono text-[8.5px] uppercase tracking-wider text-[var(--state-done)]">
                online · 3.12
              </span>
            </div>

            {/* Micro Stats Grid */}
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-[var(--rule-soft)] pt-2 font-mono text-[10px] text-[var(--fg-mute)]">
              <div className="flex items-center justify-between rounded bg-[var(--bg-paper)]/60 px-1.5 py-0.5">
                <span className="text-[var(--fg-faint)]">cells</span>
                <span className="metric font-medium text-[var(--fg-soft)]">
                  {String(navItems.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded bg-[var(--bg-paper)]/60 px-1.5 py-0.5">
                <span className="text-[var(--fg-faint)]">outputs</span>
                <span className="metric font-medium text-[var(--fg-soft)]">24</span>
              </div>
            </div>
          </div>

          <div className="my-3.5 h-px bg-[var(--rule)]" />

          {/* Outline section */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <ExecutionHistory />
          </div>

          {/* Footer Shortcuts & Theme Toggle */}
          <div className="mt-3.5 space-y-2.5 border-t border-[var(--rule)] pt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--fg-faint)]">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <span className="text-[8.5px] tracking-widest text-[var(--fg-ghost)]">v0.1</span>
            </div>

            <div className="space-y-1.5 text-[var(--fg-mute)]">
              <div className="flex items-center justify-between">
                <span className="tracking-[0.14em]">command palette</span>
                <kbd className="rounded border border-[var(--rule)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--fg-soft)] shadow-xs">
                  ⌘K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="tracking-[0.14em]">run_nuha()</span>
                <kbd className="rounded border border-[var(--rule)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--fg-soft)] shadow-xs">
                  ⌘⏎
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="tracking-[0.14em]">restart kernel</span>
                <kbd className="rounded border border-[var(--rule)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--fg-soft)] shadow-xs">
                  ⌘R
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-3 right-3 top-3 z-40 flex items-center justify-between lg:hidden pointer-events-none">
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn-glass pointer-events-auto inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[11px] text-[var(--fg-soft)] shadow-md"
          aria-label="Toggle navigation"
        >
          <span className="state-dot state-dot--done" />
          nn.ipynb
          <span className="text-[var(--fg-faint)]">≡</span>
        </button>

        <div className="pointer-events-auto">
          <ThemeToggle variant="icon-only" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="liquid-glass notebook-rail flex h-full w-[280px] flex-col p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="state-dot state-dot--done" />
                  <span className="font-medium text-[var(--fg)]">NUHA_NIZAR</span>
                  <span className="text-[var(--fg-faint)]">.ipynb</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle variant="icon-only" />
                  <button
                    onClick={() => setOpen(false)}
                    className="font-mono text-[11px] text-[var(--fg-mute)] hover:text-[var(--fg)] ml-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <ExecutionHistory onNavigate={() => setOpen(false)} />
              </div>
              <div className="mt-4 border-t border-[var(--rule)] pt-3">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
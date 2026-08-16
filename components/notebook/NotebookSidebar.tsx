"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNotebook } from "@/lib/context/NotebookContext";
import { Play, RotateCcw, FastForward, Check } from "lucide-react";

export function NotebookSidebar() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const {
    cellStates,
    setActiveCell,
    runAllCells,
    resetAll,
    executedCount,
    totalCells,
    allExecuted,
  } = useNotebook();

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) {
            setActive(id);
            const found = navItems.find((n) => n.id === id);
            if (found) setActiveCell(found.cellId);
          }
        }
      },
      { threshold: [0.15, 0.4, 0.8], rootMargin: "-15% 0px -40% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveCell]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-[220px] lg:block">
        <div className="pointer-events-auto flex h-full flex-col gap-5 px-5 py-6">
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-semibold">NUHA.NIZAR</span>
            <span className="text-zinc-500">.ipynb</span>
          </div>

          {/* Quick Run All Toolbar */}
          <div className="rounded border border-zinc-800/80 bg-zinc-900/50 p-2.5 font-mono">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-zinc-400">
              <span>Notebook</span>
              <span className="text-amber-300 font-bold">
                {executedCount}/{totalCells}
              </span>
            </div>

            {allExecuted ? (
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                  <Check className="h-3 w-3" />
                  All Executed
                </span>
                <button
                  onClick={() => resetAll()}
                  data-cursor="view"
                  title="Reset all cells"
                  className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => runAllCells()}
                data-cursor="run"
                className="flex w-full items-center justify-center gap-1.5 rounded border border-amber-300/40 bg-amber-300/10 py-1.5 text-[11px] font-medium text-amber-200 transition-all hover:bg-amber-300/20 active:scale-[0.98]"
              >
                <FastForward className="h-3 w-3 text-amber-300" />
                Run All Cells
              </button>
            )}
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Cells
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              const cellStatus = cellStates[item.cellId] || "idle";
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActive(item.id);
                    setActiveCell(item.cellId);
                  }}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded px-2 py-1.5 font-mono text-[12px] transition-all",
                    isActive
                      ? "bg-zinc-900/90 text-zinc-50 font-medium"
                      : "text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-200"
                  )}
                >
                  {/* Status indicator dot */}
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors",
                      cellStatus === "done" && "bg-amber-300",
                      cellStatus === "running" && "bg-emerald-400 animate-pulse",
                      cellStatus === "idle" && "bg-zinc-700"
                    )}
                  />

                  <span
                    className={cn(
                      "tabular-nums text-[11px]",
                      isActive ? "text-amber-300" : "text-zinc-600"
                    )}
                  >
                    [{cellStatus === "running" ? "*" : cellStatus === "done" ? item.cellId : " "}]
                  </span>

                  <span className="uppercase tracking-[0.14em] text-[11px] truncate">
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="sidebar-dot"
                      className="ml-auto h-1 w-1 rounded-full bg-amber-300"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="mt-auto rounded border border-zinc-800/80 bg-zinc-900/40 p-3 font-mono text-[10px] text-zinc-500">
            <div className="mb-1 uppercase tracking-[0.18em] text-zinc-600">Runtime</div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-300">Python 3.12 (ipykernel)</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-zinc-600">kernel</span>
              <span className="text-emerald-300 font-medium">idle</span>
            </div>
            <div className="mt-2 text-zinc-600">⌘K command palette</div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-3 top-3 z-40 flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur shadow-md"
          aria-label="Toggle navigation"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
          nn.ipynb
          <span className="text-zinc-500">≡</span>
        </button>

        {!allExecuted && (
          <button
            onClick={() => runAllCells()}
            data-cursor="run"
            className="inline-flex items-center gap-1.5 rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 font-mono text-[11px] font-medium text-amber-200 backdrop-blur shadow-md"
          >
            <Play className="h-3 w-3 fill-current" />
            Run All
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[270px] flex-col gap-4 border-r border-zinc-800 bg-[#0d0d0f] p-5 shadow-2xl"
            >
              <div className="flex items-center gap-2 font-mono text-[12px]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-200 font-semibold">NUHA.NIZAR</span>
                <span className="text-zinc-500">.ipynb</span>
              </div>

              <button
                onClick={() => {
                  runAllCells();
                  setOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded border border-amber-300/40 bg-amber-300/10 py-2 font-mono text-[12px] font-medium text-amber-200"
              >
                <FastForward className="h-3.5 w-3.5" />
                Run All Cells ({executedCount}/{totalCells})
              </button>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const cellStatus = cellStates[item.cellId] || "idle";
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => {
                        setActive(item.id);
                        setActiveCell(item.cellId);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 rounded px-2.5 py-2 font-mono text-[12px] text-zinc-300 hover:bg-zinc-900/60"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          cellStatus === "done" && "bg-amber-300",
                          cellStatus === "running" && "bg-emerald-400 animate-pulse",
                          cellStatus === "idle" && "bg-zinc-700"
                        )}
                      />
                      <span className="text-amber-300 font-medium">[{item.cellId}]</span>
                      <span className="uppercase tracking-[0.14em] text-[11px]">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

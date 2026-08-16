"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commands as staticCommands } from "@/lib/data";
import { useCommandPalette } from "@/lib/hooks/useCommandPalette";
import { useNotebook } from "@/lib/context/NotebookContext";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { runAllCells, resetAll, runCell } = useNotebook();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const dynamicCommands = useMemo(() => {
    return [
      {
        id: "cmd-run-all",
        label: "run all notebook cells",
        shortcut: "r a",
        action: () => runAllCells(),
      },
      {
        id: "cmd-reset-all",
        label: "reset all cells to queued state",
        shortcut: "r r",
        action: () => resetAll(),
      },
      ...staticCommands.map((c) => ({
        ...c,
        action: () => {
          if (c.id === "github") return window.open("https://github.com/nuhanizar", "_blank");
          if (c.id === "linkedin") return window.open("https://linkedin.com/in/nuhanizar", "_blank");
          if (c.id === "hire") {
            const ev = new CustomEvent("nuha:hire");
            window.dispatchEvent(ev);
            return;
          }
          const el = document.getElementById(c.id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      })),
      {
        id: "cmd-run-hero",
        label: "run cell 1: introduce (hero)",
        shortcut: "r 1",
        action: () => runCell("1"),
      },
      {
        id: "cmd-run-about",
        label: "run cell 2: about profile",
        shortcut: "r 2",
        action: () => runCell("2"),
      },
      {
        id: "cmd-run-skills",
        label: "run cell 3: skills & radar",
        shortcut: "r 3",
        action: () => runCell("3"),
      },
      {
        id: "cmd-run-exp",
        label: "run cell 4: experience timeline",
        shortcut: "r 4",
        action: () => runCell("4"),
      },
      {
        id: "cmd-run-projects",
        label: "run cell 5: projects & telemetry",
        shortcut: "r 5",
        action: () => runCell("5"),
      },
      {
        id: "cmd-run-research",
        label: "run cell 6: research laboratory",
        shortcut: "r 6",
        action: () => runCell("6"),
      },
      {
        id: "cmd-run-edu",
        label: "run cell 7: education credentials",
        shortcut: "r 7",
        action: () => runCell("7"),
      },
      {
        id: "cmd-run-act",
        label: "run cell 8: github activity",
        shortcut: "r 8",
        action: () => runCell("8"),
      },
      {
        id: "cmd-run-contact",
        label: "run cell 9: connect terminal",
        shortcut: "r 9",
        action: () => runCell("9"),
      },
    ];
  }, [runAllCells, resetAll, runCell]);

  const filtered = useMemo(() => {
    if (!query) return dynamicCommands;
    const q = query.toLowerCase();
    return dynamicCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.shortcut.toLowerCase().includes(q)
    );
  }, [query, dynamicCommands]);

  useEffect(() => {
    setIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setIndex((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Enter") {
        const cmd = filtered[index];
        if (cmd) {
          setOpen(false);
          setQuery("");
          cmd.action();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, index, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-[14vh] w-[min(640px,92vw)] overflow-hidden rounded-lg border border-zinc-800 bg-[#0c0c0e]/95 shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <span className="font-mono text-[12px] text-zinc-500">$</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search commands, run cells, or jump to section…"
                className="flex-1 bg-transparent font-mono text-[14px] text-zinc-100 outline-none placeholder:text-zinc-600"
              />
              <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                ESC
              </span>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-3 py-4 font-mono text-[12px] text-zinc-500">
                  no commands match "{query}"
                </div>
              )}
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    c.action();
                  }}
                  onMouseEnter={() => setIndex(i)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left font-mono text-[13px] transition-colors ${
                    i === index ? "bg-amber-500/10 text-amber-200" : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <span className="text-zinc-600">›</span>
                  <span className="flex-1">{c.label}</span>
                  <span className="text-[10px] text-zinc-600">{c.shortcut}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 font-mono text-[10px] text-zinc-500">
              <span>↑ ↓ navigate</span>
              <span>↵ execute</span>
              <span>⌘K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

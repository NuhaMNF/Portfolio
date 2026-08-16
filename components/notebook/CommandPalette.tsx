"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commands } from "@/lib/data";
import { useCommandPalette } from "@/lib/hooks/useCommandPalette";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.shortcut.toLowerCase().includes(q)
    );
  }, [query]);

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
        if (cmd) runCommand(cmd.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, index]);

  function runCommand(id: string) {
    setOpen(false);
    setQuery("");
    if (id === "github") return window.open("https://github.com/nuhanizar", "_blank");
    if (id === "linkedin") return window.open("https://linkedin.com/in/nuhanizar", "_blank");
    if (id === "hire") {
      const ev = new CustomEvent("nuha:hire");
      window.dispatchEvent(ev);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
                placeholder="search commands or sections…"
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
                  onClick={() => runCommand(c.id)}
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commands } from "@/lib/data";
import { useCommandPalette } from "@/lib/hooks/useCommandPalette";
import { cn } from "@/lib/utils";

const GHOST = "try: help, projects, hire, run_nuha";

const GROUPS: Record<string, string[]> = {
  navigate: ["hero", "about", "skills", "experience", "ai_lab", "projects", "research", "education", "activity", "contact"],
  actions: ["github", "linkedin", "hire", "surprise"],
  system: ["help", "restart", "run_nuha", "theme"],
};

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

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
    setShowHelp(false);
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
      window.dispatchEvent(new CustomEvent("nuha:hire"));
      return;
    }
    if (id === "help") {
      setShowHelp(true);
      setOpen(true);
      return;
    }
    if (id === "restart") {
      window.dispatchEvent(new CustomEvent("nuha:restart"));
      window.location.reload();
      return;
    }
    if (id === "surprise") {
      window.dispatchEvent(new CustomEvent("nuha:surprise"));
      return;
    }
    if (id === "run_nuha") {
      window.dispatchEvent(new CustomEvent("nuha:run"));
      return;
    }
    if (id === "theme") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Group filtered commands
  const grouped = useMemo(() => {
    const result: Array<{ name: string; items: typeof commands }> = [];
    for (const [name, ids] of Object.entries(GROUPS)) {
      const items = filtered.filter((c) => ids.includes(c.id));
      if (items.length) result.push({ name, items });
    }
    return result;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--bg-deep)]/85 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mt-[12vh] w-[min(680px,92vw)] overflow-hidden border border-[var(--rule)] bg-[var(--bg-paper)] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.6)]"
          >
            {showHelp ? (
              <div className="p-6 font-mono text-[12px]">
                <div className="mb-4 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                  <span>// available commands</span>
                  <span>{commands.length} entries</span>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                  {commands.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 text-[var(--fg-soft)]">
                      <span className="metric text-[var(--fg-faint)]">{c.id}</span>
                      <span>{c.label}</span>
                      <span className="ml-auto metric text-[var(--fg-faint)]">{c.shortcut}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  data-cursor="view"
                  className="mt-5 border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  back
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-[var(--rule)] px-5 py-3 font-mono">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    nuha://command
                  </span>
                  <span className="text-[var(--fg-ghost)]">›</span>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={query ? "" : GHOST}
                    className="flex-1 bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] placeholder:italic"
                  />
                  <span className="border border-[var(--rule)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-faint)]">
                    ESC
                  </span>
                </div>

                <div className="max-h-[50vh] overflow-y-auto p-3">
                  {grouped.length === 0 && (
                    <div className="px-3 py-6 font-mono text-[12px] text-[var(--fg-faint)]">
                      no commands match &quot;{query}&quot;
                    </div>
                  )}
                  {grouped.map((g) => (
                    <div key={g.name} className="mb-2">
                      <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                        {g.name}
                      </div>
                      {g.items.map((c, gi) => {
                        const flatIdx = grouped
                          .slice(0, grouped.indexOf(g))
                          .reduce((acc, x) => acc + x.items.length, 0) + gi;
                        const isActive = flatIdx === index;
                        return (
                          <button
                            key={c.id}
                            onClick={() => runCommand(c.id)}
                            onMouseEnter={() => setIndex(flatIdx)}
                            data-cursor="view"
                            className={cn(
                              "flex w-full items-center gap-3 px-3 py-1.5 text-left font-mono text-[12.5px] transition-colors duration-200",
                              isActive
                                ? "bg-[var(--surface)] text-[var(--fg)]"
                                : "text-[var(--fg-mute)] hover:bg-[var(--surface)]"
                            )}
                          >
                            <span className={isActive ? "text-[var(--accent)]" : "text-[var(--fg-ghost)]"}>
                              {isActive ? "▸" : " "}
                            </span>
                            <span className="flex-1">{c.label}</span>
                            <span className="metric text-[10px] text-[var(--fg-faint)]">
                              {c.shortcut}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-[var(--rule)] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                  <span>↑ ↓ navigate</span>
                  <span>↵ execute</span>
                  <span>⌘K toggle</span>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
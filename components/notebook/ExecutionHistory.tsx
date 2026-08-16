"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type CellState = "queued" | "running" | "done";

interface ExecutionHistoryProps {
  onNavigate?: () => void;
}

export function ExecutionHistory({ onNavigate }: ExecutionHistoryProps) {
  const { index: activeIndex } = useActiveSection();
  const reduced = useReducedMotion();
  const maxSeen = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const [, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (activeIndex <= maxSeen.current) return;
    maxSeen.current = activeIndex;
    window.dispatchEvent(new CustomEvent("nuha:cell-executed"));
  }, [activeIndex]);

  useEffect(() => {
    const onActivate = () => {
      maxSeen.current = navItems.length - 1;
    };
    window.addEventListener("nuha:activate-all", onActivate);
    return () => window.removeEventListener("nuha:activate-all", onActivate);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const current = nav.querySelector<HTMLElement>('[aria-current="location"]');
    const parent = nav.closest<HTMLElement>(".overflow-y-auto");
    if (!current || !parent) return;
    const p = parent.getBoundingClientRect();
    const r = current.getBoundingClientRect();
    if (r.top < p.top) parent.scrollTop -= p.top - r.top + 10;
    else if (r.bottom > p.bottom) parent.scrollTop += r.bottom - p.bottom + 10;
  }, [activeIndex]);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    onNavigate?.();
  };

  const progress =
    navItems.length <= 1 ? 0 : activeIndex / (navItems.length - 1);

  return (
    <div className="flex flex-col">
      {/* Header with Title, Active Step & Micro Progress Track */}
      <div className="mb-3.5 px-0.5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
          <span className="flex items-center gap-1.5 font-medium tracking-[0.22em]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            outline
          </span>
          <span className="metric font-semibold text-[var(--fg-mute)]">
            <span className="text-[var(--accent)]">{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-[var(--fg-faint)]">/</span>
            <span>{String(navItems.length).padStart(2, "0")}</span>
          </span>
        </div>

        {/* Dynamic continuous progress track */}
        <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-[var(--rule)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-soft)] to-[var(--accent)]"
            initial={false}
            animate={{ width: `${Math.round(((activeIndex + 1) / navItems.length) * 100)}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Navigation Tree */}
      <nav ref={navRef} aria-label="Notebook outline" className="relative select-none">
        {/* Background Vertical Circuit Spine */}
        <span
          aria-hidden
          className="absolute top-3.5 bottom-3.5 left-[10px] w-[1px] bg-[var(--rule)]"
        />
        {/* Active Circuit Laser Fill */}
        <span
          aria-hidden
          className="absolute top-3.5 left-[10px] w-[1px] bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] transition-[height] duration-300 ease-out"
          style={{ height: `calc((100% - 28px) * ${progress})` }}
        />

        <ol className="relative m-0 flex list-none flex-col gap-0.5 p-0">
          {navItems.map((item, i) => {
            const s: CellState =
              i < activeIndex ? "done" : i === activeIndex ? "running" : "queued";
            const isSub = Boolean(item.isSub || item.cellId.includes("."));
            const isRunning = s === "running";
            const isDone = s === "done";

            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={onClick(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-current={isRunning ? "location" : undefined}
                  data-cursor="view"
                  className={cn(
                    "group relative flex min-h-[32px] items-center gap-2 rounded-md px-1.5 py-1 font-mono text-[11px] transition-colors duration-150",
                    isSub ? "ml-2.5 pl-1.5" : "",
                    isRunning
                      ? "text-[var(--fg)] font-medium"
                      : isDone
                      ? "text-[var(--fg-soft)] hover:text-[var(--fg)]"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg-soft)]"
                  )}
                >
                  {/* Active background pill with smooth spring motion */}
                  {isRunning && (
                    <motion.div
                      layoutId="active-outline-pill"
                      className="absolute inset-0 rounded-md border-l-2 border-[var(--accent)] bg-gradient-to-r from-[var(--accent-glow)] via-[var(--accent-glow)]/70 to-transparent shadow-[inset_0_1px_0_var(--glass-tint)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Sub-item branch guide glyph */}
                  {isSub && (
                    <span
                      aria-hidden
                      className="absolute -left-[7px] top-1/2 -translate-y-1/2 font-mono text-[9px] text-[var(--rule)] group-hover:text-[var(--fg-faint)] transition-colors select-none"
                    >
                      └─
                    </span>
                  )}

                  {/* Execution State Pip / Node */}
                  <span className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                    {isRunning ? (
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-paper)] bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                      </span>
                    ) : isDone ? (
                      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] opacity-90 transition-transform group-hover:scale-125 group-hover:shadow-[0_0_6px_var(--accent-glow)]" />
                      </span>
                    ) : isSub ? (
                      <span className="h-1.5 w-1.5 rotate-45 border border-[var(--fg-faint)]/50 bg-[var(--bg-paper)] transition-colors group-hover:border-[var(--accent-soft)]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full border border-[var(--fg-faint)]/50 bg-[var(--bg-paper)] transition-all duration-200 group-hover:scale-110 group-hover:border-[var(--fg-soft)]" />
                    )}
                  </span>

                  {/* Cell ID Number */}
                  <span
                    className={cn(
                      "relative z-10 metric tabular-nums transition-colors duration-150",
                      isSub ? "w-5 text-[10px]" : "w-4 text-[10.5px]",
                      isRunning
                        ? "font-semibold text-[var(--accent)]"
                        : isDone
                        ? "text-[var(--fg-mute)] group-hover:text-[var(--fg-soft)]"
                        : "text-[var(--fg-faint)] group-hover:text-[var(--fg-mute)]"
                    )}
                  >
                    {item.cellId}
                  </span>

                  {/* Label */}
                  <span
                    className={cn(
                      "relative z-10 flex-1 truncate tracking-tight transition-colors duration-150",
                      isSub && "italic text-[10.5px]",
                      isRunning
                        ? "text-[var(--fg)]"
                        : isDone
                        ? "text-[var(--fg-soft)] group-hover:text-[var(--fg)]"
                        : "text-[var(--fg-mute)] group-hover:text-[var(--fg-soft)]"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Cell Type Tag */}
                  {item.tag && (
                    <span
                      className={cn(
                        "relative z-10 rounded px-1 py-[0.5px] font-mono text-[8px] uppercase tracking-wider transition-all duration-200",
                        isRunning
                          ? "border border-[var(--accent)]/40 bg-[var(--accent-glow)] text-[var(--accent)] font-medium"
                          : "border border-[var(--rule)] text-[var(--fg-faint)] opacity-60 group-hover:opacity-100 group-hover:border-[var(--fg-mute)]/30 group-hover:text-[var(--fg-mute)]"
                      )}
                    >
                      {item.tag}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

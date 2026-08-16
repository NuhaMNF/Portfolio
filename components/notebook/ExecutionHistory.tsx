"use client";

import { useEffect, useRef } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type CellState = "queued" | "running" | "done";

export function ExecutionHistory({ onNavigate }: { onNavigate?: () => void }) {
  const { index: activeIndex } = useActiveSection();
  const reduced = useReducedMotion();
  const maxSeen = useRef(0);
  const navRef = useRef<HTMLElement>(null);

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
    if (r.top < p.top) parent.scrollTop -= p.top - r.top + 6;
    else if (r.bottom > p.bottom) parent.scrollTop += r.bottom - p.bottom + 6;
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
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>outline</span>
        <span className="metric text-[var(--fg-mute)]">
          {String(activeIndex + 1).padStart(2, "0")}/{String(navItems.length).padStart(2, "0")}
        </span>
      </div>
      <nav ref={navRef} aria-label="Notebook outline" className="relative">
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[7px] w-px bg-[var(--rule)]"
        />
        <span
          aria-hidden
          className="absolute top-3 left-[7px] w-px bg-[var(--accent-soft)] transition-[height] duration-300 ease-out"
          style={{ height: `calc((100% - 24px) * ${progress})` }}
        />
        <ol className="relative m-0 flex list-none flex-col p-0">
          {navItems.map((item, i) => {
            const s: CellState =
              i < activeIndex ? "done" : i === activeIndex ? "running" : "queued";
            const isSub = item.cellId.includes(".");
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={onClick(item.id)}
                  aria-current={s === "running" ? "location" : undefined}
                  data-cursor="view"
                  className={cn(
                    "group relative flex min-h-9 items-center gap-3 rounded-[2px] py-1.5 pr-1 font-mono text-[11.5px] transition-colors duration-200",
                    s === "running" && "bg-[var(--accent-glow)] text-[var(--fg)]",
                    s === "done" && "text-[var(--fg-soft)] hover:text-[var(--fg)]",
                    s === "queued" && "text-[var(--fg-mute)] hover:text-[var(--fg-soft)]"
                  )}
                >
                  <span className="relative z-10 flex w-4 flex-shrink-0 items-center justify-center">
                    <span
                      className={cn(
                        "block rounded-full border transition-all duration-300",
                        s === "done" && "h-2 w-2 border-[var(--accent)] bg-[var(--accent)]",
                        s === "running" &&
                          "h-2.5 w-2.5 border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_3px_var(--bg-paper),0_0_0_4.5px_var(--accent)]",
                        s === "queued" && "h-2 w-2 border-[var(--fg-faint)] bg-[var(--bg-paper)]"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "metric w-9 tabular-nums",
                      s === "running" ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                    )}
                  >
                    {item.cellId}
                  </span>
                  <span
                    className={cn(
                      "tracking-tight",
                      isSub && "italic text-[var(--fg-mute)]",
                      s === "running" && isSub && "text-[var(--fg)]"
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

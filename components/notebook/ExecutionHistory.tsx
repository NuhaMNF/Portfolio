"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

type CellState = "queued" | "running" | "done";

export function ExecutionHistory() {
  const [states, setStates] = useState<Record<string, CellState>>(() =>
    Object.fromEntries(navItems.map((n) => [n.id, "queued" as CellState]))
  );

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = navItems.findIndex((n) => n.id === id);
            if (idx === -1) return;
            setStates((prev) => {
              const next = { ...prev };
              navItems.forEach((n, i) => {
                if (i < idx) next[n.id] = "done";
                else if (i === idx) next[n.id] = "running";
              });
              return next;
            });
            window.dispatchEvent(new CustomEvent("nuha:cell-executed"));
          }
        });
      },
      { threshold: 0.35, rootMargin: "-15% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Listen for global activation (RUN NUHA)
  useEffect(() => {
    const onActivate = () => {
      setStates(
        Object.fromEntries(navItems.map((n) => [n.id, "done" as CellState]))
      );
    };
    window.addEventListener("nuha:activate-all", onActivate);
    return () => window.removeEventListener("nuha:activate-all", onActivate);
  }, []);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>outline</span>
        <span className="metric text-[var(--fg-mute)]">{navItems.length} cells</span>
      </div>
      <nav className="flex flex-col">
        {navItems.map((item, i) => {
          const s = states[item.id];
          const isLast = i === navItems.length - 1;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClick(item.id)}
              className={cn(
                "group relative flex items-center gap-3 py-1.5 font-mono text-[11.5px] transition-colors duration-300",
                s === "running" ? "text-[var(--fg)]" : "text-[var(--fg-mute)] hover:text-[var(--fg-soft)]"
              )}
            >
              {/* Cell marker rail */}
              <div className="relative flex w-5 flex-shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "block h-[1px] w-3",
                    s === "done" ? "bg-[var(--accent)]" : s === "running" ? "bg-[var(--fg-mute)]" : "bg-[var(--rule)]"
                  )}
                />
                <span
                  className={cn(
                    "absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border transition-all duration-500",
                    s === "done" && "border-[var(--accent)] bg-[var(--accent)]",
                    s === "running" && "border-[var(--accent)] bg-[var(--bg-paper)]",
                    s === "queued" && "border-[var(--rule)] bg-[var(--bg-paper)]"
                  )}
                />
                {!isLast && (
                  <span
                    className={cn(
                      "absolute top-[calc(50%+4px)] bottom-[-15px] w-px",
                      s === "done" ? "bg-[var(--accent)]/40" : "bg-[var(--rule)]"
                    )}
                  />
                )}
              </div>

              <span
                className={cn(
                  "metric w-10",
                  s === "running" ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                )}
              >
                {item.cellId}
              </span>
              <span className="tracking-tight">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
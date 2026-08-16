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
          }
        });
      },
      { threshold: 0.4, rootMargin: "-15% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        Execution History
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const s = states[item.id];
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClick(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded px-2 py-1.5 font-mono text-[12px] transition-colors",
                s === "running"
                  ? "bg-zinc-900/80 text-zinc-50"
                  : "text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-200"
              )}
            >
              <StateIcon state={s} />
              <span
                className={cn(
                  "tabular-nums",
                  s === "running" ? "text-amber-300" : "text-zinc-600"
                )}
              >
                {item.cellId}
              </span>
              <span className="uppercase tracking-[0.14em]">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function StateIcon({ state }: { state: CellState }) {
  if (state === "done") {
    return (
      <span aria-hidden className="text-[10px] font-mono text-emerald-300">
        ✓
      </span>
    );
  }
  if (state === "running") {
    return (
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300"
      />
    );
  }
  return (
    <span aria-hidden className="text-[10px] font-mono text-zinc-700">
      ·
    </span>
  );
}

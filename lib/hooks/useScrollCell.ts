"use client";

import { useEffect, useRef, useState } from "react";

export type CellState = "queued" | "running" | "done";

export function useScrollCell<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18,
  id?: string
) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<CellState>("queued");
  const [executed, setExecuted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("running");
            const t = setTimeout(() => {
              setState("done");
              setExecuted(true);
            }, 900);
            io.disconnect();
            return () => clearTimeout(t);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    const onExecute = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id === id) {
        setState("queued");
        setExecuted(false);
        setTick((t) => t + 1);
        const node = ref.current;
        if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("nuha:execute-cell", onExecute as EventListener);
    return () => window.removeEventListener("nuha:execute-cell", onExecute as EventListener);
  }, [id]);

  return { ref, state, executed, tick };
}

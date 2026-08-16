"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorMode = "default" | "open" | "edit" | "view" | "run";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        const value = (interactive as HTMLElement).getAttribute("data-cursor") as CursorMode;
        setMode(value);
      } else {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!active) return null;

  const label =
    mode === "open"
      ? "OPEN"
      : mode === "edit"
      ? "EDIT"
      : mode === "view"
      ? "VIEW"
      : mode === "run"
      ? "RUN"
      : "";

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 mix-blend-difference md:block"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.4 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-100/80 mix-blend-difference md:block"
        animate={{
          x: pos.x,
          y: pos.y,
          width: mode === "default" ? 22 : 64,
          height: mode === "default" ? 22 : 28,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.5 }}
      >
        {label && (
          <span className="flex h-full w-full items-center justify-center font-mono text-[10px] font-medium tracking-[0.2em] text-zinc-100">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}

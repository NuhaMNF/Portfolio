"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorMode = "default" | "open" | "edit" | "view" | "run" | "copy" | "zoom";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [active, setActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        const value = (interactive as HTMLElement).getAttribute("data-cursor") as CursorMode;
        setMode(value || "view");
      } else if (target.closest("button, a, input, textarea")) {
        setMode("view");
      } else {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!active) return null;

  const isExpanded = mode !== "default";
  const label =
    mode === "open"
      ? "OPEN"
      : mode === "view"
      ? "VIEW"
      : mode === "copy"
      ? "COPY"
      : mode === "zoom"
      ? "ZOOM"
      : mode === "run"
      ? "RUN"
      : "";

  return (
    <>
      {/* Precision Core Pip */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] md:block"
        animate={{
          x: pos.x,
          y: pos.y,
          scale: isClicking ? 0.6 : isExpanded ? 0 : 1,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 900, damping: 35, mass: 0.1 }}
        style={{ width: 6, height: 6 }}
      />

      {/* Fluid Glass Follower Ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[299] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--accent)]/60 bg-[var(--surface)]/60 backdrop-blur-xs md:flex"
        animate={{
          x: pos.x,
          y: pos.y,
          width: isExpanded ? (label ? 64 : 36) : 26,
          height: isExpanded ? (label ? 26 : 36) : 26,
          scale: isClicking ? 0.88 : 1,
          borderColor: isExpanded ? "var(--accent)" : "rgba(255,255,255,0.25)",
        }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
          mass: 0.3,
        }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[9px] font-bold tracking-[0.16em] text-[var(--accent)] select-none"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

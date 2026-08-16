"use client";

import { useBackgroundMode } from "@/lib/backgroundMode";
import { Boxes, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { playSwitch } from "@/lib/sound";

export function BackgroundModeToggle() {
  const { mode, setMode } = useBackgroundMode();

  return (
    <div
      role="radiogroup"
      aria-label="Background mode"
      className="liquid-glass inline-flex items-center gap-1 rounded-full border border-[var(--rule)] bg-[var(--surface)]/80 p-1 backdrop-blur-md shadow-xs select-none"
    >
      {/* 3D Box Field Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === "boxes"}
        onClick={() => {
          if (mode !== "boxes") playSwitch();
          setMode("boxes");
        }}
        data-cursor="view"
        title="3D Isometric Grid Background"
        className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors duration-200 ${
          mode === "boxes"
            ? "text-[var(--fg)]"
            : "text-[var(--fg-mute)] hover:text-[var(--fg-soft)]"
        }`}
      >
        {mode === "boxes" && (
          <motion.div
            layoutId="bg-mode-indicator"
            className="absolute inset-0 rounded-full bg-[var(--surface-2)] border border-[var(--rule-soft)] shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Boxes className="relative z-10 h-3.5 w-3.5 text-[var(--accent)]" />
        <span className="relative z-10 hidden sm:inline uppercase tracking-wider">Grid</span>
      </button>

      {/* 3D Starfield Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === "stars"}
        onClick={() => {
          if (mode !== "stars") playSwitch();
          setMode("stars");
        }}
        data-cursor="view"
        title="3D Cosmic Starfield Background"
        className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors duration-200 ${
          mode === "stars"
            ? "text-[var(--fg)]"
            : "text-[var(--fg-mute)] hover:text-[var(--fg-soft)]"
        }`}
      >
        {mode === "stars" && (
          <motion.div
            layoutId="bg-mode-indicator"
            className="absolute inset-0 rounded-full bg-[var(--surface-2)] border border-[var(--rule-soft)] shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Sparkles className="relative z-10 h-3.5 w-3.5 text-[var(--accent)]" />
        <span className="relative z-10 hidden sm:inline uppercase tracking-wider">Stars</span>
      </button>
    </div>
  );
}

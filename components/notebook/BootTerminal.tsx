"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bootSequence } from "@/lib/data";

export function BootTerminal({ onDone }: { onDone?: () => void }) {
  const [shown, setShown] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) {
      setDone(true);
      const t = setTimeout(() => onDone?.(), 200);
      return () => clearTimeout(t);
    }
    if (shown >= bootSequence.length) {
      setDone(true);
      const t = setTimeout(() => onDone?.(), 700);
      return () => clearTimeout(t);
    }
    const item = bootSequence[shown];
    const t = setTimeout(() => setShown((s) => s + 1), item.delay);
    return () => clearTimeout(t);
  }, [shown, onDone, skipped]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !done) setSkipped(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-deep)]"
        >
          <div className="absolute inset-0 bg-paper" />
          <div className="absolute inset-0 bg-paper-vignette" />

          <div className="relative w-[min(560px,92vw)] border border-[var(--rule)] bg-[var(--bg-paper)]">
            <div className="flex items-center gap-3 border-b border-[var(--rule)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              <span className="text-[var(--accent)]">●</span>
              <span>portfolio runtime</span>
              <span className="ml-auto metric text-[var(--fg-mute)]">v0.42</span>
            </div>
            <div className="px-5 py-5 font-mono text-[12.5px] leading-[1.7]">
              {bootSequence.slice(0, shown + 1).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className={
                    item.line.startsWith(">>>")
                      ? "text-[var(--accent)]"
                      : i === bootSequence.length - 1
                      ? "text-[var(--accent-soft)]"
                      : "text-[var(--fg-soft)]"
                  }
                >
                  {item.line || " "}
                  {i === shown && (
                    <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[var(--fg)] align-middle" />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="border-t border-[var(--rule)] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              <span>kernel:</span>{" "}
              <span className="text-[var(--state-done)]">booting</span>
              <span className="ml-auto float-right">
                <span className="border border-[var(--rule)] px-1.5 py-0.5">ESC</span>{" "}
                <span className="ml-2">skip</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
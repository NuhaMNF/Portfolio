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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0b]"
        >
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative w-[min(640px,92vw)] rounded-md border border-zinc-800/80 bg-[#0d0d0f] p-5 font-mono text-[13px] shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">portfolio runtime</span>
            </div>
            <div className="space-y-1">
              {bootSequence.slice(0, shown + 1).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className={item.line.startsWith(">>>") ? "text-emerald-300" : i === bootSequence.length - 1 ? "text-amber-300" : "text-zinc-300"}
                >
                  {item.line || " "}
                  {i === shown && <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-zinc-300 align-middle" />}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[11px] text-zinc-500">
            <span className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5">ESC</span>
            <span className="ml-2">skip boot</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

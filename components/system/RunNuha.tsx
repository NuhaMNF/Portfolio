"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RUN NUHA — the signature interaction.
 * When activated via Cmd+Enter or the corner button, the notebook briefly
 * becomes alive: cells execute, particles travel, then settles.
 */
export function RunNuha() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const phases = useMemo(
    () => [
      "loading curiosity...",
      "loading experiments...",
      "loading ideas...",
      "loading projects...",
    ],
    []
  );

  const trigger = useCallback(() => {
    if (running) return;
    setRunning(true);
    setPhase(0);

    window.dispatchEvent(new CustomEvent("nuha:kernel-busy"));

    phases.forEach((_, i) => {
      setTimeout(() => setPhase(i), i * 380);
    });

    setTimeout(() => {
      setPhase(phases.length);
      window.dispatchEvent(new CustomEvent("nuha:activate-all"));
    }, phases.length * 380 + 200);

    setTimeout(() => {
      setRunning(false);
      setPhase(0);
      window.dispatchEvent(new CustomEvent("nuha:kernel-idle"));
    }, phases.length * 380 + 200 + 1400);
  }, [running, phases]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        trigger();
      }
    };
    const onCmd = () => trigger();
    window.addEventListener("keydown", onKey);
    window.addEventListener("nuha:run", onCmd);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("nuha:run", onCmd);
    };
  }, [trigger]);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--bg-deep)]/70 backdrop-blur-sm"
          onClick={() => {
            setRunning(false);
            window.dispatchEvent(new CustomEvent("nuha:kernel-idle"));
          }}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(420px,90vw)] border border-[var(--rule)] bg-[var(--bg-paper)] p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--fg-faint)]">
              nuha://run
            </div>
            <div className="mt-3 display text-[28px] text-[var(--fg)]">
              <span className="display-italic">run_nuha</span>
              <span className="text-[var(--accent)]">()</span>
            </div>
            <div className="mt-6 space-y-2 font-mono text-[12px]">
              {phase < phases.length ? (
                <>
                  <div className="flex items-center gap-2 text-[var(--fg-soft)]">
                    <span className="state-dot state-dot--running" />
                    <span>{phases[phase]}</span>
                  </div>
                  {phases.slice(0, phase).map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 text-[var(--fg-mute)]"
                    >
                      <span className="text-[var(--accent-soft)]">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[var(--accent)]"
                >
                  <span>✓</span>
                  <span>Nuha is online.</span>
                </motion.div>
              )}
            </div>
            <div className="mt-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              <span>kernel: busy</span>
              <span>click anywhere to dismiss</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
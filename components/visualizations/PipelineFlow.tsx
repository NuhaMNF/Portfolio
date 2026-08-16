"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/**
 * PipelineFlow — DATA → PROCESS → MODEL → RESULT.
 * Particles animate through the pipeline when running.
 */
const STAGES = [
  { id: "data", label: "data", note: "raw signal" },
  { id: "process", label: "process", note: "feature extraction" },
  { id: "model", label: "model", note: "inference" },
  { id: "result", label: "result", note: "delivered" },
];

/**
 * AI Lab section visualization — replaces generic glowing blobs.
 */
export function PipelineFlow({ running }: { running: boolean }) {
  const [active, setActive] = useState(-1);
  const [particles, setParticles] = useState<Array<{ id: number; stage: number }>>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    if (!running) {
      setActive(-1);
      setParticles([]);
      return;
    }
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setActive((a) => (a + 1) % (STAGES.length * 2));
      setParticles((p) => {
        const next = p.filter((x) => x.stage < STAGES.length - 1).map((x) => ({ ...x, stage: x.stage + 1 }));
        particleIdRef.current += 1;
        return [...next, { id: particleIdRef.current, stage: 0 }];
      });
    };
    tick();
    const id = setInterval(tick, 1200);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [running]);

  return (
    <div className="border border-[var(--rule)] bg-[var(--bg-paper)] p-6">
      <div className="mb-5 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>fig. 02 — model pipeline</span>
        <span className={running ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}>
          {running ? "● streaming" : "idle"}
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {STAGES.map((s, i) => (
            <div key={s.id} className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                0{i + 1}
              </div>
              <div className="display mt-1 text-[28px] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-[10.5px] tracking-[0.04em] text-[var(--fg-mute)]">
                {s.note}
              </div>
              <div className="mt-3 h-px w-full bg-[var(--rule)]" />
              <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                <span className={`state-dot ${active >= i ? "state-dot--done" : "state-dot--queued"}`} />
                <span>{active >= i ? "ok" : "queue"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Particle stream line */}
        <div className="mt-6 h-12 w-full">
          <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="h-full w-full">
            <line x1="0" y1="24" x2="400" y2="24" stroke="var(--rule)" strokeDasharray="2 4" />
            <AnimatePresence>
              {running && particles.map((p) => {
                const x = ((p.stage + 1) / STAGES.length) * 400;
                return (
                  <motion.circle
                    key={p.id}
                    r="3"
                    fill="var(--accent)"
                    initial={{ cx: 0, opacity: 0, cy: 24 }}
                    animate={{ cx: x, opacity: [0, 1, 1, 0], cy: 24 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
            </AnimatePresence>
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          <span>batch_size = 32</span>
          <span>throughput ≈ 1.2k/s</span>
          <span>p99 = 84ms</span>
        </div>
      </div>
    </div>
  );
}
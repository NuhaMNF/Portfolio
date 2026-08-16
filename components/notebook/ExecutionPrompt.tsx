"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExecutionPromptProps {
  cellId: string;
  status: "idle" | "queued" | "running" | "done";
  label?: string;
  className?: string;
  layout?: "inline" | "block";
}

/**
 * Execution prompt — refined with timestamp, cell marker, state indicator.
 * No neon glow, just quiet precision.
 */
export function ExecutionPrompt({
  cellId,
  status,
  label,
  className,
  layout = "inline",
}: ExecutionPromptProps) {
  const [stamp, setStamp] = useState("");
  const [execMs, setExecMs] = useState("0.82s");

  useEffect(() => {
    if (status === "done") {
      const d = new Date();
      const f = (n: number) => String(n).padStart(2, "0");
      setStamp(`${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`);
      // Deterministic pseudo-execution time from cell id
      let h = 0;
      for (let i = 0; i < cellId.length; i++) h = (h * 31 + cellId.charCodeAt(i)) & 0xffff;
      const sec = (0.04 + (h % 160) / 100).toFixed(2);
      setExecMs(`${sec}s`);
    }
  }, [status, cellId]);

  const display = status === "idle" ? " " : status === "running" ? "*" : status === "queued" ? "·" : cellId;
  const stateText =
    status === "idle"
      ? "queued"
      : status === "running"
      ? "running"
      : status === "queued"
      ? "queued"
      : "executed";

  const dotCls =
    status === "running"
      ? "state-dot state-dot--running"
      : status === "done"
      ? "state-dot state-dot--done"
      : "state-dot state-dot--queued";

  const cellColor =
    status === "running"
      ? "text-[var(--accent)]"
      : status === "done"
      ? "text-[var(--state-done)]"
      : "text-[var(--fg-faint)]";

  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] tracking-[0.02em]",
        layout === "block" && "flex-col items-start gap-1",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[var(--fg-faint)]">In</span>
        <span className="text-[var(--fg-faint)]">[</span>
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("metric min-w-[2.5ch] text-right", cellColor)}
        >
          {display}
        </motion.span>
        <span className="text-[var(--fg-faint)]">]</span>
      </div>
      {label && (
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 text-[var(--fg-mute)]">
        <span className={dotCls} />
        <span className="text-[10.5px] uppercase tracking-[0.18em]">
          {stateText}
        </span>
      </div>
      {status === "done" && (
        <span className="text-[10.5px] tracking-[0.04em] text-[var(--fg-faint)]">
          <span className="metric text-[var(--state-done)]">✓</span>
          <span className="ml-2 metric text-[var(--fg-mute)]">{execMs}</span>
          {stamp && (
            <>
              <span className="mx-2 text-[var(--fg-ghost)]">·</span>
              <span className="metric text-[var(--fg-faint)]">{stamp}</span>
            </>
          )}
        </span>
      )}
    </div>
  );
}
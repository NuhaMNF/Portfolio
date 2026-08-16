"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutionPromptProps {
  cellId: string;
  status: "idle" | "queued" | "running" | "done";
  label?: string;
  className?: string;
  layout?: "inline" | "block";
  onRerun?: () => void;
}

/**
 * Execution prompt — refined with live streaming status, timestamp, and instant rerun trigger.
 */
export function ExecutionPrompt({
  cellId,
  status,
  label,
  className,
  layout = "inline",
  onRerun,
}: ExecutionPromptProps) {
  const [stamp, setStamp] = useState("");
  const [execMs, setExecMs] = useState("0.18s");

  useEffect(() => {
    if (status === "done") {
      const d = new Date();
      const f = (n: number) => String(n).padStart(2, "0");
      setStamp(`${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`);
      // Deterministic pseudo-execution time from cell id
      let h = 0;
      for (let i = 0; i < cellId.length; i++) h = (h * 31 + cellId.charCodeAt(i)) & 0xffff;
      const sec = (0.04 + (h % 160) / 1000).toFixed(2);
      setExecMs(`${sec}s`);
    }
  }, [status, cellId]);

  const display =
    status === "idle" ? " " : status === "running" ? "*" : status === "queued" ? "·" : cellId;

  const stateText =
    status === "idle"
      ? "queued"
      : status === "running"
      ? "executing..."
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
      ? "text-[var(--accent)] font-semibold"
      : status === "done"
      ? "text-[var(--state-done)]"
      : "text-[var(--fg-faint)]";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between font-mono text-[11px] tracking-[0.02em]",
        layout === "block" && "flex-col items-start gap-1",
        className
      )}
    >
      {/* Left side: In [ XX ] prompt + status */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--fg-faint)]">In</span>
          <span className="text-[var(--fg-faint)]">[</span>
          <motion.span
            key={display}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("metric min-w-[2.5ch] text-center", cellColor)}
          >
            {display}
          </motion.span>
          <span className="text-[var(--fg-faint)]">]</span>
        </div>

        {label && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
            {label}
          </span>
        )}

        <div className="flex items-center gap-2 text-[var(--fg-mute)]">
          <span className={dotCls} />
          <span className="text-[10px] uppercase tracking-[0.16em]">
            {stateText}
          </span>
        </div>

        {status === "done" && (
          <span className="inline-flex items-center gap-1.5 text-[10.5px] text-[var(--fg-faint)]">
            <span className="metric font-medium text-[var(--state-done)]">✓</span>
            <span className="metric text-[var(--fg-mute)]">{execMs}</span>
            {stamp && (
              <>
                <span className="text-[var(--fg-ghost)]">·</span>
                <span className="metric text-[var(--fg-faint)]">{stamp}</span>
              </>
            )}
          </span>
        )}
      </div>

      {/* Right side: Re-run simulator action */}
      {onRerun && (
        <button
          type="button"
          onClick={onRerun}
          data-cursor="run"
          title="Re-run cell simulation (Shift+Enter)"
          className="btn-glass group/btn inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10.5px] text-[var(--fg-mute)] transition-all hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
        >
          <RotateCw
            className={cn(
              "h-3 w-3 transition-transform duration-300 group-hover/btn:rotate-180",
              status === "running" && "animate-spin text-[var(--accent)]"
            )}
          />
          <span className="uppercase tracking-[0.14em] text-[9.5px]">
            {status === "running" ? "running" : "rerun"}
          </span>
          <span className="hidden sm:inline text-[8.5px] text-[var(--fg-faint)] font-mono opacity-60 group-hover/btn:opacity-100">
            ⇧⏎
          </span>
        </button>
      )}
    </div>
  );
}
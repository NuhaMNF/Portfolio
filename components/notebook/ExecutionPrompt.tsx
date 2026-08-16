"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CellStatus } from "@/lib/context/NotebookContext";

interface ExecutionPromptProps {
  cellId: string;
  status: CellStatus;
  label?: string;
  className?: string;
  layout?: "inline" | "block";
  onRun?: () => void;
  onReset?: () => void;
}

export function ExecutionPrompt({
  cellId,
  status,
  label,
  className,
  layout = "inline",
  onRun,
  onReset,
}: ExecutionPromptProps) {
  const display = status === "idle" ? " " : status === "running" ? "*" : cellId;
  const stateText =
    status === "idle"
      ? "queued"
      : status === "running"
      ? "running"
      : "executed";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 font-mono text-[12px] tracking-tight",
        layout === "block" && "flex-col items-start gap-2",
        className
      )}
    >
      {/* Left: In [n]: indicator + status badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">In</span>
          <span className="text-zinc-600">[</span>
          <motion.span
            key={display}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-block min-w-[1.2ch] text-center font-medium",
              status === "running" && "text-emerald-300 font-bold",
              status === "idle" && "text-zinc-600",
              status === "done" && "text-amber-300"
            )}
          >
            {display}
          </motion.span>
          <span className="text-zinc-600">]:</span>
        </div>

        {label && (
          <span
            className={cn(
              "uppercase tracking-[0.18em] text-[10px]",
              "text-zinc-500"
            )}
          >
            {label}
          </span>
        )}

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] transition-colors",
            status === "running" && "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
            status === "idle" && "bg-zinc-800/60 text-zinc-500 border border-zinc-800",
            status === "done" && "bg-amber-500/10 text-amber-300 border border-amber-500/30"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === "running" && "bg-emerald-400 animate-pulse",
              status === "idle" && "bg-zinc-600",
              status === "done" && "bg-amber-300"
            )}
          />
          {stateText}
        </span>
      </div>

      {/* Right: Interactive Run / Re-run Action Button */}
      {onRun && (
        <div className="flex items-center gap-2">
          {status === "idle" && (
            <button
              onClick={onRun}
              data-cursor="run"
              className="group inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[11px] font-medium text-amber-200 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-300/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-3 w-3 fill-current text-amber-300 transition-transform group-hover:scale-110" />
              <span>Run Cell</span>
              <kbd className="hidden rounded bg-amber-400/20 px-1 py-0.5 text-[9px] text-amber-300 sm:inline-block">
                Shift+↵
              </kbd>
            </button>
          )}

          {status === "running" && (
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Running...</span>
            </div>
          )}

          {status === "done" && (
            <div className="flex items-center gap-1.5">
              <span className="hidden text-[11px] text-zinc-500 sm:inline-block font-mono">
                ✓ Executed
              </span>
              <button
                onClick={onRun}
                data-cursor="run"
                title="Re-execute this cell"
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>Re-run</span>
              </button>
              {onReset && (
                <button
                  onClick={onReset}
                  data-cursor="view"
                  title="Collapse output & reset cell"
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-800/80 bg-zinc-900/40 px-1.5 py-1 font-mono text-[10px] text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

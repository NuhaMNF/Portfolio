"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExecutionPromptProps {
  cellId: string;
  status: "idle" | "queued" | "running" | "done";
  label?: string;
  className?: string;
  layout?: "inline" | "block";
}

export function ExecutionPrompt({
  cellId,
  status,
  label,
  className,
  layout = "inline",
}: ExecutionPromptProps) {
  const display = status === "idle" ? " " : status === "running" ? "*" : cellId;
  const stateText =
    status === "idle"
      ? "queued"
      : status === "running"
      ? "running"
      : status === "queued"
      ? "queued"
      : "executed";

  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[12px] tracking-tight",
        layout === "block" && "flex-col items-start gap-1",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">In</span>
        <span className="text-zinc-600">[</span>
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "min-w-[1.2ch] text-right font-medium",
            status === "running" && "text-emerald-300",
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
          "ml-1 inline-flex items-center gap-2 rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]",
          status === "running" && "bg-emerald-500/10 text-emerald-300",
          status === "idle" && "bg-zinc-800/80 text-zinc-500",
          status === "done" && "bg-amber-500/10 text-amber-300"
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
  );
}

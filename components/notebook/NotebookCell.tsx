"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCellObserver } from "@/lib/hooks/useCellObserver";
import { ExecutionPrompt } from "./ExecutionPrompt";
import { Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotebookCellProps {
  cellId: string;
  className?: string;
  children: (
    executed: boolean,
    status: "queued" | "running" | "done",
    run: boolean,
    runCell: () => void
  ) => React.ReactNode;
  threshold?: number;
  manualRun?: boolean;
  /** Compact variant for cells that don't need full visual weight */
  variant?: "default" | "compact" | "wide";
}

/**
 * Notebook cell with tactile feel: paper surface, layer lines, cell markers.
 */
export function NotebookCell({
  cellId,
  className,
  children,
  threshold = 0.18,
  manualRun = true,
  variant = "default",
}: NotebookCellProps) {
  const { ref, executed } = useCellObserver<HTMLDivElement>(threshold);
  const status: "queued" | "running" | "done" = !executed ? "queued" : "running";
  const [run, setRun] = useState(false);
  const runCell = () => setRun(true);

  return (
    <section
      ref={ref}
      id={cellId.includes(".") ? undefined : cellId}
      data-cell={cellId}
      className={cn("relative", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <ExecutionPrompt cellId={cellId} status={status} />

        <div
          className={cn(
            "mt-4",
            variant === "wide" && "relative"
          )}
        >
          {children(executed, status, manualRun ? run : true, manualRun ? runCell : () => setRun(true))}
        </div>

        {manualRun && executed && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-5 flex items-center gap-3"
            >
              <button
                onClick={runCell}
                data-cursor="run"
                className={cn(
                  "group inline-flex items-center gap-2 border px-3.5 py-1.5 font-mono text-[12px] transition-colors duration-300",
                  run
                    ? "border-[var(--rule)] text-[var(--fg-mute)] hover:border-[var(--accent)]"
                    : "border-[var(--rule)] text-[var(--fg-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                )}
              >
                {run ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-[var(--state-done)]" />
                    <span>executed</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current" />
                    <span>run cell</span>
                    <span className="ml-1 text-[10px] text-[var(--fg-faint)]">shift+⏎</span>
                  </>
                )}
              </button>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                {run ? "output expanded" : "click to expand output"}
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
}
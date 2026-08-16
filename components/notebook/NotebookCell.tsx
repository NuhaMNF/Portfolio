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
  /**
   * If true, output stays hidden until the user clicks Run.
   * Code still types on scroll, but `run` flag starts false.
   */
  manualRun?: boolean;
}

/**
 * Tracks when this cell enters the viewport. Drives execution state.
 * Children receive (executed, status, run, runCell) so the cell decides
 * how to render. When `manualRun` is true, output waits for click.
 */
export function NotebookCell({
  cellId,
  className,
  children,
  threshold = 0.18,
  manualRun = true,
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
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <ExecutionPrompt cellId={cellId} status={status} />
        {children(executed, status, manualRun ? run : true, manualRun ? runCell : () => setRun(true))}

        {manualRun && executed && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-4 flex items-center gap-3"
            >
              <button
                onClick={runCell}
                data-cursor="run"
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-[13px] transition-colors",
                  run
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20"
                )}
              >
                {run ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {run ? "executed" : "▶ run cell"}
              </button>
              <span className="font-mono text-[11px] text-zinc-500">
                {run ? "output expanded" : "click to expand output"}
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
}

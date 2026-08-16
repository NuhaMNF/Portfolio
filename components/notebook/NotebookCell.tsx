"use client";

import { motion } from "framer-motion";
import { useCellObserver } from "@/lib/hooks/useCellObserver";
import { ExecutionPrompt } from "./ExecutionPrompt";
import { cn } from "@/lib/utils";

interface NotebookCellProps {
  cellId: string;
  className?: string;
  children: (executed: boolean, status: "queued" | "running" | "done") => React.ReactNode;
  threshold?: number;
}

/**
 * Tracks when this cell enters the viewport. Drives execution state.
 * Children receive (executed, status) so the cell decides how to render.
 */
export function NotebookCell({ cellId, className, children, threshold = 0.18 }: NotebookCellProps) {
  const { ref, executed } = useCellObserver<HTMLDivElement>(threshold);
  const status: "queued" | "running" | "done" = !executed ? "queued" : "running";
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
        {children(executed, status)}
      </motion.div>
    </section>
  );
}

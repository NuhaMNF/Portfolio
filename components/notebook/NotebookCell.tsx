"use client";

import { motion } from "framer-motion";
import { useNotebook, CellStatus } from "@/lib/context/NotebookContext";
import { ExecutionPrompt } from "./ExecutionPrompt";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotebookCellProps {
  cellId: string;
  className?: string;
  label?: string;
  collapsedHint?: string;
  children: (
    executed: boolean,
    status: CellStatus,
    run: () => void
  ) => React.ReactNode;
}

/**
 * NotebookCell — Interactive computational cell.
 * Content output is only displayed when the cell is executed (via Run button, keyboard shortcut, or Run All).
 */
export function NotebookCell({
  cellId,
  className,
  label,
  collapsedHint,
  children,
}: NotebookCellProps) {
  const { cellStates, activeCell, setActiveCell, runCell, resetCell } =
    useNotebook();
  const status: CellStatus = cellStates[cellId] || "idle";
  const executed = status === "done";
  const isSelected = activeCell === cellId;

  const handleRun = () => {
    setActiveCell(cellId);
    runCell(cellId);
  };

  const handleReset = () => {
    resetCell(cellId);
  };

  return (
    <section
      id={cellId.includes(".") ? undefined : navIdForCell(cellId)}
      data-cell={cellId}
      onClick={() => setActiveCell(cellId)}
      className={cn(
        "group/cell relative transition-all duration-200",
        isSelected && "rounded-lg ring-1 ring-amber-400/20 bg-zinc-900/[0.04]",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-3">
          <ExecutionPrompt
            cellId={cellId}
            status={status}
            label={label}
            onRun={handleRun}
            onReset={handleReset}
          />
        </div>

        {children(executed, status, handleRun)}

        {/* Collapsed placeholder banner shown when cell has not been run yet */}
        {!executed && status !== "running" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleRun();
            }}
            data-cursor="run"
            className="mt-3 flex cursor-pointer items-center justify-between rounded-md border border-dashed border-zinc-800/80 bg-zinc-950/40 px-4 py-3 font-mono text-[12px] text-zinc-500 transition-all hover:border-amber-400/50 hover:bg-amber-400/[0.03] hover:text-zinc-300"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 group-hover/cell:bg-amber-400/80 transition-colors" />
              <span>
                {collapsedHint || `Out[${cellId}] output collapsed · Click to run cell`}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
              <Play className="h-3 w-3 fill-current" />
              <span>Run Cell</span>
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}

function navIdForCell(cellId: string): string | undefined {
  const map: Record<string, string> = {
    "1": "hero",
    "2": "about",
    "3": "skills",
    "4": "experience",
    "5": "projects",
    "6": "research",
    "7": "education",
    "8": "activity",
    "9": "contact",
  };
  return map[cellId];
}

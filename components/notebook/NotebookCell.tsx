"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ExecutionPrompt } from "./ExecutionPrompt";
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
  variant?: "default" | "compact" | "wide";
  label?: string;
}

/**
 * Notebook cell with Streaming Auto-Execution on Scroll.
 * Automatically executes as the user scrolls into view and provides instant interactive re-runs.
 */
export function NotebookCell({
  cellId,
  className,
  children,
  threshold = 0.1,
  variant = "default",
  label,
}: NotebookCellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"queued" | "running" | "done">("queued");
  const [isRerunning, setIsRerunning] = useState(false);
  const executedRef = useRef(false);

  const executeCell = useCallback((isManual = false) => {
    setStatus("running");
    if (isManual) setIsRerunning(true);
    window.dispatchEvent(new CustomEvent("nuha:kernel-busy"));

    const timer = setTimeout(() => {
      setStatus("done");
      setIsRerunning(false);
      executedRef.current = true;
      window.dispatchEvent(new CustomEvent("nuha:cell-executed"));
      window.dispatchEvent(new CustomEvent("nuha:kernel-idle"));
    }, isManual ? 280 : 180);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || executedRef.current) return;

    // Check if element is already in viewport on initial load
    const rect = node.getBoundingClientRect();
    const isVisibleInitially =
      rect.top < window.innerHeight * 0.95 && rect.bottom > 0;

    if (isVisibleInitially) {
      executeCell(false);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !executedRef.current) {
            executeCell(false);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [threshold, executeCell]);

  const runCell = () => {
    executeCell(true);
  };

  const executed = status === "done" || status === "running";
  const run = executed;

  return (
    <section
      ref={containerRef}
      id={cellId.includes(".") ? undefined : cellId}
      data-cell={cellId}
      className={cn("relative group/cell", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Cell Execution Bar */}
        <div className="mb-3 flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5">
          <ExecutionPrompt
            cellId={cellId}
            status={status}
            label={label}
            onRerun={runCell}
          />
        </div>

        {/* Cell Content Area */}
        <div
          className={cn(
            "relative transition-all duration-300",
            variant === "wide" && "relative",
            isRerunning && "opacity-90"
          )}
        >
          {/* Telemetry scanline animation during rerun */}
          {isRerunning && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "linear" }}
              className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80"
            />
          )}

          {children(executed, status, run, runCell)}
        </div>
      </motion.div>
    </section>
  );
}
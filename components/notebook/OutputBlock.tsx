"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutputBlockProps {
  cellId: string;
  visible: boolean;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "result" | "soft";
  meta?: string;
}

export function OutputBlock({
  cellId,
  visible,
  children,
  className,
  tone = "default",
  meta,
}: OutputBlockProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mt-4 overflow-hidden", className)}
    >
      {/* Output Header */}
      <div className="flex items-center justify-between pb-2.5 pt-2 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--fg-faint)]">Out</span>
          <span className="text-[var(--fg-faint)]">[</span>
          <span className="metric font-semibold text-[var(--accent)]">{cellId}</span>
          <span className="text-[var(--fg-faint)]">]:</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent)]/30 to-transparent" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--state-done)]" />
          <span>result rendered</span>
          {meta && (
            <>
              <span className="text-[var(--fg-ghost)]">·</span>
              <span className="text-[var(--fg-mute)]">{meta}</span>
            </>
          )}
        </div>
      </div>

      {/* Output Content Surface */}
      <div
        className={cn(
          "rounded-lg border transition-all duration-300",
          tone === "default" &&
            "cell-paper border-[var(--rule)] bg-[var(--surface)]/50 p-5 md:p-7 backdrop-blur-md shadow-sm",
          tone === "result" &&
            "cell-paper border-emerald-500/25 bg-emerald-500/[0.02] p-5 md:p-7 backdrop-blur-md",
          tone === "soft" && "border-transparent bg-transparent p-0"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

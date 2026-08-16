"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutputBlockProps {
  cellId: string;
  visible: boolean;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "result" | "soft";
}

export function OutputBlock({ cellId, visible, children, className, tone = "default" }: OutputBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("overflow-hidden", className)}
        >
          <div className="flex items-center gap-2 pb-3 pt-5 font-mono text-[12px]">
            <span className="text-zinc-500">Out[</span>
            <span className="text-amber-300">{cellId}</span>
            <span className="text-zinc-600">]:</span>
            <span className="ml-2 h-px flex-1 bg-gradient-to-r from-amber-300/30 via-amber-300/10 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className={cn(
              "rounded-md border",
              tone === "default" && "border-zinc-800/60 bg-zinc-900/30 p-5 md:p-6",
              tone === "result" && "border-emerald-500/20 bg-emerald-500/[0.03] p-5 md:p-6",
              tone === "soft" && "border-zinc-800/40 bg-transparent p-1"
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

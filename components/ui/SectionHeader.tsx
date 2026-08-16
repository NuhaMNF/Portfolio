"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  cellId: string;
  title: string;
  subtitle?: string;
  meta?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Refined section header. Cell marker on the left, editorial title, mono meta.
 */
export function SectionHeader({
  cellId,
  title,
  subtitle,
  meta,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mb-10 flex flex-col gap-4", align === "center" && "items-center text-center", className)}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
        <span>In</span>
        <span>[</span>
        <span className="metric text-[var(--accent)]">{cellId}</span>
        <span>]</span>
        {meta && (
          <>
            <span className="mx-2 text-[var(--fg-ghost)]">·</span>
            <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
              {meta}
            </span>
          </>
        )}
      </div>
      <h2 className="display text-[40px] sm:text-[52px] md:text-[64px] tracking-tight text-[var(--fg)]">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-[15px] leading-[1.65] text-[var(--fg-mute)]">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
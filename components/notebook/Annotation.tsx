"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnnotationProps {
  children: React.ReactNode;
  /** Position offset for controlled imperfection */
  offset?: "slight" | "more" | "none";
  tone?: "default" | "warm" | "quiet" | "wry";
  className?: string;
  prefix?: string;
}

/**
 * Handwritten / paper-margin annotation.
 * Slight rotations, display italic. Used sparingly for personality.
 */
export function Annotation({
  children,
  offset = "slight",
  tone = "default",
  className,
  prefix,
}: AnnotationProps) {
  const offsetClass =
    offset === "more" ? "note--more-off" : offset === "slight" ? "note--off" : "";

  const toneClass =
    tone === "warm"
      ? "text-[var(--accent)] opacity-90"
      : tone === "quiet"
      ? "text-[var(--fg-faint)]"
      : tone === "wry"
      ? "text-[var(--syntax-str)] opacity-90"
      : "text-[var(--fg-mute)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("note", offsetClass, toneClass, className)}
    >
      {prefix && (
        <span className="mr-1 font-mono text-[11px] not-italic text-[var(--fg-faint)]">
          {prefix}
        </span>
      )}
      {children}
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";
import { personalityAnnotations } from "@/lib/data";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  warm: "text-[var(--accent)]",
  wry: "text-[var(--syntax-str)]",
  quiet: "text-[var(--fg-mute)]",
};

interface CodeAnnotationProps {
  id: string;
  className?: string;
  variant?: "inline" | "block";
  align?: "left" | "right";
  style?: "code" | "handwritten";
}

/**
 * Code annotation — owner-style note pinned near a cell.
 * Two visual styles: code (italic mono with `#`) or handwritten (display italic).
 */
export function CodeAnnotation({
  id,
  className,
  variant = "inline",
  align = "right",
  style = "code",
}: CodeAnnotationProps) {
  const note = personalityAnnotations.find((p) => p.id === id);
  if (!note) return null;
  const cls = toneClass[note.tone ?? "quiet"] ?? "text-[var(--fg-mute)]";

  if (style === "handwritten") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn("annotation-handwritten", className)}
      >
        {note.text}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? 6 : -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "annotation",
        cls,
        variant === "block" ? "block" : "inline-block",
        className
      )}
    >
      {note.text}
    </motion.div>
  );
}
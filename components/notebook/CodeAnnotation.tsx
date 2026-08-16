"use client";

import { motion } from "framer-motion";
import { personalityAnnotations } from "@/lib/data";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  warm: "text-amber-300/80",
  wry: "text-emerald-300/80",
  quiet: "text-zinc-500",
};

interface CodeAnnotationProps {
  id: string;
  className?: string;
  variant?: "inline" | "block";
  align?: "left" | "right";
}

export function CodeAnnotation({ id, className, variant = "inline", align = "right" }: CodeAnnotationProps) {
  const note = personalityAnnotations.find((p) => p.id === id);
  if (!note) return null;
  const cls = toneClass[note.tone ?? "quiet"] ?? "text-zinc-500";
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? 6 : -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "font-mono text-[11px] italic",
        cls,
        variant === "block" ? "block" : "inline-block",
        className
      )}
    >
      <span className="text-zinc-600"># </span>
      {note.text}
    </motion.div>
  );
}

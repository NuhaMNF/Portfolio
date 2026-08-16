"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="relative mx-auto my-6 max-w-[1320px] px-6 lg:px-12 pointer-events-none select-none">
      <div className="relative flex items-center justify-center">
        {/* Ambient Subtle Center Glow */}
        <div className="absolute h-10 w-48 rounded-full bg-[var(--accent)]/5 blur-xl" />
        {/* Soft Tapered Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--rule)] to-transparent" />
        {/* Center Pip */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="absolute h-1.5 w-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--surface-2)] shadow-[0_0_8px_var(--accent-glow)]"
        />
      </div>
    </div>
  );
}

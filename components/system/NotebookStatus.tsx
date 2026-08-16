"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { KeyGlowPicker } from "@/components/ui/KeyGlowPicker";

/**
 * Top-right control bar: Key Glow Gradient Color Picker & Theme Toggle.
 */
export function NotebookStatus() {
  return (
    <div className="fixed right-4 sm:right-6 md:right-8 top-3.5 sm:top-4 md:top-5 z-40 flex items-center gap-2.5 sm:gap-3 select-none">
      <KeyGlowPicker />
      <ThemeToggle variant="pill" />
    </div>
  );
}

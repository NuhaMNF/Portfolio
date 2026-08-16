"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { KeyGlowPicker } from "@/components/ui/KeyGlowPicker";
import { BackgroundModeToggle } from "@/components/ui/BackgroundModeToggle";
import { SoundToggle } from "@/components/ui/SoundToggle";

/**
 * Top-right control bar: Background Mode Toggle, Key Glow Color Picker, Sound Toggle & Theme Toggle.
 */
export function NotebookStatus() {
  return (
    <div className="fixed right-4 sm:right-6 md:right-8 top-3.5 sm:top-4 md:top-5 z-40 flex items-center gap-2 sm:gap-2.5 select-none">
      <div className="hidden items-center gap-2 sm:gap-2.5 md:flex">
        <BackgroundModeToggle />
        <KeyGlowPicker />
        <SoundToggle variant="pill" />
      </div>
      <ThemeToggle variant="pill" />
    </div>
  );
}

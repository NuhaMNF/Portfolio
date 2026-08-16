"use client";

import { useSound } from "@/lib/sound";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle({ variant = "icon" }: { variant?: "icon" | "pill" }) {
  const { isMuted, toggleSound } = useSound();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleSound}
        data-cursor="view"
        title={isMuted ? "Unmute Sound Effects (M)" : "Mute Sound Effects (M)"}
        className="liquid-glass inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] bg-[var(--surface)]/80 px-2.5 py-1 font-mono text-[10.5px] text-[var(--fg-mute)] hover:text-[var(--fg)] backdrop-blur-md transition-colors shadow-xs select-none"
      >
        {isMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 text-[var(--fg-faint)]" />
            <span className="hidden sm:inline uppercase tracking-wider text-[9.5px]">Muted</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline uppercase tracking-wider text-[9.5px]">Audio</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleSound}
      data-cursor="view"
      title={isMuted ? "Unmute Sound Effects (M)" : "Mute Sound Effects (M)"}
      className={`btn-glass flex h-7 w-7 items-center justify-center rounded-lg transition-colors shadow-xs select-none ${
        isMuted
          ? "text-[var(--fg-faint)]"
          : "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/10"
      }`}
    >
      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}

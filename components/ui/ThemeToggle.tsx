"use client";

import { useTheme } from "@/lib/hooks/useTheme";
import { toggleStoredTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSwitch } from "@/lib/sound";

interface ThemeToggleProps {
  compact?: boolean;
  variant?: "default" | "pill" | "icon-only" | "badge";
  className?: string;
}

export function ThemeToggle({
  compact = false,
  variant = "default",
  className,
}: ThemeToggleProps) {
  const theme = useTheme();
  const isLight = theme === "light";
  const label = isLight ? "light" : "dark";
  const nextLabel = isLight ? "dark" : "light";

  if (variant === "pill") {
    return (
      <button
        type="button"
        data-cursor="view"
        onClick={() => {
          playSwitch();
          toggleStoredTheme();
        }}
        aria-label={`Switch to ${nextLabel} mode (Press T)`}
        title={`Toggle theme (${nextLabel} mode) · Shortcut: T`}
        className={cn(
          "btn-glass group relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] text-[var(--fg-soft)] transition-all duration-200 hover:text-[var(--fg)] hover:border-[var(--accent)]/50 shadow-xs backdrop-blur-md",
          className
        )}
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-center text-[var(--accent)] transition-transform duration-300 group-hover:rotate-45">
          {isLight ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="uppercase tracking-[0.16em] text-[10px] font-medium text-[var(--fg-mute)] group-hover:text-[var(--fg-soft)]">
          {label}
        </span>
        <span
          aria-hidden
          className="relative inline-flex h-3 w-5.5 items-center rounded-full bg-[var(--rule)]/80 p-0.5"
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full bg-[var(--accent)] transition-transform duration-200",
              isLight ? "translate-x-2.5" : "translate-x-0"
            )}
          />
        </span>
        <span className="hidden sm:inline-block text-[9px] text-[var(--fg-faint)] font-mono opacity-60 group-hover:opacity-100">
          [T]
        </span>
      </button>
    );
  }

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        data-cursor="view"
        onClick={() => {
          playSwitch();
          toggleStoredTheme();
        }}
        aria-label={`Switch to ${nextLabel} mode (Press T)`}
        title={`Switch to ${nextLabel} mode (Press T)`}
        className={cn(
          "btn-glass group relative inline-flex h-6.5 w-6.5 items-center justify-center rounded-md text-[var(--fg-mute)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]/50",
          className
        )}
      >
        {isLight ? (
          <Sun className="h-3.5 w-3.5 text-[var(--accent)] transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-[var(--accent)] transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-cursor="view"
      onClick={() => {
        playSwitch();
        toggleStoredTheme();
      }}
      aria-label={`Switch to ${nextLabel} mode (Press T)`}
      title={`Toggle theme · Shortcut: T`}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-mute)] transition-colors hover:text-[var(--accent)]",
        className
      )}
    >
      <span
        aria-hidden
        className="btn-glass relative inline-flex h-3.5 w-6 items-center rounded-full"
      >
        <span
          className={cn(
            "absolute h-2 w-2 rounded-full bg-[var(--accent)] transition-transform duration-300",
            isLight ? "translate-x-[11px]" : "translate-x-[3px]"
          )}
        />
      </span>
      {!compact && <span>theme · {label}</span>}
      {compact && <span>{label}</span>}
    </button>
  );
}

"use client";

import { motion } from "framer-motion";
import { useKeyGradient } from "@/lib/keyGradients";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSelect } from "@/lib/sound";

interface KeyGlowPickerProps {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
}

export function KeyGlowPicker({
  className,
  compact = false,
  showLabel = true,
}: KeyGlowPickerProps) {
  const { currentId, setGradient, presets, preset: activePreset } = useKeyGradient();

  return (
    <div
      className={cn(
        "btn-glass inline-flex items-center gap-3 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-sm transition-all select-none",
        compact && "px-2.5 py-1 gap-2",
        className
      )}
    >
      {showLabel && (
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
          <span className="hidden sm:inline">glow</span>
        </div>
      )}

      {/* 5 Swatches */}
      <div className="flex items-center gap-2">
        {presets.map((p, idx) => {
          const isSelected = p.id === currentId;
          return (
            <button
              key={p.id}
              type="button"
              data-cursor="run"
              onClick={() => {
                playSelect(idx);
                setGradient(p.id);
              }}
              aria-label={`Select ${p.name} glow preset (${p.tag})`}
              title={`${p.name} · ${p.tag}\n${p.description}`}
              className={cn(
                "group relative flex h-4.5 w-4.5 items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 focus:outline-hidden",
                compact && "h-3.5 w-3.5"
              )}
            >
              {/* Active Ring Animation */}
              {isSelected && (
                <motion.span
                  layoutId="active-key-swatch"
                  className="absolute -inset-1 rounded-full border border-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              {/* Color Swatch Circle */}
              <span
                style={{ background: p.preview }}
                className={cn(
                  "relative block h-full w-full rounded-full border border-black/20 shadow-xs transition-opacity",
                  !isSelected && "opacity-75 group-hover:opacity-100"
                )}
              />

              {/* Tiny check on selected */}
              {isSelected && (
                <Check className="absolute h-2.5 w-2.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Preset Tag */}
      {showLabel && (
        <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--fg-mute)] font-medium">
          {activePreset.name}
        </span>
      )}
    </div>
  );
}

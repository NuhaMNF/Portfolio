"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme, toggleStoredTheme } from "@/lib/theme";
import { getStoredBackgroundMode, setBackgroundMode } from "@/lib/backgroundMode";
import { isSoundMuted, setSoundMuted } from "@/lib/sound";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function ThemeController() {
  useEffect(() => {
    applyTheme(getStoredTheme());

    const onToggle = () => {
      toggleStoredTheme();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleStoredTheme();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        const cur = getStoredBackgroundMode();
        setBackgroundMode(cur === "boxes" ? "stars" : "boxes");
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setSoundMuted(!isSoundMuted());
      }
    };

    window.addEventListener("nuha:toggle-theme", onToggle);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("nuha:toggle-theme", onToggle);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}

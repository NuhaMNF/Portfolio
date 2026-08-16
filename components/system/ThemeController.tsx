"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme, toggleStoredTheme } from "@/lib/theme";

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
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      toggleStoredTheme();
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

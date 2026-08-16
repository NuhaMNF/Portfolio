"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type BackgroundMode = "boxes" | "stars";

export const BG_STORAGE_KEY = "nuha-bg-mode";
export const BG_EVENT = "nuha:bg-mode";

export function getStoredBackgroundMode(): BackgroundMode {
  if (typeof window === "undefined") return "stars";
  try {
    const v = localStorage.getItem(BG_STORAGE_KEY);
    if (v === "boxes" || v === "stars") return v;
  } catch {
    // ignore
  }
  return "stars";
}

export function setBackgroundMode(mode: BackgroundMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BG_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(BG_EVENT, { detail: mode }));
}

function subscribe(callback: () => void) {
  window.addEventListener(BG_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(BG_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBackgroundMode(): {
  mode: BackgroundMode;
  setMode: (mode: BackgroundMode) => void;
  toggleMode: () => void;
} {
  const [mounted, setMounted] = useState(false);
  const mode = useSyncExternalStore<BackgroundMode>(
    subscribe,
    getStoredBackgroundMode,
    () => "stars"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeMode: BackgroundMode = mounted ? mode : "stars";

  return {
    mode: activeMode,
    setMode: setBackgroundMode,
    toggleMode: () => {
      setBackgroundMode(activeMode === "boxes" ? "stars" : "boxes");
    },
  };
}

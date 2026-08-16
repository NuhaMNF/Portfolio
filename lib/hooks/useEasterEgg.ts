"use client";

import { useEffect, useState } from "react";

/**
 * Listens for hidden keyboard sequences typed anywhere.
 * Returns true if the sequence was just completed.
 */
export function useEasterEgg(sequence: string, onTrigger: () => void) {
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      buffer = (buffer + e.key).toLowerCase().slice(-sequence.length);
      if (buffer === sequence.toLowerCase()) {
        onTrigger();
        buffer = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sequence, onTrigger]);
}

/**
 * Tracks the most recent key sequence across the session.
 */
export function useKeyBuffer() {
  const [buffer, setBuffer] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      setBuffer((b) => (b + e.key).toLowerCase().slice(-40));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return buffer;
}

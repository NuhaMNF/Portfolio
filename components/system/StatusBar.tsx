"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Modern Bottom Telemetry Bar.
 */
export function StatusBar() {
  const [runtime, setRuntime] = useState("00:00");

  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      const sec = Math.floor((Date.now() - started) / 1000);
      const m = String(Math.floor(sec / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      setRuntime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar" role="status" aria-label="System status">
      <div className="status-bar-segment">
        <span className="state-dot state-dot--done" />
        <span>Nuha Nizar</span>
      </div>
      <div className="status-bar-segment">
        <span className="text-[var(--state-done)]">Status: Available</span>
      </div>
      <div className="status-bar-segment hidden sm:inline-flex">
        <span>Dept. of Industrial Management</span>
      </div>
      <div className="status-bar-segment hidden md:inline-flex">
        <span>Session: {runtime}</span>
      </div>
      <div className="status-bar-segment status-bar-segment--right">
        <ThemeToggle compact />
      </div>
      <div className="status-bar-segment">
        <span className="hidden sm:inline">Kelaniya, LK</span>
      </div>
    </div>
  );
}
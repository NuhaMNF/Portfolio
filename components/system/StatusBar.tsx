"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Bottom IDE-style status bar. Tracks kernel state, runtime, cell count.
 * Persistent visual element that sells the notebook concept.
 */
export function StatusBar() {
  const [cells, setCells] = useState(0);
  const [runtime, setRuntime] = useState("00:00");
  const [kernel, setKernel] = useState<"online" | "busy" | "idle">("online");

  // Listen for cell execution broadcasts
  useEffect(() => {
    const onExecute = () => setCells((c) => c + 1);
    const onBusy = () => setKernel("busy");
    const onIdle = () => setKernel("online");
    window.addEventListener("nuha:cell-executed", onExecute);
    window.addEventListener("nuha:kernel-busy", onBusy);
    window.addEventListener("nuha:kernel-idle", onIdle);
    return () => {
      window.removeEventListener("nuha:cell-executed", onExecute);
      window.removeEventListener("nuha:kernel-busy", onBusy);
      window.removeEventListener("nuha:kernel-idle", onIdle);
    };
  }, []);

  // Runtime ticker
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

  const kernelColor =
    kernel === "busy" ? "var(--state-running)" : kernel === "online" ? "var(--state-done)" : "var(--state-idle)";

  return (
    <div className="status-bar" role="status" aria-label="Notebook status">
      <div className="status-bar-segment">
        <span className="state-dot" style={{ background: kernelColor }} />
        <span>python 3.12</span>
      </div>
      <div className="status-bar-segment">
        <span style={{ color: kernelColor }}>kernel: {kernel}</span>
      </div>
      <div className="status-bar-segment hidden sm:inline-flex">
        <span>cells: {String(cells).padStart(2, "0")}</span>
      </div>
      <div className="status-bar-segment hidden md:inline-flex">
        <span>runtime: {runtime}</span>
      </div>
      <div className="status-bar-segment status-bar-segment--right">
        <ThemeToggle compact />
      </div>
      <div className="status-bar-segment">
        <span className="hidden sm:inline">utf-8</span>
      </div>
      <div className="status-bar-segment">
        <span>ln -1</span>
      </div>
      <div className="status-bar-segment">
        <span>col 1</span>
      </div>
    </div>
  );
}
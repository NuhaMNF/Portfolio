"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EPOCHS = 50;
const EPOCH_DURATION = 70;

/**
 * TrainingDashboard — refined training observation with precision feel.
 */
export function TrainingDashboard({ running }: { running: boolean }) {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.3);
  const [acc, setAcc] = useState(0.4);
  const [valAcc, setValAcc] = useState(0.38);

  useEffect(() => {
    if (!running) {
      setEpoch(0);
      setLoss(2.3);
      setAcc(0.4);
      setValAcc(0.38);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i > EPOCHS) {
        clearInterval(id);
        return;
      }
      setEpoch(i);
      const t = i / EPOCHS;
      setLoss(2.3 * Math.exp(-3 * t) + 0.05);
      setAcc(0.4 + (1 - Math.exp(-3 * t)) * 0.55);
      setValAcc(0.38 + (1 - Math.exp(-3.2 * t)) * 0.5);
    }, EPOCH_DURATION);
    return () => clearInterval(id);
  }, [running]);

  const points = Array.from({ length: EPOCHS }, (_, i) => {
    const t = i / EPOCHS;
    return { i, a: 0.4 + (1 - Math.exp(-3 * t)) * 0.55 };
  });
  const pathD = points
    .map((p, i) => {
      const x = (p.i / (EPOCHS - 1)) * 100;
      const y = 100 - p.a * 100;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="border border-[var(--rule)] bg-[var(--bg-deep)] p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        <span>fig. 03 — training dashboard</span>
        <span className={running ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}>
          {running ? "● training" : "idle"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
        <Tile label="epoch" value={`${epoch}/${EPOCHS}`} />
        <Tile label="loss" value={loss.toFixed(4)} tone="warm" />
        <Tile label="accuracy" value={acc.toFixed(4)} tone="green" />
        <Tile label="val_acc" value={valAcc.toFixed(4)} tone="soft" />
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          <span>epoch indicators</span>
          <span className="metric text-[var(--fg-mute)]">1-50</span>
        </div>
        <div className="grid grid-cols-10 gap-x-1.5 gap-y-2">
          {Array.from({ length: EPOCHS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="h-1 w-full bg-[var(--rule)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i < epoch ? "100%" : "0%" }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-[var(--accent)]"
                />
              </div>
              <span className="font-mono text-[8px] text-[var(--fg-faint)] metric">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          accuracy curve
        </div>
        <svg viewBox="0 0 100 100" className="h-32 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="accgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--rule)" strokeDasharray="1 3" />
          ))}
          <motion.path
            d={`${pathD} L100,100 L0,100 Z`}
            fill="url(#accgrad)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: running ? epoch / EPOCHS : 1 }}
            transition={{ duration: 0.6 }}
          />
        </svg>
      </div>

      <div className="mt-5 font-mono text-[11px] text-[var(--fg-mute)]">
        <span className="text-[var(--accent)]">{">"}</span> model converged. accuracy{" "}
        <span className="metric text-[var(--fg-soft)]">{acc.toFixed(4)}</span>
      </div>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: "warm" | "green" | "soft" }) {
  const color =
    tone === "warm"
      ? "text-[var(--accent)]"
      : tone === "green"
      ? "text-[var(--state-done)]"
      : tone === "soft"
      ? "text-[var(--fg-soft)]"
      : "text-[var(--fg)]";
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {label}
      </div>
      <div className={`metric mt-1 text-[26px] ${color}`}>{value}</div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EPOCHS = 50;
const EPOCH_DURATION = 80; // ms per epoch

export function TrainingEpochs({ running }: { running: boolean }) {
  const [epoch, setEpoch] = useState(0);
  const [acc, setAcc] = useState(0);
  const [loss, setLoss] = useState(2.3);

  useEffect(() => {
    if (!running) {
      setEpoch(0);
      setAcc(0);
      setLoss(2.3);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i > EPOCHS) {
        clearInterval(interval);
        return;
      }
      setEpoch(i);
      const t = i / EPOCHS;
      setAcc(0.4 + (1 - Math.exp(-3 * t)) * 0.55);
      setLoss(2.3 * Math.exp(-3 * t) + 0.05);
    }, EPOCH_DURATION);
    return () => clearInterval(interval);
  }, [running]);

  const points = Array.from({ length: EPOCHS }, (_, i) => {
    const t = i / EPOCHS;
    const a = 0.4 + (1 - Math.exp(-3 * t)) * 0.55;
    return { i, a };
  });
  const pathD = points
    .map((p, i) => {
      const x = (p.i / (EPOCHS - 1)) * 100;
      const y = 100 - p.a * 100;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-md border border-zinc-800/60 bg-[#0c0c0e] p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <span>training dashboard</span>
        <span className={running ? "text-emerald-300" : "text-zinc-500"}>
          {running ? "training" : "idle"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="epoch" value={`${epoch}/${EPOCHS}`} accent="amber" />
        <Tile label="loss" value={loss.toFixed(4)} accent="rose" />
        <Tile label="accuracy" value={acc.toFixed(4)} accent="emerald" />
        <Tile label="lr" value="3e-4" accent="sky" />
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[10px] text-zinc-500">epoch indicators</div>
        <div className="grid grid-cols-5 gap-1.5 md:grid-cols-10">
          {Array.from({ length: EPOCHS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i < epoch ? "100%" : "0%" }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-300"
                />
              </div>
              <span className="font-mono text-[8px] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[10px] text-zinc-500">accuracy curve</div>
        <svg viewBox="0 0 100 100" className="h-32 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="accgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeDasharray="1 3" />
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
            stroke="#fbbf24"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: running ? epoch / EPOCHS : 1 }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "amber" | "rose" | "emerald" | "sky";
}) {
  const color = {
    amber: "text-amber-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    sky: "text-sky-300",
  }[accent];
  return (
    <div className="rounded border border-zinc-800/60 bg-zinc-950/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className={`font-mono text-xl tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

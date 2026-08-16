"use client";

import { motion } from "framer-motion";

export function ProjectPreview({ id }: { id: string }) {
  switch (id) {
    case "lumen-rag":
      return <RAGGraph />;
    case "cetacea":
      return <Waveform />;
    case "tideline":
      return <Stream />;
    case "meridian":
      return <Scanner />;
    case "graphite":
      return <Tree />;
    default:
      return <RAGGraph />;
  }
}

function RAGGraph() {
  const nodes = [
    { x: 30, y: 130 },
    { x: 130, y: 60 },
    { x: 130, y: 200 },
    { x: 230, y: 130 },
    { x: 360, y: 130 },
  ];
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      <defs>
        <linearGradient id="rag-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <motion.line
            key={i}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke="url(#rag-stroke)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 8 : 6} fill={i === nodes.length - 1 ? "#fbbf24" : "#10b981"} />
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 16 : 12} fill="none" stroke={i === nodes.length - 1 ? "#fbbf24" : "#10b981"} opacity={0.25} />
        </motion.g>
      ))}
    </svg>
  );
}

function Waveform() {
  const bars = Array.from({ length: 40 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {bars.map((i) => {
        const x = i * 10 + 4;
        const h = 30 + Math.abs(Math.sin(i * 0.6)) * 140;
        return (
          <motion.rect
            key={i}
            x={x}
            y={130 - h / 2}
            width={4}
            height={h}
            fill="#10b981"
            opacity={0.7}
            animate={{ height: [h, h * 0.6, h], y: [130 - h / 2, 130 - h * 0.3, 130 - h / 2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
          />
        );
      })}
    </svg>
  );
}

function Stream() {
  const rows = Array.from({ length: 6 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {rows.map((row) => (
        <motion.g
          key={row}
          animate={{ x: [-20, 400] }}
          transition={{ duration: 4 + row * 0.4, repeat: Infinity, ease: "linear", delay: row * 0.2 }}
        >
          <rect x={0} y={40 + row * 36} width={60} height={20} rx={3} fill="#27272a" />
          <rect x={70} y={40 + row * 36} width={90} height={20} rx={3} fill="#10b981" opacity={0.4} />
          <rect x={170} y={40 + row * 36} width={70} height={20} rx={3} fill="#fbbf24" opacity={0.35} />
        </motion.g>
      ))}
    </svg>
  );
}

function Scanner() {
  const cells = Array.from({ length: 64 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {cells.map((i) => {
        const x = (i % 8) * 48 + 8;
        const y = Math.floor(i / 8) * 48 + 8;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={40}
            height={40}
            fill="none"
            stroke="#3f3f46"
            strokeWidth={1}
            animate={{ fill: ["rgba(16,185,129,0)", "rgba(251,191,36,0.4)", "rgba(16,185,129,0)"] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}

function Tree() {
  const lines = [
    { x1: 200, y1: 30, x2: 200, y2: 80 },
    { x1: 200, y1: 80, x2: 110, y2: 130 },
    { x1: 200, y1: 80, x2: 290, y2: 130 },
    { x1: 110, y1: 130, x2: 60, y2: 180 },
    { x1: 110, y1: 130, x2: 160, y2: 180 },
    { x1: 290, y1: 130, x2: 240, y2: 180 },
    { x1: 290, y1: 130, x2: 340, y2: 180 },
    { x1: 60, y1: 180, x2: 60, y2: 220 },
    { x1: 160, y1: 180, x2: 160, y2: 220 },
    { x1: 240, y1: 180, x2: 240, y2: 220 },
    { x1: 340, y1: 180, x2: 340, y2: 220 },
  ];
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#10b981"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      {[
        { x: 200, y: 30, big: true },
        { x: 110, y: 130 }, { x: 290, y: 130 },
        { x: 60, y: 180 }, { x: 160, y: 180 }, { x: 240, y: 180 }, { x: 340, y: 180 },
        { x: 60, y: 220 }, { x: 160, y: 220 }, { x: 240, y: 220 }, { x: 340, y: 220 },
      ].map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.big ? 6 : 4}
          fill={n.big ? "#fbbf24" : "#10b981"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}

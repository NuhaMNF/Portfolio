"use client";

import { motion } from "framer-motion";
import { Plane, Database, Cpu, CheckSquare, Layers, Activity } from "lucide-react";

export function ProjectPreview({ id }: { id: string }) {
  switch (id) {
    case "flight-booking":
      return <FlightBookingDiagram />;
    case "game-coding":
      return <GameEngineDiagram />;
    case "task-management":
      return <TaskKanbanDiagram />;
    default:
      return <FlightBookingDiagram />;
  }
}

/**
 * ✈️ Flight Booking System Preview Diagram
 */
function FlightBookingDiagram() {
  const routes = [
    { from: { x: 50, y: 70, label: "CMB" }, to: { x: 200, y: 130, label: "SIN" } },
    { from: { x: 200, y: 130, label: "SIN" }, to: { x: 350, y: 60, label: "LHR" } },
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-[var(--surface)]/90 p-5 font-mono select-none">
      {/* Top Telemetry */}
      <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5 text-[10px] text-[var(--fg-faint)]">
        <span className="flex items-center gap-1.5 text-[var(--accent)] font-medium">
          <Plane className="h-3.5 w-3.5" />
          <span>FLIGHT_DISPATCH_v2.5</span>
        </span>
        <span className="text-[var(--state-done)]">● SYSTEM ONLINE</span>
      </div>

      {/* SVG Flight Routes & Radar */}
      <div className="relative my-auto h-[140px] w-full">
        <svg viewBox="0 0 400 160" className="h-full w-full">
          {/* Grid lines */}
          <line x1="0" y1="40" x2="400" y2="40" stroke="var(--rule)" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="400" y2="80" stroke="var(--rule)" strokeDasharray="3 3" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="var(--rule)" strokeDasharray="3 3" />

          {/* Curved trajectory path */}
          <path
            d="M 50 110 Q 125 30 200 80 T 350 50"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animated Flight Pulse */}
          <motion.circle
            r="4"
            fill="var(--accent)"
            animate={{
              cx: [50, 200, 350],
              cy: [110, 80, 50],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Airport Node CMB */}
          <g transform="translate(50, 110)">
            <circle r="6" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2" />
            <text y="20" textAnchor="middle" fill="var(--fg)" fontSize="10" fontWeight="bold">
              CMB
            </text>
          </g>

          {/* Airport Node SIN */}
          <g transform="translate(200, 80)">
            <circle r="6" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2" />
            <text y="20" textAnchor="middle" fill="var(--fg)" fontSize="10" fontWeight="bold">
              SIN
            </text>
          </g>

          {/* Airport Node LHR */}
          <g transform="translate(350, 50)">
            <circle r="6" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="2" />
            <text y="20" textAnchor="middle" fill="var(--fg)" fontSize="10" fontWeight="bold">
              LHR
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom MySQL Query Pipeline Badge */}
      <div className="flex items-center justify-between rounded border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-1.5 text-[10px] text-[var(--fg-mute)]">
        <span className="flex items-center gap-1.5">
          <Database className="h-3 w-3 text-[var(--accent)]" />
          <span>MySQL Transaction: OK</span>
        </span>
        <span className="text-[var(--accent)]">SeatAllocation [OOP]</span>
      </div>
    </div>
  );
}

/**
 * 🎮 Game Coding Enhancement Preview Diagram
 */
function GameEngineDiagram() {
  const cells = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-[var(--surface)]/90 p-5 font-mono select-none">
      {/* Top Telemetry */}
      <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5 text-[10px] text-[var(--fg-faint)]">
        <span className="flex items-center gap-1.5 text-[var(--accent)] font-medium">
          <Cpu className="h-3.5 w-3.5" />
          <span>C++ ENGINE LOOP · 60.0 FPS</span>
        </span>
        <span className="text-[var(--state-done)]">● MEMORY CLEAN</span>
      </div>

      {/* Grid & Entity Component Scanner */}
      <div className="my-auto grid grid-cols-6 gap-2">
        {cells.map((i) => (
          <motion.div
            key={i}
            className="flex h-10 items-center justify-center rounded border border-[var(--rule)] bg-[var(--surface-2)]/50 text-[10px] text-[var(--fg-faint)]"
            animate={{
              borderColor: [
                "var(--rule)",
                i % 3 === 0 ? "var(--accent)" : "var(--rule)",
                "var(--rule)",
              ],
              backgroundColor: [
                "rgba(0,0,0,0)",
                i % 3 === 0 ? "var(--accent-glow)" : "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 2.4,
              delay: (i % 6) * 0.18 + Math.floor(i / 6) * 0.25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            0x{i.toString(16).toUpperCase()}
          </motion.div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between rounded border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-1.5 text-[10px] text-[var(--fg-mute)]">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-[var(--accent)]" />
          <span>OOP Polymorphism & Collision</span>
        </span>
        <span className="text-[var(--state-done)]">0.4ms tick</span>
      </div>
    </div>
  );
}

/**
 * 📋 Task Management System Preview Diagram
 */
function TaskKanbanDiagram() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-[var(--surface)]/90 p-5 font-mono select-none">
      {/* Top Telemetry */}
      <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5 text-[10px] text-[var(--fg-faint)]">
        <span className="flex items-center gap-1.5 text-[var(--accent)] font-medium">
          <CheckSquare className="h-3.5 w-3.5" />
          <span>REACT + NODE + POSTGRES</span>
        </span>
        <span className="text-[var(--state-done)]">● REST API 200</span>
      </div>

      {/* Mini Kanban Columns */}
      <div className="my-auto grid grid-cols-3 gap-2.5">
        {/* Column 1: Backlog */}
        <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-2">
          <div className="text-[9px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">Backlog</div>
          <div className="space-y-1.5">
            <div className="rounded bg-[var(--surface)] p-2 text-[10px] text-[var(--fg-soft)] border border-[var(--rule-soft)] shadow-xs">
              Auth Guard
            </div>
            <div className="rounded bg-[var(--surface)] p-2 text-[10px] text-[var(--fg-mute)] border border-[var(--rule-soft)]">
              API Docs
            </div>
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-2">
          <div className="text-[9px] uppercase tracking-wider text-[var(--accent)] font-medium mb-2">In Progress</div>
          <div className="space-y-1.5">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded bg-[var(--surface)] p-2 text-[10px] text-[var(--fg)] border border-[var(--accent)]/50 shadow-xs"
            >
              Task Board Sync
            </motion.div>
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-2">
          <div className="text-[9px] uppercase tracking-wider text-[var(--state-done)] font-medium mb-2">Done</div>
          <div className="space-y-1.5">
            <div className="rounded bg-[var(--surface)] p-2 text-[10px] text-[var(--fg-mute)] line-through border border-[var(--rule-soft)]">
              PostgreSQL Schema
            </div>
            <div className="rounded bg-[var(--surface)] p-2 text-[10px] text-[var(--fg-mute)] line-through border border-[var(--rule-soft)]">
              User CRUD
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between rounded border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-1.5 text-[10px] text-[var(--fg-mute)]">
        <span className="flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-[var(--accent)]" />
          <span>Real-time Workspace Sync</span>
        </span>
        <span className="text-[var(--accent)]">JWT Secure</span>
      </div>
    </div>
  );
}

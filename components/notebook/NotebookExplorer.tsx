"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionHistory } from "./ExecutionHistory";
import { profile } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Mail, Command, Sparkles, Menu, X, Clock, MapPin } from "lucide-react";
import { useBackgroundMode } from "@/lib/backgroundMode";

/**
 * 2-Layered Inset Floating Sidebar:
 * - Layer 1 (Outer Base Tray): Frosted glass chassis with rounded-3xl corners.
 * - Layer 2 (Inner Elevated Card): Raised floating panel nested inside with padding, bevel highlight, and shadow.
 */
export function NotebookExplorer() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const { mode, toggleMode } = useBackgroundMode();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Colombo",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP 2-LAYERED SIDEBAR                                  */}
      {/* ========================================================= */}
      <aside className="pointer-events-none fixed left-3 top-3 bottom-3 z-30 hidden w-[268px] lg:block">
        {/* LAYER 1: Outer Frosted Base Tray */}
        <div className="pointer-events-auto relative flex h-full w-full flex-col rounded-3xl border border-[var(--rule)] bg-[var(--surface)]/45 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5">
          {/* Subtle Ambient Backing Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[var(--accent)]/15 blur-3xl"
          />

          {/* LAYER 2: Inner Raised / Elevated Content Layer (One Layer Above) */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)]/90 p-4 shadow-lg backdrop-blur-xl ring-1 ring-white/15 dark:ring-white/10">
            {/* Top Bevel Glass Highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/15"
            />

            {/* Top Identity Section */}
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Orbital Gyro Monogram */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                  {/* Rotating orbital ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-[var(--accent)]/50"
                  />
                  {/* Planetary orbiting satellite node */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-start justify-center"
                  >
                    <span className="h-2 w-2 -mt-1 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  </motion.div>

                  {/* Core Initials Monogram */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] font-mono text-[12px] font-bold text-[var(--accent)] shadow-xs">
                    {profile.initials}
                  </div>
                </div>

                {/* Profile Name & Role */}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[15.5px] font-medium tracking-tight text-[var(--fg)]">
                    {profile.name}
                  </div>
                  <div className="truncate font-mono text-[10px] text-[var(--accent)] font-medium">
                    Management & IT
                  </div>
                </div>
              </div>

              {/* Status & University Telemetry */}
              <div className="flex items-center justify-between rounded-lg border border-[var(--rule-soft)] bg-[var(--surface)]/70 px-2.5 py-1.5 font-mono text-[9.5px]">
                <span className="flex items-center gap-1 text-[var(--fg-faint)]">
                  <MapPin className="h-2.5 w-2.5 text-[var(--accent)]" />
                  <span>Kelaniya, LK</span>
                </span>
                <span className="flex items-center gap-1.5 text-[var(--state-done)] font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--state-done)] animate-pulse" />
                  <span>Available</span>
                </span>
              </div>
            </div>

            {/* Middle Sitemap Navigation Spine */}
            <div className="relative z-10 my-3 min-h-0 flex-1 overflow-y-auto pr-0.5">
              <ExecutionHistory />
            </div>

            {/* Bottom Real-time Telemetry & Quick Action Dock */}
            <div className="relative z-10 space-y-2.5 border-t border-[var(--rule-soft)] pt-3 font-mono text-[10px]">
              {/* Live Clock & Background Mode Switcher */}
              <div className="flex items-center justify-between rounded-lg border border-[var(--rule-soft)] bg-[var(--surface)]/60 px-2.5 py-1.5 text-[var(--fg-faint)]">
                <span className="flex items-center gap-1.5 text-[var(--fg-mute)]">
                  <Clock className="h-3 w-3 text-[var(--accent)]" />
                  <span className="tabular-nums font-medium text-[var(--fg)]">{time || "21:48:00"}</span>
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  title="Toggle Starfield / Grid (B)"
                  data-cursor="view"
                  className="flex items-center gap-1 rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[var(--accent)] hover:text-[var(--fg)] transition-colors border border-[var(--rule-soft)] shadow-2xs"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{mode === "stars" ? "Stars" : "Grid"}</span>
                </button>
              </div>

              {/* Social Action Triggers */}
              <div className="flex items-center justify-between gap-1.5">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                  title="GitHub Profile"
                  className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)] hover:text-[var(--fg)] transition-colors shadow-xs"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                  title="LinkedIn Profile"
                  className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)] hover:text-[var(--fg)] transition-colors shadow-xs"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="view"
                  title="Email Nuha"
                  className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)] hover:text-[var(--fg)] transition-colors shadow-xs"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE FLOATING TRIGGER & 2-LAYER DRAWER                  */}
      {/* ========================================================= */}
      <div className="fixed left-3 top-3 z-40 lg:hidden pointer-events-none">
        <button
          onClick={() => setOpen(true)}
          className="btn-glass pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)]/90 px-3.5 py-1.5 font-mono text-[11.5px] text-[var(--fg)] shadow-xl backdrop-blur-md"
          aria-label="Open Navigation"
        >
          <Menu className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>{profile.name}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 p-3 backdrop-blur-sm lg:hidden flex"
            onClick={() => setOpen(false)}
          >
            {/* Outer Mobile Base Layer */}
            <motion.div
              initial={{ x: -280, scale: 0.96 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ x: -280, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-full w-[285px] max-w-[88vw] flex-col rounded-3xl border border-[var(--rule)] bg-[var(--surface)]/50 p-2 shadow-2xl backdrop-blur-2xl"
            >
              {/* Inner Mobile Elevated Layer */}
              <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)]/90 p-4 shadow-lg backdrop-blur-xl">
                {/* Top Header */}
                <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface)] font-mono text-[11px] font-bold text-[var(--accent)] shadow-xs">
                      {profile.initials}
                    </div>
                    <div>
                      <div className="font-serif text-[14.5px] font-medium text-[var(--fg)]">
                        {profile.name}
                      </div>
                      <div className="font-mono text-[9.5px] text-[var(--fg-mute)]">
                        Management & IT
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn-glass flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-mute)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Sitemap Tree */}
                <div className="my-3 min-h-0 flex-1 overflow-y-auto pr-0.5">
                  <ExecutionHistory onNavigate={() => setOpen(false)} />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-[var(--rule-soft)] pt-3 font-mono text-[11px]">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)]"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)]"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="btn-glass flex h-8 flex-1 items-center justify-center rounded-lg text-[var(--fg-mute)]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
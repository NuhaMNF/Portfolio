"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  Compass,
  User,
  Activity,
  FolderGit2,
  GraduationCap,
  Trophy,
  Send,
  type LucideIcon,
} from "lucide-react";

interface ExecutionHistoryProps {
  onNavigate?: () => void;
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  hero: Compass,
  about: User,
  skills: Activity,
  projects: FolderGit2,
  education: GraduationCap,
  achievements: Trophy,
  contact: Send,
};

export function ExecutionHistory({ onNavigate }: ExecutionHistoryProps) {
  const { index: activeIndex } = useActiveSection();
  const reduced = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const [, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const current = nav.querySelector<HTMLElement>('[aria-current="location"]');
    const parent = nav.closest<HTMLElement>(".overflow-y-auto");
    if (!current || !parent) return;
    const p = parent.getBoundingClientRect();
    const r = current.getBoundingClientRect();
    if (r.top < p.top) parent.scrollTop -= p.top - r.top + 10;
    else if (r.bottom > p.bottom) parent.scrollTop += r.bottom - p.bottom + 10;
  }, [activeIndex]);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    onNavigate?.();
  };

  const progressPercent = Math.round(
    ((activeIndex + 1) / navItems.length) * 100
  );

  return (
    <div className="flex flex-col">
      {/* Top Header & Micro Segmented Progress Track */}
      <div className="mb-3 px-0.5">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
            Sitemap
          </span>
          <span className="metric font-semibold text-[var(--fg-mute)]">
            <span className="text-[var(--accent)] font-bold">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[var(--fg-faint)]">/</span>
            <span>{String(navItems.length).padStart(2, "0")}</span>
            <span className="ml-1.5 text-[8.5px] text-[var(--accent)]/80">
              ({progressPercent}%)
            </span>
          </span>
        </div>

        {/* Luminous Segmented Track */}
        <div className="mt-2 flex h-[3px] w-full gap-1 overflow-hidden rounded-full bg-[var(--surface)] p-[0.5px]">
          {navItems.map((_, idx) => {
            const isCompleted = idx <= activeIndex;
            return (
              <motion.div
                key={idx}
                className="h-full flex-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? "var(--accent)"
                    : "var(--rule)",
                  boxShadow:
                    idx === activeIndex
                      ? "0 0 6px var(--accent)"
                      : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Tree: Clean Minimalist Pills (No vertical line) */}
      <nav
        ref={navRef}
        aria-label="Sections navigation"
        className="relative select-none py-1"
      >
        <ol className="relative m-0 flex list-none flex-col gap-1 p-0">
          {navItems.map((item, i) => {
            const isActive = i === activeIndex;
            const isPassed = i < activeIndex;
            const Icon = SECTION_ICONS[item.id] || Compass;

            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={onClick(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-current={isActive ? "location" : undefined}
                  data-cursor="view"
                  className={cn(
                    "group relative flex min-h-[36px] items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200",
                    isActive
                      ? "text-[var(--fg)] font-medium bg-[var(--surface)] shadow-xs border border-[var(--accent)]/40"
                      : isPassed
                      ? "text-[var(--fg-soft)] hover:text-[var(--fg)] hover:bg-[var(--surface)]/60"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg-soft)] hover:bg-[var(--surface)]/30"
                  )}
                >
                  {/* Left Section Icon */}
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 transition-all duration-200",
                        isActive
                          ? "text-[var(--accent)] scale-110"
                          : isPassed
                          ? "text-[var(--fg-soft)]"
                          : "text-[var(--fg-faint)] group-hover:text-[var(--fg-mute)]"
                      )}
                    />
                  </span>

                  {/* Number coordinate */}
                  <span
                    className={cn(
                      "font-mono text-[10.5px] tabular-nums transition-colors duration-150",
                      isActive
                        ? "font-bold text-[var(--accent)]"
                        : isPassed
                        ? "text-[var(--fg-soft)] font-medium"
                        : "text-[var(--fg-faint)]"
                    )}
                  >
                    {item.cellId}
                  </span>

                  {/* Section Label */}
                  <span
                    className={cn(
                      "flex-1 truncate font-mono text-[11.5px] capitalize tracking-tight transition-colors duration-150",
                      isActive
                        ? "text-[var(--fg)] font-semibold"
                        : "text-[var(--fg-mute)] group-hover:text-[var(--fg)]"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Right Kinetic Wave for Active Item */}
                  {isActive && (
                    <span className="flex items-center gap-0.5 pr-0.5">
                      <motion.span
                        animate={{ height: [3, 10, 4, 12, 3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "easeInOut",
                        }}
                        className="w-[1.5px] rounded-full bg-[var(--accent)]"
                      />
                      <motion.span
                        animate={{ height: [8, 3, 12, 6, 8] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "easeInOut",
                          delay: 0.15,
                        }}
                        className="w-[1.5px] rounded-full bg-[var(--accent)]"
                      />
                      <motion.span
                        animate={{ height: [4, 12, 3, 9, 4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "easeInOut",
                          delay: 0.3,
                        }}
                        className="w-[1.5px] rounded-full bg-[var(--accent)]"
                      />
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

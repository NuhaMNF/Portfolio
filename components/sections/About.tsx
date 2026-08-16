"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { ServiceParticles } from "@/components/ui/ServiceParticles";
import { PlusField } from "@/components/ui/PlusField";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/hooks/useTheme";

const focuses = [
  {
    id: "01",
    title: "Data Analysis",
    description:
      "Turning messy operational records into structured tables, queries, and decisions you can act on.",
    href: "#skills",
  },
  {
    id: "02",
    title: "Software Development",
    description:
      "Building web apps in Java, C++, React, and Node with a clear object-oriented structure.",
    href: "#projects",
  },
  {
    id: "03",
    title: "Database Systems",
    description:
      "Designing MySQL and PostgreSQL schemas with normalization and referential integrity.",
    href: "#projects",
  },
  {
    id: "04",
    title: "Business & Management",
    description:
      "Connecting management insight with technical work so the software matches how a team actually operates.",
    href: "#education",
  },
  {
    id: "05",
    title: "Technology & Innovation",
    description:
      "Top 10 at IdeaSprint and Trinova — taking a problem from pitch to a working prototype.",
    href: "#achievements",
  },
];

function FocusTitle({ title }: { title: string }) {
  const amp = title.indexOf(" & ");
  if (amp > 0) {
    return (
      <>
        <span>{title.slice(0, amp)}</span>{" "}
        <span className="text-[var(--fg-soft)]">& {title.slice(amp + 3)}</span>
      </>
    );
  }
  return <span>{title}</span>;
}

export function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const theme = useTheme();
  const light = theme === "light";
  const active = focuses[activeIndex]!;

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % focuses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <section id="about" className="relative w-full bg-transparent overflow-hidden">
      <div className="flex min-h-[85vh] overflow-hidden bg-transparent py-10 md:py-14">
        <PlusField />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-[var(--rule)]" />

        <div className="relative mx-auto flex h-full w-full max-w-[1320px] min-h-0">
          <div className="pointer-events-none absolute inset-0 z-0 bg-transparent opacity-50 md:left-[56%] md:opacity-100">
            <Canvas
              className="!bg-transparent"
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 16], fov: 45 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.setClearColor("#000000", 0);
              }}
            >
              <ambientLight intensity={0.4} />
              <ServiceParticles activeIndex={activeIndex} light={light} />
            </Canvas>
            <div className="absolute top-[48%] left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
          </div>

          <div className="relative z-10 flex h-full min-h-0 w-full flex-col justify-between px-6 py-10 sm:py-12 md:w-[56%] md:py-14 lg:px-12">
            <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>02 / About</span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  <h2 className="font-serif max-w-xl text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] tracking-[-0.025em] text-[var(--fg)]">
                    <FocusTitle title={active.title} />
                  </h2>
                  <p className="max-w-xl text-[15px] leading-relaxed text-[var(--fg-soft)] sm:text-base">
                    {active.description}
                  </p>
                  <div>
                    <a
                      href={active.href}
                      data-cursor="view"
                      className="group mt-1 inline-flex min-h-11 items-center gap-3 rounded-full border border-[var(--rule)] px-6 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--fg)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full shrink-0 border-t border-[var(--rule)]">
              {focuses.map((focus, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    data-cursor="view"
                    className={cn(
                      "group flex min-h-11 w-full items-center gap-4 border-b border-[var(--rule)] py-3 text-left transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-75",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 sm:text-xs",
                        isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]",
                      )}
                    >
                      {focus.id}
                    </span>
                    <span
                      className={cn(
                        "text-[15px] font-medium tracking-[-0.015em] transition-all duration-300 sm:text-base",
                        isActive
                          ? "translate-x-2 text-[var(--fg)]"
                          : "text-[var(--fg-mute)] group-hover:translate-x-1",
                      )}
                    >
                      {focus.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

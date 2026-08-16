"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * THINKING — the methodology section.
 * Interactive flow: PROBLEM → QUESTION → RESEARCH → EXPERIMENT → BUILD → ITERATE.
 * Hover reveals a notebook note.
 */

const stages = [
  {
    key: "problem",
    title: "Problem",
    note: "Where it starts. Usually a sentence on a paper napkin or 2am thought.",
  },
  {
    key: "question",
    title: "Question",
    note: "Distill the problem into a question that can actually be falsified.",
  },
  {
    key: "research",
    title: "Research",
    note: "Read the prior art. Trace the references backward until the math starts to matter.",
  },
  {
    key: "experiment",
    title: "Experiment",
    note: "Smallest runnable form. Get something failing first — then iterate.",
  },
  {
    key: "build",
    title: "Build",
    note: "Turn the experiment into something a real user can touch. Polish the seams.",
  },
  {
    key: "iterate",
    title: "Iterate",
    note: "Read the data, talk to the people using it, and start over with better questions.",
  },
];

export function Thinking() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="thinking" className="relative px-6 py-32 md:py-40 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-16 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
          <span>In</span>
          <span>[</span>
          <span className="metric text-[var(--accent)]">03.5</span>
          <span>]</span>
          <span className="ml-2 text-[var(--fg-faint)]">·</span>
          <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
            how I think
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="display text-[clamp(48px,6vw,84px)] leading-[0.92] tracking-[-0.04em] text-[var(--fg)]">
              An <span className="display-italic">engineer&apos;s</span> way
              <br />
              of working.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.65] text-[var(--fg-mute)]">
              A small loop I keep returning to — usually starting on paper, ending in production.
              Hover any stage to read the notebook note.
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline */}
            <ol className="space-y-0">
              {stages.map((s, i) => {
                const isActive = active === s.key;
                const isLast = i === stages.length - 1;
                return (
                  <li
                    key={s.key}
                    className="relative"
                    onMouseEnter={() => setActive(s.key)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      data-cursor="view"
                      className={cn(
                        "group relative flex w-full items-baseline gap-6 border-t border-[var(--rule)] py-6 text-left transition-colors duration-500",
                        isLast && "border-b"
                      )}
                    >
                      <span
                        className={cn(
                          "metric w-12 text-[12px]",
                          isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          "display flex-1 text-[clamp(28px,3vw,40px)] leading-[1] tracking-[-0.02em] transition-colors duration-500",
                          isActive ? "text-[var(--fg)]" : "text-[var(--fg-soft)]"
                        )}
                      >
                        {s.title}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          x: isActive ? 0 : 8,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden max-w-xs text-[13px] italic text-[var(--fg-mute)] md:block"
                      >
                        {s.note}
                      </motion.span>
                      <span
                        className={cn(
                          "font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-500",
                          isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                        )}
                      >
                        →
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
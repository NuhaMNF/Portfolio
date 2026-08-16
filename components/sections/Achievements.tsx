"use client";

import { motion } from "framer-motion";
import { achievements } from "@/lib/data";
import { Trophy, Award, Sparkles } from "lucide-react";

export function Achievements() {
  return (
    <section id="achievements" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>06 / Achievements</span>
        </div>

        {/* Heading */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Innovation honors & <span className="display-italic text-[var(--fg-soft)]">competitions</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Demonstrated creative problem-solving and rapid ideation in competitive hackathons and innovation challenges.
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {achievements.map((item, i) => (
            <motion.div
              key={item.event}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-7 md:p-8 backdrop-blur-xl shadow-lg transition-all hover:border-[var(--accent)]/40 hover:shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                      Finalist Award
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                  {String(i + 1).padStart(2, "0")} / 02
                </span>
              </div>

              <div className="mt-6">
                <h3 className="font-serif text-[clamp(24px,2.8vw,34px)] font-normal leading-[1.15] text-[var(--fg)]">
                  {item.title}
                </h3>
                <div className="mt-2 font-mono text-[13px] font-medium text-[var(--accent)]">
                  {item.event}
                </div>
                <div className="mt-1 font-mono text-[11.5px] text-[var(--fg-mute)]">
                  Organized by {item.org}
                </div>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-[var(--fg-soft)]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

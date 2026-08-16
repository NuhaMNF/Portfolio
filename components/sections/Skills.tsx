"use client";

import { CapabilityMap } from "@/components/visualizations/CapabilityMap";
import { KnowledgeAtlas } from "@/components/visualizations/KnowledgeAtlas";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>03 / Capabilities</span>
        </div>

        {/* Heading */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Technical fluency & <span className="display-italic text-[var(--fg-soft)]">management capabilities</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              An interconnected skillset spanning relational data architecture, full-stack software development, and innovation methodology.
            </p>
          </div>
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr]">
          <CapabilityMap />
          <KnowledgeAtlas />
        </div>

        {/* Full Inventory Matrix */}
        <div className="mt-10 rounded-xl border border-[var(--rule)] bg-[var(--surface)]/50 p-6 md:p-8">
          <div className="mb-6 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
            <span>// Complete Skill Inventory</span>
            <span className="metric text-[var(--accent)]">Structured by Domain</span>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group} className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-4">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                  {group}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[12px] text-[var(--fg-soft)] shadow-xs transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
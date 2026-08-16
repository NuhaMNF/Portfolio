"use client";

import { aboutBio } from "@/lib/data";
import { Database, Code2, LineChart } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>02 / About</span>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Bridging <span className="display-italic text-[var(--fg-soft)]">management insight</span> with data-driven decision making.
            </h2>
          </div>
          <div className="flex flex-col justify-end space-y-4">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              {aboutBio[0]}
            </p>
            <p className="text-[15px] leading-[1.7] text-[var(--fg-mute)]">
              {aboutBio[1]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SpotlightCard className="p-6 md:p-7 shadow-sm">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-[17px] font-medium text-[var(--fg)]">Data analysis</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Turning operational records into structured tables, queries, and decisions.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:p-7 shadow-sm">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-[17px] font-medium text-[var(--fg)]">Software</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Building web apps in Java, C++, React, and Node with a clear object-oriented structure.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:p-7 shadow-sm">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-[17px] font-medium text-[var(--fg)]">Databases</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Designing MySQL and PostgreSQL schemas with normalization and referential integrity.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

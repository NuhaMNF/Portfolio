"use client";

import { motion } from "framer-motion";
import { aboutBio, philosophy, stats } from "@/lib/data";
import { Database, Code2, LineChart } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>02 / About</span>
        </div>

        {/* Heading & Intro */}
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

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-6 md:p-7 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] mb-5">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-[17px] text-[var(--fg)]">Data Analysis & Insights</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Transforming raw relational data into actionable intelligence, structured schemas, and insightful dashboards for business decisions.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-6 md:p-7 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] mb-5">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-[17px] text-[var(--fg)]">Software Engineering</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Developing reliable applications in Java, C++, and modern web stacks (React.js, Node.js) with clean object-oriented architecture.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 p-6 md:p-7 backdrop-blur-md transition-all hover:border-[var(--accent)]/40 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] mb-5">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-[17px] text-[var(--fg)]">Database Systems</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
              Designing relational databases with MySQL and PostgreSQL, ensuring robust integrity, normalization, and performant querying.
            </p>
          </div>
        </div>

        {/* Competencies & Metrics Footer */}
        <div className="mt-12 rounded-xl border border-[var(--rule)] bg-[var(--surface)]/50 p-6 md:p-8">
          <div className="mb-6 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
            <span>// Core Focus Competencies</span>
            <span className="metric text-[var(--accent)]">5 domains</span>
          </div>

          <div className="space-y-4">
            {philosophy.map((p, i) => (
              <div key={p.label}>
                <div className="flex items-center justify-between font-mono text-[11.5px]">
                  <span className="uppercase tracking-wider text-[var(--fg-soft)]">{p.label}</span>
                  <span className="metric font-semibold text-[var(--accent)]">{p.value}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--rule)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.value}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-[var(--accent-soft)] to-[var(--accent)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { Annotation } from "@/components/notebook/Annotation";
import { experience } from "@/lib/data";

const experienceCode = `experience = [
    { "role": "AI Engineer",  "company": "Lumen Labs",     "period": "2025 — Present" },
    { "role": "ML Engineer",  "company": "Northwind AI",   "period": "2023 — 2025" },
    { "role": "Software Eng", "company": "PenguinByte",    "period": "2021 — 2023" },
    { "role": "Research Intern","company": "IISc Bangalore","period": "2020 — 2021" },
]
for cell in experience:
    cell.execute()`;

export function Experience() {
  return (
    <section className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">04</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                runtime history
              </span>
            </div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">Traceback.</span>{" "}
              <span className="text-[var(--fg-soft)]">The trajectory so far.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <Annotation offset="slight" tone="quiet" prefix="#">
              four roles · one direction
            </Annotation>
          </div>
        </div>

        <NotebookCell cellId="4" threshold={0.12}>
          {(executed, status, run) => (
            <>
              <CodeBlock code={experienceCode} className="mt-2" />
              <OutputBlock cellId="4" visible={run} tone="default">
                <div className="space-y-6">
                  {experience.map((job, i) => (
                    <motion.article
                      key={job.role + job.company}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: executed ? 1 : 0, y: executed ? 0 : 8 }}
                      transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                      className="grid grid-cols-1 gap-6 border-t border-[var(--rule)] pt-6 md:grid-cols-[200px_1fr_240px] md:gap-10"
                    >
                      <div>
                        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          {job.period}
                        </div>
                        <div className="mt-2 font-mono text-[11px] tracking-[0.04em] text-[var(--accent)]">
                          {job.location}
                        </div>
                      </div>
                      <div>
                        <h3 className="display text-[28px] leading-[1.05] tracking-[-0.02em] text-[var(--fg)]">
                          {job.role}
                        </h3>
                        <div className="mt-1.5 text-[14px] text-[var(--fg-soft)]">
                          {job.company}
                        </div>
                        <ul className="mt-5 space-y-2 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
                          {job.bullets.map((b, j) => (
                            <li key={j} className="flex gap-3">
                              <span className="mt-2 inline-block h-px w-3 flex-shrink-0 bg-[var(--fg-faint)]" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          stack
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {job.stack.map((t) => (
                            <span
                              key={t}
                              className="border border-[var(--rule)] px-2 py-0.5 font-mono text-[11px] text-[var(--fg-mute)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}
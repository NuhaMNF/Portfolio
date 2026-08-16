"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { experience } from "@/lib/data";
import { Briefcase, MapPin, Calendar } from "lucide-react";

export function Experience() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="4" threshold={0.12}>
          {(executed, status, run) => (
            <>
              <CodeBlock
                code={`experience = [\n    { "role": "AI Engineer", "company": "Lumen Labs", "period": "2025 — Present" },\n    { "role": "ML Engineer", "company": "Northwind AI", "period": "2023 — 2025" },\n    { "role": "Software Engineer", "company": "PenguinByte", "period": "2021 — 2023" },\n    { "role": "Research Intern", "company": "IISc Bangalore", "period": "2020 — 2021" },\n]\nfor cell in experience:\n    cell.execute()`}
                className="mt-4"
              />
              <OutputBlock cellId="4" visible={run} tone="default">
                <div className="space-y-3">
                  {experience.map((job, i) => (
                    <motion.div
                      key={job.role + job.company}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: executed ? 1 : 0, x: executed ? 0 : -8 }}
                      transition={{ delay: 0.2 + i * 0.18, duration: 0.5 }}
                      className="overflow-hidden rounded-md border border-zinc-800/60 bg-zinc-950/30"
                    >
                      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800/40 bg-zinc-900/40 px-4 py-2 font-mono text-[11px]">
                        <span className="text-zinc-500">In[</span>
                        <span className="text-amber-300">4.{i + 1}</span>
                        <span className="text-zinc-600">]:</span>
                        <span className="text-zinc-400">
                          experience.append(role=
                          <span className="text-emerald-300">"{job.role}"</span>,
                          company=
                          <span className="text-emerald-300">"{job.company}"</span>)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            Out[4.{i + 1}]:
                          </div>
                          <h3 className="mt-1 text-lg font-semibold text-zinc-50">
                            {job.role}
                          </h3>
                          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12px] text-zinc-400">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="h-3 w-3" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {job.period}
                            </span>
                          </div>
                          <ul className="mt-3 space-y-1.5">
                            {job.bullets.map((b, j) => (
                              <li
                                key={j}
                                className="flex gap-2 text-[13px] leading-relaxed text-zinc-300"
                              >
                                <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-amber-300" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            stack
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {job.stack.map((t) => (
                              <span
                                key={t}
                                className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
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


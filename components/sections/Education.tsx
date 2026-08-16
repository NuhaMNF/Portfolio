"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { education } from "@/lib/data";
import { GraduationCap, Sigma, BookText } from "lucide-react";

export function Education() {
  return (
    <section id="education" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell
          cellId="7"
          label="credentials"
          collapsedHint="Academic background & research thesis collapsed · Click to run cell"
        >
          {(executed) => (
            <>
              <CodeBlock
                code={`education = [\n    { "degree": "M.S. Computer Science", "institution": "IISc Bangalore" },\n    { "degree": "B.E. Computer Science", "institution": "NIT Trichy" },\n]`}
                className="mt-4"
              />
              <OutputBlock cellId="7" visible={executed} tone="default">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {education.map((edu, i) => (
                    <motion.div
                      key={edu.institution}
                      data-cursor="view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                      className="relative overflow-hidden rounded-md border border-zinc-800/60 bg-zinc-950/40 p-5"
                    >
                      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 text-amber-300">
                          <GraduationCap className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            {edu.period}
                          </div>
                          <h3 className="text-lg font-semibold text-zinc-50">
                            {edu.degree}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-3 font-mono text-[12px] text-zinc-300">
                        {edu.institution}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {edu.focus.map((f) => (
                          <span
                            key={f}
                            className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-2 border-t border-zinc-800/60 pt-3 font-mono text-[11px] text-zinc-400">
                        <BookText className="h-3 w-3 text-amber-300" />
                        <span className="text-zinc-500">thesis:</span>
                        <span className="text-zinc-300">{edu.thesis}</span>
                      </div>
                      <div className="mt-2 font-mono text-[11px] text-zinc-500">
                        <Sigma className="mr-1 inline h-3 w-3" />
                        GPA: 9.{2 + i}.4 / 10.0
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

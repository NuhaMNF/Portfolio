"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { education } from "@/lib/data";

const educationCode = `education = [
    { "degree": "M.S. Computer Science", "institution": "IISc Bangalore" },
    { "degree": "B.E. Computer Science", "institution": "NIT Trichy" },
]`;

export function Education() {
  return (
    <section id="education" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">07</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                foundations
              </span>
            </div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">Foundations.</span>{" "}
              <span className="text-[var(--fg-soft)]">The roots of the runtime.</span>
            </h2>
          </div>
        </div>

        <NotebookCell cellId="7">
          {(executed, status, run) => (
            <>
              <CodeBlock code={educationCode} className="mt-2" />
              <OutputBlock cellId="7" visible={run} tone="default">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  {education.map((edu, i) => (
                    <motion.div
                      key={edu.institution}
                      data-cursor="view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                      className="border-l border-[var(--rule)] pl-6"
                    >
                      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                        {edu.period}
                      </div>
                      <h3 className="display mt-3 text-[clamp(28px,3.2vw,40px)] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
                        {edu.degree}
                      </h3>
                      <div className="mt-2 text-[15px] text-[var(--fg-soft)]">
                        {edu.institution}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[12px] text-[var(--fg-mute)]">
                        {edu.focus.map((f, idx) => (
                          <span key={f} className="flex items-center gap-3">
                            <span>{f}</span>
                            {idx < edu.focus.length - 1 && (
                              <span className="text-[var(--fg-ghost)]">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 border-t border-[var(--rule)] pt-3 text-[13px] leading-[1.6] text-[var(--fg-mute)]">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          thesis:{" "}
                        </span>
                        {edu.thesis}
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
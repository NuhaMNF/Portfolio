"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { ExperimentBlock } from "@/components/notebook/ExperimentBlock";
import { Annotation } from "@/components/notebook/Annotation";
import { research } from "@/lib/data";

const researchCode = `research = [
    "Sample-Efficient Reinforcement Learning",
    "Latent Diffusion for Cross-Modal Generation",
    "Layout-Aware Document Transformers",
    "Evaluating RAG Agents at Scale",
]`;

export function Research() {
  return (
    <section id="research" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <ExperimentBlock number="06" title="Research" status="peer-reviewed · exploratory" />

        <div className="mt-10 mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <h3 className="display text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-0.02em] text-[var(--fg)]">
            <span className="display-italic">Papers</span> read like novels, kept like field notes.
          </h3>
          <Annotation offset="slight" tone="warm" prefix="#">
            curious about everything that learns
          </Annotation>
        </div>

        <NotebookCell cellId="6">
          {(executed, status, run) => (
            <>
              <CodeBlock code={researchCode} className="mt-2" />
              <OutputBlock cellId="6" visible={run} tone="default">
                <div className="space-y-12">
                  {research.map((r, i) => (
                    <motion.article
                      key={r.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                      className="grid grid-cols-1 gap-6 border-t border-[var(--rule)] pt-6 md:grid-cols-[100px_1fr_180px]"
                    >
                      <div className="font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
                        <span className="metric text-[var(--accent)]">
                          paper.{String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          {r.topic}
                        </div>
                      </div>
                      <div>
                        <h4 className="display text-[clamp(22px,2.5vw,32px)] leading-[1.1] tracking-[-0.02em] text-[var(--fg)]">
                          {r.title}
                        </h4>
                        <p className="mt-3 text-[14px] leading-[1.65] text-[var(--fg-soft)]">
                          {r.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11.5px] text-[var(--fg-mute)]">
                          <span className="text-[var(--fg-faint)]">method:</span>
                          <span>{r.methodology}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          stack
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.tech.map((t) => (
                            <span
                              key={t}
                              className="border border-[var(--rule)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--fg-mute)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="view"
                          className="link-underline mt-4 inline-block font-mono text-[11px] text-[var(--fg-mute)]"
                        >
                          read paper ↗
                        </a>
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
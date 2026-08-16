"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { research } from "@/lib/data";
import { Microscope, BookOpen, FlaskConical, Sigma, ArrowUpRight } from "lucide-react";

const researchCode = `research = [
    "Machine Learning",
    "Generative AI",
    "Computer Vision",
    "Natural Language Processing",
]`;

export function Research() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="6">
          {(executed) => (
            <>
              <CodeBlock code={researchCode} className="mt-4" />
              <OutputBlock cellId="6" visible={executed} tone="default">
                <CodeAnnotation id="p3" variant="block" className="mb-4" align="left" />
                <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                  <FlaskConical className="h-3.5 w-3.5" />
                  research_lab.ipynb — peer-reviewed work & exploratory studies
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {research.map((r, i) => (
                    <motion.article
                      key={r.title}
                      data-cursor="open"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                      className="group relative overflow-hidden rounded-md border border-zinc-800/60 bg-zinc-950/40 p-5 transition-colors hover:border-zinc-700"
                    >
                      <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
                          <Microscope className="h-3 w-3" />
                          {r.topic}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          paper #{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-snug text-zinc-50">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
                        {r.description}
                      </p>
                      <div className="mt-4 space-y-2 border-t border-zinc-800/60 pt-3 font-mono text-[11px]">
                        <div className="flex gap-3">
                          <span className="w-20 flex-shrink-0 text-zinc-500">method</span>
                          <span className="text-zinc-300">{r.methodology}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-20 flex-shrink-0 text-zinc-500">stack</span>
                          <span className="text-zinc-300">{r.tech.join(", ")}</span>
                        </div>
                        {i === 0 && (
                          <div className="flex gap-3">
                            <span className="w-20 flex-shrink-0 text-zinc-500">note</span>
                            <span className="inline-flex items-center gap-1 text-zinc-300">
                              <Sigma className="h-3 w-3" />
                              L = -E[log π(a|s)] + βH(π)
                            </span>
                          </div>
                        )}
                      </div>
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="view"
                        className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-300 hover:text-amber-200"
                      >
                        <BookOpen className="h-3 w-3" />
                        read paper
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
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

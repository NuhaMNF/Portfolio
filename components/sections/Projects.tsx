"use client";

import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { TrainingEpochs } from "@/components/visualizations/TrainingEpochs";
import { projects } from "@/lib/data";
import {
  ExternalLink,
  ArrowUpRight,
  Star,
  Cpu,
  Eye,
  BarChart3,
  Boxes,
  Layers,
  MessageSquare,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

const projectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "lumen-rag": MessageSquare,
  cetacea: Boxes,
  tideline: BarChart3,
  meridian: Eye,
  graphite: Layers,
};

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell
          cellId="5"
          label="artifacts"
          collapsedHint="5 Production AI projects & live training monitor collapsed · Click to run cell"
        >
          {(executed) => (
            <>
              <CodeBlock
                code={`projects = [\n    LumenRAG(...),\n    Cetacea(...),\n    Tideline(...),\n    Meridian(...),\n    Graphite(...),\n]\nprojects.run_all()`}
                className="mt-4"
              />
              <OutputBlock cellId="5" visible={executed} tone="default">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {projects.map((p, i) => {
                    const Icon = projectIcons[p.id] ?? Cpu;
                    const isFeatured = p.id === "tideline";
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                        data-cursor="open"
                        className={`group relative overflow-hidden rounded-md border bg-zinc-950/40 transition-colors ${
                          isFeatured
                            ? "border-amber-400/30 md:col-span-2"
                            : "border-zinc-800/60 hover:border-zinc-700"
                        }`}
                      >
                        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                        <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/30 px-4 py-2 font-mono text-[11px]">
                          <span className="flex items-center gap-2">
                            <span className="text-zinc-500">In[</span>
                            <span className="text-amber-300">{p.cellId}</span>
                            <span className="text-zinc-600">]:</span>
                            <span className="text-zinc-400">
                              project = <span className="text-sky-300">{p.id}</span>(
                              <span className="text-zinc-500">...</span>)
                            </span>
                          </span>
                          <span className="text-zinc-500">{p.year}</span>
                        </div>
                        <div className={`grid grid-cols-1 gap-4 p-5 ${isFeatured ? "md:grid-cols-2" : ""}`}>
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 text-amber-300">
                                <Icon className="h-4 w-4" />
                              </span>
                              <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                                  {p.category}
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-50">
                                  {p.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-[13px] leading-relaxed text-zinc-400">
                              {p.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {p.tech.map((t) => (
                                <span
                                  key={t}
                                  className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                              {p.metrics.map((m) => (
                                <div
                                  key={m.label}
                                  className="rounded border border-zinc-800/60 bg-zinc-900/40 p-2"
                                >
                                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                                    {m.label}
                                  </div>
                                  <div className="font-mono text-base text-amber-300 tabular-nums">
                                    {m.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {isFeatured ? (
                              <TrainingEpochs running={executed} />
                            ) : (
                              <div className="flex items-center gap-2">
                                <a
                                  href={p.repo}
                                  target="_blank"
                                  rel="noreferrer"
                                  data-cursor="view"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/40 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:text-amber-300"
                                >
                                  <GithubIcon className="h-3 w-3" />
                                  repo
                                </a>
                                {p.demo && (
                                  <a
                                    href={p.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-cursor="view"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/40 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:text-amber-300"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    demo
                                  </a>
                                )}
                                <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                                  <Star className="h-3 w-3" />
                                  featured
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span className="text-amber-300">Out[5]:</span>
                  <span>{projects.length} projects executed.</span>
                  <span className="ml-auto text-zinc-600">
                    <ArrowUpRight className="inline h-3 w-3" />
                    click any repo or demo to explore
                  </span>
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}

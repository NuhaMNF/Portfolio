"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { CapabilityMap } from "@/components/visualizations/CapabilityMap";
import { KnowledgeAtlas } from "@/components/visualizations/KnowledgeAtlas";
import { skills } from "@/lib/data";

const skillsCode = `capabilities = {
    "AI / ML":       ["PyTorch", "Transformers", "RL", "Diffusion"],
    "Programming":   ["Python", "TypeScript", "Rust", "C++"],
    "Backend":       ["FastAPI", "PostgreSQL", "Redis", "Kafka"],
    "Frontend":      ["Next.js", "React", "Three.js", "Tailwind"],
    "Data":          ["Pandas", "NumPy", "dbt", "SQL"],
    "Cloud":         ["AWS", "Docker", "Kubernetes", "GCP"],
}`;

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">03</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                capabilities
              </span>
            </div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">Knowledge</span>{" "}
              <span className="text-[var(--fg-soft)]">as a living atlas.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <CodeAnnotation id="p3" className="block" align="left" />
          </div>
        </div>

        <NotebookCell cellId="3">
          {(executed, status, run) => (
            <>
              <CodeBlock code={skillsCode} className="mt-2" />
              <OutputBlock cellId="3" visible={run} tone="default">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
                  <CapabilityMap />
                  <div className="space-y-8">
                    <KnowledgeAtlas />
                  </div>
                </div>

                <div className="mt-10 border-t border-[var(--rule)] pt-6">
                  <div className="mb-4 flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                    <span>// full inventory</span>
                    <span className="metric text-[var(--accent)]">04</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    {Object.entries(skills).map(([group, items]) => (
                      <div key={group} className="border-l border-[var(--rule)] pl-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                          {group}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-[var(--fg-soft)]">
                          {items.map((s, i) => (
                            <span key={s} className="flex items-center gap-3">
                              <span>{s}</span>
                              {i < items.length - 1 && (
                                <span className="text-[var(--fg-ghost)]">·</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}
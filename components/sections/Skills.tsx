"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { SkillsRadar } from "@/components/visualizations/SkillsRadar";
import { SkillsGraph } from "@/components/visualizations/SkillsGraph";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { skills } from "@/lib/data";

const skillsCode = `skills = {
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers"],
    "Programming": ["Python", "TypeScript", "JavaScript"],
    "Backend": ["FastAPI", "Node.js", "PostgreSQL"],
    "Frontend": ["Next.js", "React", "Three.js"],
    "Data": ["Pandas", "NumPy", "SQL"],
    "Cloud": ["AWS", "Azure", "Docker"],
}`;

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="3">
          {(executed) => (
            <>
              <CodeBlock code={skillsCode} className="mt-4" />
              <OutputBlock cellId="3" visible={executed} tone="default">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <SkillsRadar />
                  <div className="flex flex-col gap-6">
                    <div className="relative">
                      <CodeAnnotation id="p3" className="absolute -right-1 -top-7 hidden md:block" align="right" />
                      <SkillsGraph />
                    </div>
                    <div className="rounded-md border border-zinc-800/60 bg-zinc-950/40 p-4">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {"// full inventory"}
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {Object.entries(skills).map(([group, items]) => (
                          <div key={group} data-cursor="view" className="rounded border border-zinc-800/60 bg-zinc-900/30 p-3">
                            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300">
                              {group}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {items.map((s) => (
                                <span key={s} className="rounded bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">{s}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

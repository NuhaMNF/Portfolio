"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { ExperimentBlock } from "@/components/notebook/ExperimentBlock";
import { Annotation } from "@/components/notebook/Annotation";
import { ProjectDetailModal } from "@/components/project/ProjectDetailModal";
import { ProjectPreview } from "@/components/project/ProjectPreview";
import { projects } from "@/lib/data";

const projectsCode = `projects = [
    LumenRAG(...),
    Cetacea(...),
    Tideline(...),
    Meridian(...),
    Graphite(...),
]
projects.run_all()`;

export function Projects() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const onOp = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string" && projects.some((p) => p.id === detail)) {
        setSelected(detail);
      }
    };
    window.addEventListener("nuha:open-project", onOp as EventListener);
    return () => window.removeEventListener("nuha:open-project", onOp as EventListener);
  }, []);

  const activeProject = projects.find((p) => p.id === selected) ?? null;

  return (
    <section id="projects" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <ExperimentBlock
          number="05"
          title="Projects"
          status="5 experiments · 4 years"
        />

        <div className="mt-10 mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="display text-[clamp(28px,3vw,40px)] leading-[1.1] tracking-[-0.02em] text-[var(--fg)]">
              <span className="display-italic">Five</span> case studies, kept like
              field notes.
            </h3>
          </div>
          <div className="space-y-3">
            <Annotation offset="slight" tone="warm" prefix="#">
              each one — a problem first, then a method
            </Annotation>
            <CodeAnnotation id="p5" />
          </div>
        </div>

        <NotebookCell cellId="5" threshold={0.08}>
          {(executed, status, run) => (
            <>
              <CodeBlock code={projectsCode} className="mt-2" />
              <OutputBlock cellId="5" visible={run} tone="default">
                <div className="space-y-24">
                  {projects.map((p, i) => (
                    <ProjectEntry
                      key={p.id}
                      project={p}
                      index={i}
                      onOpen={() => setSelected(p.id)}
                    />
                  ))}
                </div>

                <div className="mt-12 border-t border-[var(--rule)] pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                  <span className="metric text-[var(--accent)]">5</span>
                  <span className="ml-2">experiments completed.</span>
                  <span className="ml-4 hidden md:inline">↳ all cells archived.</span>
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>

      <ProjectDetailModal project={activeProject} onClose={() => setSelected(null)} />
    </section>
  );
}

function ProjectEntry({
  project,
  index,
  onOpen,
}: {
  project: (typeof projects)[number];
  index: number;
  onOpen: () => void;
}) {
  const isOdd = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Project marker */}
      <div className="mb-6 flex items-center gap-4 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
        <span className="metric text-[var(--accent)]">{project.cellId}</span>
        <span className="text-[var(--fg-ghost)]">·</span>
        <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          {project.category}
        </span>
        <span className="text-[var(--fg-ghost)]">·</span>
        <span className="metric text-[var(--fg-faint)]">{project.year}</span>
      </div>

      <div className={`grid grid-cols-1 gap-10 lg:gap-16 ${isOdd ? "lg:grid-cols-[1.4fr_1fr]" : "lg:grid-cols-[1fr_1.4fr]"}`}>
        {/* Text column */}
        <div className={isOdd ? "order-2 lg:order-1" : "order-2 lg:order-1"}>
          <h4 className="display text-[clamp(36px,4.5vw,64px)] leading-[0.95] tracking-[-0.035em] text-[var(--fg)]">
            {project.title}
          </h4>
          <p className="mt-3 text-[16px] leading-[1.6] text-[var(--fg-soft)]">
            {project.subtitle}
          </p>

          <div className="mt-8 space-y-6 border-l border-[var(--rule)] pl-6">
            <Field label="// problem" text={project.problem} />
            <Field label="// approach" text={project.solution} />
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                // stack
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[12px] text-[var(--fg-soft)]">
                {project.tech.map((t, i) => (
                  <span key={t} className="flex items-center gap-4">
                    <span>{t}</span>
                    {i < project.tech.length - 1 && (
                      <span className="text-[var(--fg-ghost)]">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--rule)] pt-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                  {m.label}
                </div>
                <div className="metric mt-1 text-[24px] text-[var(--fg)]">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              data-cursor="open"
              onClick={onOpen}
              className="btn-glass inline-flex items-center gap-2 px-4 py-2 font-mono text-[12px] text-[var(--fg-soft)]"
            >
              <span>open notebook</span>
              <span className="text-[10px] text-[var(--fg-faint)]">→</span>
            </button>
            {project.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
                className="link-underline font-mono text-[12px] text-[var(--fg-mute)]"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Visual column */}
        <div
          className={`relative order-1 lg:order-2 ${isOdd ? "" : ""}`}
        >
          <div
            data-cursor="open"
            onClick={onOpen}
            className="cell-paper cell-elevate aspect-[4/3] cursor-pointer overflow-hidden"
          >
            <ProjectPreview id={project.id} />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            <span>fig. {project.cellId.replace(".", "_")} — preview</span>
            <span>click to expand</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {label}
      </div>
      <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--fg-soft)]">
        {text}
      </p>
    </div>
  );
}
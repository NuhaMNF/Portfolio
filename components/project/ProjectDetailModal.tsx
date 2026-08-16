"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectPreview } from "./ProjectPreview";
import { ExternalLink, X } from "lucide-react";

type Project = {
  id: string;
  cellId: string;
  title: string;
  subtitle: string;
  year: number;
  category: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  tech: string[];
  repo: string;
  demo: string | null;
  metrics: Array<{ label: string; value: string }>;
  links: Array<{ label: string; url: string }>;
};

const LOAD_STEPS = [
  "dataset",
  "model",
  "backend",
  "interface",
];

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    setPhase("loading");
    setStep(0);
    LOAD_STEPS.forEach((_, i) => {
      setTimeout(() => setStep(i + 1), 280 + i * 320);
    });
    const t = setTimeout(() => setPhase("ready"), 280 + LOAD_STEPS.length * 320 + 200);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--bg-deep)]/85 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-[min(1120px,94vw)] overflow-y-auto border border-[var(--rule)] bg-[var(--bg-paper)]"
          >
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--rule)] bg-[var(--bg-paper)]/95 px-6 py-3 font-mono text-[11px] tracking-[0.04em] backdrop-blur">
              <span className="text-[var(--fg-faint)]">In</span>
              <span className="text-[var(--fg-faint)]">[</span>
              <span className="metric text-[var(--accent)]">{project.cellId}</span>
              <span className="text-[var(--fg-faint)]">]</span>
              <span className="text-[var(--fg-soft)]">
                <span className="text-[var(--fg-mute)]">project.</span>
                <span className="text-[var(--accent)]">{project.id}</span>
                <span className="text-[var(--fg-mute)]">.run()</span>
              </span>
              <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                Out[{project.cellId}]: expanded
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-3 inline-flex h-7 w-7 items-center justify-center border border-[var(--rule)] text-[var(--fg-mute)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <X className="h-3 w-3" />
              </button>
            </header>

            <AnimatePresence mode="wait">
              {phase === "loading" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_1fr]"
                >
                  <div className="border-b border-[var(--rule)] p-10 md:border-b-0 md:border-r">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                      loading experiment
                    </div>
                    <div className="display mt-4 text-[40px] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
                      <span className="display-italic">{project.title}</span>
                    </div>
                    <div className="mt-8 space-y-3 font-mono text-[13px]">
                      {LOAD_STEPS.map((s, i) => {
                        const done = step > i;
                        const active = step === i;
                        return (
                          <div key={s} className="flex items-center gap-3">
                            <span
                              className={
                                done
                                  ? "text-[var(--state-done)]"
                                  : active
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--fg-ghost)]"
                              }
                            >
                              {done ? "✓" : active ? "●" : "·"}
                            </span>
                            <span
                              className={
                                done || active ? "text-[var(--fg-soft)]" : "text-[var(--fg-faint)]"
                              }
                            >
                              {s}
                            </span>
                            {active && (
                              <span className="state-dot state-dot--running ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                      executing…
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-[var(--bg-deep)] p-10">
                    <div className="aspect-[5/3] w-full max-w-md">
                      <ProjectPreview id={project.id} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-[1.1fr_1fr]">
                    <div className="border-b border-[var(--rule)] bg-[var(--bg-deep)] p-8 md:border-b-0 md:border-r">
                      <div className="aspect-[5/3] overflow-hidden border border-[var(--rule-soft)]">
                        <ProjectPreview id={project.id} />
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-4">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                              {m.label}
                            </div>
                            <div className="metric mt-1 text-[22px] text-[var(--fg)]">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                        {project.category}
                      </div>
                      <h2 className="display mt-2 text-[clamp(36px,4vw,48px)] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-[14px] text-[var(--fg-soft)]">
                        {project.subtitle} · {project.year}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[12px] text-[var(--fg-soft)]">
                        {project.tech.map((t, i) => (
                          <span key={t} className="flex items-center gap-3">
                            <span>{t}</span>
                            {i < project.tech.length - 1 && (
                              <span className="text-[var(--fg-ghost)]">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 border-t border-[var(--rule)] p-8">
                    <Block label="// problem" text={project.problem} />
                    <Block label="// approach" text={project.solution} />
                    <Block label="// architecture" text={project.architecture} mono />
                    <Block label="// result" text={project.description} />
                  </div>

                  <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--rule)] p-8 font-mono text-[11px]">
                    <span className="text-[var(--fg-faint)]">↳</span>
                    <span className="text-[var(--fg-mute)]">edit this cell</span>
                    <div className="ml-auto flex items-center gap-2">
                      {project.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="view"
                          className="inline-flex items-center gap-1.5 border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                        >
                          {l.label === "github" ? <GithubIcon className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ label, text, mono }: { label: string; text: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {label}
      </div>
      <div
        className={
          mono
            ? "border border-[var(--rule-soft)] bg-[var(--bg-deep)] p-4 font-mono text-[12.5px] leading-[1.7] text-[var(--fg-soft)] whitespace-pre"
            : "text-[14.5px] leading-[1.7] text-[var(--fg-soft)]"
        }
      >
        {text}
      </div>
    </div>
  );
}
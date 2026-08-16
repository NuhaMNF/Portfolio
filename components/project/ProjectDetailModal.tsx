"use client";

import { useEffect, useRef } from "react";
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

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur"
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
            className="relative max-h-[90vh] w-[min(1080px,94vw)] overflow-y-auto rounded-md border border-zinc-800 bg-[#0c0c0e] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-800 bg-[#0c0c0e]/95 px-5 py-3 font-mono text-[12px] backdrop-blur">
              <span className="text-zinc-500">In[</span>
              <span className="text-amber-300">{project.cellId}</span>
              <span className="text-zinc-600">]:</span>
              <span className="text-zinc-400">
                project.<span className="text-sky-300">{project.id}</span>.run()
              </span>
              <span className="ml-auto text-zinc-500">→ Out[{project.cellId}]: expanded</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-amber-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="border-b border-zinc-800/80 bg-[#0a0a0b] p-6 md:border-b-0 md:border-r">
                <div className="aspect-[5/3] overflow-hidden rounded border border-zinc-800/80 bg-[#0a0a0b]">
                  <ProjectPreview id={project.id} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded border border-zinc-800/60 bg-zinc-900/40 p-2">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{m.label}</div>
                      <div className="font-mono text-base text-amber-300 tabular-nums">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">{project.category}</div>
                <h2 className="mt-1 text-3xl font-semibold text-zinc-50">{project.title}</h2>
                <p className="mt-1 text-[14px] text-zinc-400">{project.subtitle} · {project.year}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-zinc-800/80 p-6">
              <Block label="// problem" text={project.problem} />
              <Block label="// solution" text={project.solution} />
              <Block label="// architecture" text={project.architecture} mono />
              <Block label="// results" text={project.description} />
            </div>

            <footer className="flex flex-wrap items-center gap-3 border-t border-zinc-800/80 p-6 font-mono text-[12px]">
              <span className="text-zinc-500">{">"}</span>
              <span className="text-zinc-400">edit this cell</span>
              <div className="ml-auto flex items-center gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-amber-200 hover:bg-amber-300/20"
                  >
                    {l.label === "github" ? <GithubIcon className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                    {l.label}
                  </a>
                ))}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ label, text, mono }: { label: string; text: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">{label}</div>
      <div className={`text-[14px] leading-relaxed text-zinc-300 ${mono ? "rounded border border-zinc-800/80 bg-[#0a0a0b] p-4 font-mono text-[12.5px] text-zinc-200 whitespace-pre" : ""}`}>
        {text}
      </div>
    </div>
  );
}

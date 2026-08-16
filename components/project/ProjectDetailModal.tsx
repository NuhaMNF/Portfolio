"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { X, CheckCircle2, ArrowUpRight, Layers } from "lucide-react";
import Image from "next/image";

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
  features?: string[];
  images?: Array<{ id: string; title: string; tag: string; src: string; description: string }>;
  links: Array<{ label: string; url: string }>;
};

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    setSelectedImg(0);
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

  const images = project?.images ?? [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 md:p-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Modal Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--rule)] bg-[var(--surface)]/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="rounded bg-[var(--surface-2)] px-2.5 py-0.5 font-medium text-[var(--accent)] uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-[var(--fg-faint)]">·</span>
                <span className="text-[var(--fg-mute)]">{project.year}</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="btn-glass inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--fg-mute)] hover:text-[var(--fg)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Title & Subtitle */}
              <div>
                <h3 className="font-serif text-[clamp(28px,3.5vw,42px)] font-normal leading-[1.1] text-[var(--fg)]">
                  {project.title}
                </h3>
                <p className="mt-2 font-mono text-[13px] text-[var(--accent)]">
                  {project.subtitle}
                </p>
                <p className="mt-4 text-[15px] leading-[1.7] text-[var(--fg-soft)]">
                  {project.description}
                </p>
              </div>

              {images.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-[var(--rule)] bg-black shadow-md">
                <div className="flex items-center justify-between border-b border-[var(--rule)] bg-[var(--surface-2)]/80 px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImg(idx)}
                        className={`rounded px-2.5 py-1 font-mono text-[11px] transition-colors ${
                          selectedImg === idx
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface)] text-[var(--fg-mute)] hover:text-[var(--fg)]"
                        }`}
                      >
                        {img.tag}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--fg-faint)]">
                    {String(selectedImg + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative aspect-[16/10] w-full bg-black/90">
                  <Image
                    src={images[selectedImg].src}
                    alt={images[selectedImg].title || "Project preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
                <div className="border-t border-[var(--rule)] bg-[var(--surface)] px-4 py-3">
                  <div className="text-[14px] text-[var(--fg)]">{images[selectedImg].title}</div>
                  <p className="mt-1 font-mono text-[11.5px] text-[var(--fg-mute)]">
                    {images[selectedImg].description}
                  </p>
                </div>
              </div>
              )}

              {/* Problem vs Solution Matrix */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                    // The Challenge / Problem
                  </div>
                  <p className="text-[14px] leading-[1.65] text-[var(--fg-soft)]">
                    {project.problem}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] mb-2">
                    // Engineering Solution & Approach
                  </div>
                  <p className="text-[14px] leading-[1.65] text-[var(--fg-soft)]">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-3">
                    // Key Features & System Capabilities
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {project.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2.5 rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/30 px-3.5 py-2 text-[13.5px] text-[var(--fg-soft)]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Architecture Diagram */}
              {project.architecture && (
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-3">
                    <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>System Architecture & Data Flow</span>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-[var(--rule)] bg-[var(--surface-2)]/60 p-4 font-mono text-[12px] leading-[1.6] text-[var(--fg-soft)]">
                    {project.architecture}
                  </pre>
                </div>
              )}

              {/* Technologies Matrix */}
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-3">
                  // Technologies & Frameworks
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-[var(--rule)] bg-[var(--surface-2)] px-3 py-1 font-mono text-[12px] text-[var(--fg-soft)] shadow-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <footer className="flex items-center justify-between border-t border-[var(--rule)] bg-[var(--surface)] px-6 py-4">
              <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                Press <kbd className="rounded border border-[var(--rule)] px-1 py-0.5 text-[9px]">ESC</kbd> to close
              </span>
              <div className="flex items-center gap-3">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="view"
                    className="btn-glass btn-glass--accent inline-flex items-center gap-2 px-4 py-2 font-mono text-[12px] rounded-lg shadow-sm"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>View on GitHub</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-glass px-4 py-2 font-mono text-[12px] text-[var(--fg-mute)] rounded-lg"
                >
                  Close
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
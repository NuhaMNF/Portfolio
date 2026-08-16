"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypedCode } from "@/components/notebook/CodeBlock";
import { Annotation } from "@/components/notebook/Annotation";
import { heroClassCode, profile } from "@/lib/data";
import { Play, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Hero() {
  const [run, setRun] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRun(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100svh] pt-20 md:pt-28 pb-32">
      {/* Top coordinate strip */}
      <div className="pointer-events-none absolute left-0 right-0 top-6 flex items-center justify-between px-6 lg:px-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--fg-faint)]">
          <span>↳ cover page</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--fg-faint)]">
          <span>page 01 / 01</span>
        </div>
      </div>

      {/* Paper label — top-left notebook annotation */}
      <div className="absolute right-8 top-24 hidden lg:block">
        <Annotation offset="more" tone="quiet" prefix="#">
          currently exploring
        </Annotation>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT — code cell */}
          <div className="relative">
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.02em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">01</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="flex items-center gap-2 text-[var(--fg-mute)]">
                <span className={`state-dot ${run ? (done ? "state-dot--done" : "state-dot--running") : "state-dot--queued"}`} />
                <span className="text-[10.5px] uppercase tracking-[0.18em]">
                  {done ? "executed" : run ? "running" : "queued"}
                </span>
              </span>
              {done && (
                <span className="ml-2 metric text-[var(--state-done)]">✓ 0.42s</span>
              )}
            </div>

            <TypedCode
              code={heroClassCode}
              speed={run && !done ? 16 : 9999}
              start={run}
              onDone={() => setDone(true)}
              className="mb-5"
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                data-cursor="run"
                onClick={() => {
                  setRun(false);
                  setDone(false);
                  setTimeout(() => setRun(true), 60);
                }}
                className="group inline-flex items-center gap-2 border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3.5 py-2 font-mono text-[12px] text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)]/15"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{done ? "rerun" : "run cell"}</span>
              </button>
              <button
                data-cursor="view"
                onClick={() => window.dispatchEvent(new CustomEvent("nuha:run"))}
                className="group inline-flex items-center gap-2 border border-[var(--rule)] bg-[var(--surface)] px-3.5 py-2 font-mono text-[12px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                <span>run_nuha()</span>
                <span className="text-[10px] text-[var(--fg-faint)]">⌘⏎</span>
              </button>
            </div>
          </div>

          {/* RIGHT — typographic identity */}
          <div className="relative">
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.02em] text-[var(--fg-mute)]">
                    <span>Out</span>
                    <span>[</span>
                    <span className="metric text-[var(--accent)]">01</span>
                    <span>]</span>
                    <span className="ml-2 text-[var(--fg-faint)]">·</span>
                    <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                      nuha.introduce()
                    </span>
                  </div>

                  <div className="relative mt-7">
                    {/* NUHA — huge editorial type */}
                    <h1 className="display-huge text-[var(--fg)]">
                      <span className="block text-[clamp(80px,11vw,180px)] leading-[0.82] tracking-[-0.05em]">
                        Nuha
                      </span>
                      <span className="block text-[clamp(80px,11vw,180px)] leading-[0.82] tracking-[-0.05em] text-[var(--fg-soft)]">
                        <span className="display-italic">Nizar</span>
                      </span>
                    </h1>

                    {/* The "separator" — a real kernel cursor between lines */}
                    <div className="mt-6 flex items-center gap-3">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--fg-faint)]">
                        AI engineer
                      </span>
                      <span className="block-cursor" />
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--fg-faint)]">
                        researcher
                      </span>
                    </div>

                    <p className="mt-7 max-w-md text-[16px] leading-[1.65] text-[var(--fg-soft)]">
                      {profile.tagline}
                    </p>

                    {/* RESEARCH / ENGINEERING / EXPERIMENTS label */}
                    <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="eyebrow">research</span>
                      <span className="text-[var(--fg-ghost)]">/</span>
                      <span className="eyebrow">engineering</span>
                      <span className="text-[var(--fg-ghost)]">/</span>
                      <span className="eyebrow">experiments</span>
                    </div>

                    <div className="mt-10 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                      <span className="state-dot state-dot--done" />
                      <span>python 3.12</span>
                      <span className="text-[var(--fg-ghost)]">·</span>
                      <span>kernel: online</span>
                    </div>

                    {/* Action row */}
                    <div className="mt-10 flex flex-wrap items-center gap-3">
                      <a
                        href="#projects"
                        data-cursor="view"
                        className="group inline-flex items-center gap-2 border border-[var(--rule)] bg-[var(--surface)] px-4 py-2 font-mono text-[12px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                      >
                        <span>view experiments</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </a>
                      <a
                        href="#about"
                        data-cursor="view"
                        className="link-underline font-mono text-[12px] text-[var(--fg-mute)]"
                      >
                        read notebook
                      </a>
                    </div>

                    <div className="mt-6 flex items-center gap-1">
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="view"
                        aria-label="GitHub"
                        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--rule)] text-[var(--fg-mute)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="view"
                        aria-label="LinkedIn"
                        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--rule)] text-[var(--fg-mute)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={`mailto:${profile.email}`}
                        data-cursor="view"
                        aria-label="Email"
                        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--rule)] text-[var(--fg-mute)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                      >
                        <span className="font-mono text-[10px]">@</span>
                      </a>
                    </div>

                    {/* Tiny notebook mark — corner */}
                    <div className="absolute -right-2 -top-6 hidden lg:block">
                      <Annotation offset="slight" tone="warm" prefix="#">
                        idea → prototype → experiment → result
                      </Annotation>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom indicator — scroll cue, but as a paper note */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]"
            >
              ↓ scroll · next cell awaits
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
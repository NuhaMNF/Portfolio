"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { TypedCode, CodeBlock } from "@/components/notebook/CodeBlock";
import { Annotation } from "@/components/notebook/Annotation";
import { heroClassCode, profile } from "@/lib/data";
import { Play, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const [run, setRun] = useState(reduced);
  const [done, setDone] = useState(reduced);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setRun(true), 480);
    return () => clearTimeout(t);
  }, [reduced]);

  const rerun = () => {
    if (reduced) return;
    setGeneration((g) => g + 1);
    setRun(false);
    setDone(false);
    window.setTimeout(() => setRun(true), 80);
  };

  const status = done ? "executed" : run ? "running" : "queued";

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-16 pb-24 md:pt-20 md:pb-28"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]">
          <Identity reduced={reduced} />
          <CodeCell
            reduced={reduced}
            run={run}
            done={done}
            status={status}
            onDone={() => setDone(true)}
            onRerun={rerun}
            generation={generation}
          />
        </div>
      </div>

      <motion.a
        href="#about"
        data-cursor="view"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
        className="absolute inset-x-0 bottom-8 z-[1] mx-auto flex max-w-[1320px] items-center gap-3 px-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)] transition-colors hover:text-[var(--fg-mute)] lg:px-12"
      >
        <span className="block-cursor h-2.5 w-[5px]" />
        <span>next cell · about</span>
      </motion.a>
    </section>
  );
}

function Identity({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative order-1">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-3 -top-10 hidden select-none font-mono text-[11px] tracking-[0.28em] text-[var(--fg-ghost)] sm:block"
      >
        01
      </span>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-7 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]"
      >
        <span>In</span>
        <span>[</span>
        <span className="metric text-[var(--accent)]">01</span>
        <span>]</span>
        <span className="text-[var(--fg-faint)]">·</span>
        <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
          introduce
        </span>
      </motion.div>

      <h1 className="hero-display text-[var(--fg)]">
        <span className="block overflow-hidden">
          <motion.span
            initial={reduced ? false : { y: "108%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
            className="block text-[clamp(64px,10vw,148px)]"
          >
            Nuha
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            initial={reduced ? false : { y: "108%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.18 }}
            className="display-italic block text-[clamp(64px,10vw,148px)] text-[var(--fg-soft)]"
          >
            Nizar
          </motion.span>
        </span>
      </h1>

      <motion.div
        initial={reduced ? false : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
        className="mt-5 h-px w-24 origin-left bg-[var(--accent)]"
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
        className="mt-7 flex flex-wrap items-center gap-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--fg-mute)]">
          AI engineer
        </span>
        <span className="block-cursor" />
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--fg-mute)]">
          researcher
        </span>
      </motion.div>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.52 }}
        className="mt-7 max-w-[34rem] text-[17px] leading-[1.65] text-[var(--fg-soft)]"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.62 }}
        className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]"
      >
        <span className="inline-flex items-center gap-2">
          <span className="state-dot state-dot--done" />
          {profile.location}
        </span>
        <span className="text-[var(--fg-ghost)]">·</span>
        <span>python 3.12</span>
        <span className="text-[var(--fg-ghost)]">·</span>
        <span>kernel: online</span>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.72 }}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <a
          href="#projects"
          data-cursor="view"
          className="group inline-flex min-h-11 items-center gap-2 border border-[var(--accent)]/45 bg-[var(--accent-glow)] px-5 font-mono text-[12.5px] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)]/15"
        >
          <span>view experiments</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
        <a
          href="#about"
          data-cursor="view"
          className="link-underline font-mono text-[12.5px] text-[var(--fg-mute)]"
        >
          read notebook
        </a>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.84 }}
        className="mt-8 flex items-center gap-1"
      >
        <SocialLink href={profile.github} label="GitHub">
          <GithubIcon className="h-4 w-4" />
        </SocialLink>
        <SocialLink href={profile.linkedin} label="LinkedIn">
          <LinkedinIcon className="h-4 w-4" />
        </SocialLink>
        <SocialLink href={`mailto:${profile.email}`} label="Email">
          <span className="font-mono text-[11px]">@</span>
        </SocialLink>
      </motion.div>

      <div className="mt-8 hidden lg:block">
        <Annotation offset="slight" tone="warm" prefix="#">
          currently exploring — rust + cuda kernels
        </Annotation>
      </div>
    </div>
  );
}

function CodeCell({
  reduced,
  run,
  done,
  status,
  onDone,
  onRerun,
  generation,
}: {
  reduced: boolean;
  run: boolean;
  done: boolean;
  status: string;
  onDone: () => void;
  onRerun: () => void;
  generation: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!run || done) return;
    const started = performance.now();
    const id = window.setInterval(() => {
      setElapsed(performance.now() - started);
    }, 40);
    return () => window.clearInterval(id);
  }, [run, done, generation]);

  useEffect(() => {
    if (!run && !done) setElapsed(0);
  }, [run, done]);

  const seconds = (elapsed / 1000).toFixed(2);
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE, delay: 0.28 }}
      className="relative order-2 lg:pt-6"
    >
      <div
        className={cn(
          "hero-code cell-paper overflow-hidden",
          (run || done) && "cell-paper-active"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] px-4 py-2.5">
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.02em] text-[var(--fg-mute)]">
            <span>In</span>
            <span>[</span>
            <span className="metric text-[var(--accent)]">01</span>
            <span>]</span>
            <span className="text-[var(--fg-faint)]">·</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
              nuha.py
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-mute)]">
            <span
              className={cn(
                "state-dot",
                status === "executed"
                  ? "state-dot--done"
                  : status === "running"
                    ? "state-dot--running"
                    : "state-dot--queued"
              )}
            />
            <span>{status}</span>
            {(run || done) && !reduced && (
              <span className="metric text-[var(--state-done)]">{seconds}s</span>
            )}
          </div>
        </div>

        {reduced ? (
          <CodeBlock
            code={heroClassCode}
            showCursor={false}
            className="border-0 bg-transparent"
          />
        ) : (
          <TypedCode
            key={generation}
            code={heroClassCode}
            speed={run ? 14 : 9999}
            start={run}
            onDone={onDone}
            className="border-0 bg-transparent"
          />
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--rule)] px-4 py-3">
          <button
            type="button"
            data-cursor="run"
            onClick={onRerun}
            className="group inline-flex min-h-10 items-center gap-2 border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-3.5 font-mono text-[12px] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent)]"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{done ? "rerun" : "run cell"}</span>
          </button>
          <button
            type="button"
            data-cursor="view"
            onClick={() => window.dispatchEvent(new CustomEvent("nuha:run"))}
            className="inline-flex min-h-10 items-center gap-2 border border-[var(--rule)] bg-[var(--surface)] px-3.5 font-mono text-[12px] text-[var(--fg-soft)] transition-colors duration-300 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            <span>run_nuha()</span>
            <span className="text-[10px] text-[var(--fg-faint)]">⌘⏎</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
        <span>fig. 01 — nuha.introduce()</span>
        <span className="metric">12 loc</span>
      </div>
    </motion.div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-cursor="view"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center border border-[var(--rule)] text-[var(--fg-mute)] transition-colors duration-300 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
    >
      {children}
    </a>
  );
}

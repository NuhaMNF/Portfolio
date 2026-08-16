"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypedCode } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { heroClassCode, profile } from "@/lib/data";
import { Play, ArrowRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Hero() {
  const [run, setRun] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRun(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100svh] pt-24 md:pt-32">
      <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 flex items-center gap-3 font-mono text-[12px]">
          <span className="text-zinc-500">In</span>
          <span className="text-zinc-600">[</span>
          <span className="text-amber-300">1</span>
          <span className="text-zinc-600">]:</span>
          <span
            className={`rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
              done
                ? "bg-emerald-500/10 text-emerald-300"
                : run
                ? "bg-amber-500/10 text-amber-300"
                : "bg-zinc-900/80 text-zinc-500"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  done ? "bg-emerald-300" : run ? "bg-amber-300 animate-pulse" : "bg-zinc-600"
                }`}
              />
              {done ? "executed" : run ? "running" : "queued"}
            </span>
          </span>
        </div>

        <TypedCode
          code={heroClassCode}
          speed={run ? 12 : 9999}
          start={run}
          onDone={() => setDone(true)}
          className="mb-8"
        />

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 font-mono text-[12px]">
                <span className="text-zinc-500">Out[</span>
                <span className="text-amber-300">1</span>
                <span className="text-zinc-600">]:</span>
                <span className="ml-2 h-px flex-1 bg-gradient-to-r from-amber-300/30 via-amber-300/10 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-emerald-300">
                  {"// > nuha.introduce()"}
                </div>
                <h1 className="mt-2 text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-zinc-50 md:text-7xl lg:text-9xl">
                  {profile.name.split(" ")[0]}
                  <span className="text-amber-300">.</span>
                  {profile.name.split(" ")[1]}
                </h1>
                <p className="mt-3 font-mono text-base text-zinc-400 md:text-lg">
                  {profile.role.split(" & ").map((s, i, arr) => (
                    <span key={s}>
                      <span className="text-zinc-200">{s}</span>
                      {i < arr.length - 1 && <span className="text-zinc-600"> · </span>}
                    </span>
                  ))}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                  {profile.tagline}
                </p>
                <CodeAnnotation id="p1" className="mt-3" align="left" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <button
                  data-cursor="run"
                  onClick={() => {
                    setRun(false);
                    setDone(false);
                    setTimeout(() => setRun(true), 50);
                  }}
                  className="group inline-flex items-center gap-2 rounded-md border border-amber-300/40 bg-amber-300/10 px-4 py-2 font-mono text-[13px] text-amber-200 transition-colors hover:bg-amber-300/20"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Run Cell
                </button>
                <a href="#projects" data-cursor="view" className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2 font-mono text-[13px] text-zinc-200 transition-colors hover:bg-zinc-900">
                  View Projects <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a href="#about" data-cursor="view" className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-[13px] text-zinc-300 transition-colors hover:bg-zinc-900">
                  About Me
                </a>
                <div className="ml-2 flex items-center gap-1">
                  <a href={profile.github} target="_blank" rel="noreferrer" data-cursor="view" aria-label="GitHub" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300">
                    <GithubIcon className="h-4 w-4" />
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="view" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300">
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${profile.email}`} data-cursor="view" aria-label="Email" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 font-mono text-[11px] text-zinc-500"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  kernel: idle
                </span>
                <span>mem: 84% free</span>
                <span>uptime: 1.4y</span>
                <span className="hidden md:inline">last commit: 2h ago</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="pt-8 font-mono text-[11px] text-zinc-500"
              >
                <span className="inline-block animate-pulse">↓ scroll to execute next cell</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0b]" />
    </section>
  );
}

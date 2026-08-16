"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TypedCode } from "@/components/notebook/CodeBlock";
import { heroClassCode, profile } from "@/lib/data";
import { Play, ArrowRight, Mail, FastForward, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useNotebook } from "@/lib/context/NotebookContext";
import { ExecutionPrompt } from "@/components/notebook/ExecutionPrompt";

export function Hero() {
  const { cellStates, runCell, runAllCells, allExecuted, setActiveCell } =
    useNotebook();
  const status = cellStates["1"] || "idle";
  const executed = status === "done";
  const running = status === "running";

  const handleRunHero = () => {
    setActiveCell("1");
    runCell("1", 700);
  };

  return (
    <section id="hero" className="relative min-h-[100svh] pt-24 md:pt-32">
      <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-6">
        {/* Cell Header */}
        <div className="mb-4">
          <ExecutionPrompt
            cellId="1"
            status={status}
            label="initialize"
            onRun={handleRunHero}
          />
        </div>

        {/* Python Code Block */}
        <TypedCode
          code={heroClassCode}
          speed={running ? 10 : 9999}
          start={running || executed}
          className="mb-6 shadow-xl"
        />

        {/* Collapsed Initial State Prompt */}
        {!executed && !running && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-4 rounded-lg border border-amber-400/30 bg-amber-400/[0.04] p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-[13px] font-semibold text-amber-200">
                <Terminal className="h-4 w-4 text-amber-300" />
                <span>Interactive Computational Notebook</span>
              </div>
              <p className="font-mono text-[12px] text-zinc-400">
                Click <span className="text-amber-300 font-medium">Run Cell</span> or press{" "}
                <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-200">Shift + Enter</kbd> to
                execute and reveal portfolio content.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 sm:pt-0">
              <button
                onClick={handleRunHero}
                data-cursor="run"
                className="inline-flex items-center gap-2 rounded-md border border-amber-300/50 bg-amber-300/20 px-4 py-2 font-mono text-[13px] font-medium text-amber-100 shadow-md transition-all hover:bg-amber-300/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-current text-amber-300" />
                Run Cell [1]
              </button>

              <button
                onClick={() => runAllCells()}
                data-cursor="run"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/80 px-3.5 py-2 font-mono text-[12px] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
              >
                <FastForward className="h-3.5 w-3.5 text-emerald-400" />
                Run All Cells
              </button>
            </div>
          </motion.div>
        )}

        {/* Output Block Out[1] */}
        <AnimatePresence>
          {executed && (
            <motion.div
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 overflow-hidden"
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
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-md border border-zinc-800/60 bg-zinc-900/20 p-6 md:p-8 backdrop-blur-sm"
              >
                <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-emerald-300">
                  {"// > nuha.introduce()"}
                </div>
                <h1 className="mt-2 text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-50 md:text-7xl lg:text-8xl">
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

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {!allExecuted && (
                    <button
                      onClick={() => runAllCells()}
                      data-cursor="run"
                      className="group inline-flex items-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 font-mono text-[13px] text-emerald-200 transition-all hover:bg-emerald-400/20"
                    >
                      <FastForward className="h-3.5 w-3.5 text-emerald-300" />
                      Run All Remaining Cells
                    </button>
                  )}
                  <a
                    href="#projects"
                    data-cursor="view"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2 font-mono text-[13px] text-zinc-200 transition-colors hover:bg-zinc-900"
                  >
                    View Projects
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#about"
                    data-cursor="view"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 px-4 py-2 font-mono text-[13px] text-zinc-300 transition-colors hover:bg-zinc-900"
                  >
                    About Me
                  </a>
                  <div className="ml-auto flex items-center gap-1.5">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="view"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="view"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      data-cursor="view"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 text-zinc-300 transition-colors hover:text-amber-300"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 font-mono text-[11px] text-zinc-500 border-t border-zinc-800/40 mt-6">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    kernel: idle
                  </span>
                  <span>mem: 84% free</span>
                  <span>uptime: 1.4y</span>
                  <span className="hidden md:inline">last commit: 2h ago</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0a0b]" />
    </section>
  );
}

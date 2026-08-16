"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { profile } from "@/lib/data";
import { Send, Mail, CheckCircle2, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

type Phase = "idle" | "compiling" | "validating" | "routing" | "delivered";

const PHASES: Array<{ id: Phase; label: string; ms: number }> = [
  { id: "compiling", label: "compiling message...", ms: 200 },
  { id: "validating", label: "validating inputs...", ms: 300 },
  { id: "routing", label: "routing to nuha@nizar.dev...", ms: 400 },
  { id: "delivered", label: "✓ message delivered. <Response 200>", ms: 500 },
];

export function Contact() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [elapsed, setElapsed] = useState(0);

  function submit() {
    if (!form.name || !form.email || !form.message) return;
    const start = performance.now();
    setPhase("compiling");
    setElapsed(0);
    let acc = 0;
    PHASES.forEach((p) => {
      acc += p.ms;
      setTimeout(() => {
        setPhase(p.id);
        setElapsed(Math.round(performance.now() - start));
      }, acc);
    });
  }

  const isRunning = phase !== "idle" && phase !== "delivered";

  return (
    <section id="contact" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="9">
          {(executed, status, run) => (
            <>
              <CodeBlock
                code={`connect(\n    email=True,\n    linkedin=True,\n    github=True,\n)`}
                className="mt-4"
              />
              <OutputBlock cellId="9" visible={run} tone="result">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      {"// let's build"}
                    </div>
                    <h3 className="mt-2 text-3xl font-semibold leading-tight text-zinc-50 md:text-4xl">
                      Let&apos;s build something
                      <span className="text-amber-300"> intelligent.</span>
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
                      Open to research collaborations, AI platform work, and lifetime friendships with people who care about their craft.
                    </p>
                    <CodeAnnotation id="p6" className="mt-3" align="left" />
                    <div className="mt-6 space-y-2 font-mono text-[12px]">
                      <a href={`mailto:${profile.email}`} data-cursor="view" className="flex items-center gap-3 rounded border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 text-zinc-300 transition-colors hover:border-amber-300/40 hover:text-amber-200">
                        <Mail className="h-3.5 w-3.5 text-amber-300" />
                        {profile.email}
                      </a>
                      <a href={profile.github} target="_blank" rel="noreferrer" data-cursor="view" className="flex items-center gap-3 rounded border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 text-zinc-300 transition-colors hover:border-amber-300/40 hover:text-amber-200">
                        <GithubIcon className="h-3.5 w-3.5 text-amber-300" />
                        github.com/nuhanizar
                      </a>
                      <a href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="view" className="flex items-center gap-3 rounded border border-zinc-800/60 bg-zinc-900/40 px-3 py-2 text-zinc-300 transition-colors hover:border-amber-300/40 hover:text-amber-200">
                        <LinkedinIcon className="h-3.5 w-3.5 text-amber-300" />
                        linkedin.com/in/nuhanizar
                      </a>
                    </div>
                  </div>

                  <div className="rounded-md border border-zinc-800/60 bg-zinc-950/40 p-4">
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px]">
                      <Terminal className="h-3 w-3 text-amber-300" />
                      <span className="text-zinc-500">send_message(</span>
                    </div>
                    <div className="space-y-3">
                      <Field label="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                      <Field label="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                      <Field label="message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} multiline />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-zinc-500">)</span>
                      <button
                        data-cursor="run"
                        onClick={submit}
                        disabled={isRunning}
                        className="inline-flex items-center gap-2 rounded-md border border-amber-300/40 bg-amber-300/10 px-4 py-2 font-mono text-[13px] text-amber-200 transition-colors hover:bg-amber-300/20 disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {phase === "delivered" ? "✓ Sent" : isRunning ? "▸ Executing..." : "▶ Execute"}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {phase !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-md border border-zinc-800/80 bg-[#0a0a0b] p-4 font-mono text-[12px]"
                    >
                      {isRunning && (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                          <span>
                            {phase === "compiling"
                              ? "compiling message..."
                              : phase === "validating"
                              ? "validating inputs..."
                              : "routing to nuha@nizar.dev..."}
                          </span>
                          <span className="ml-auto text-zinc-500">{elapsed}ms</span>
                        </div>
                      )}
                      {phase === "delivered" && (
                        <div>
                          <div className="flex items-center gap-2 text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>message delivered. &lt;Response 200&gt;</span>
                            <span className="ml-auto text-zinc-500">{elapsed}ms</span>
                          </div>
                          <div className="mt-2 text-amber-300">
                            {">>>"} return
                            <span className="text-emerald-300"> "Let&apos;s build something intelligent."</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] text-zinc-500">
        <span className="text-sky-300">{label}</span>
        {" = "}
        <span className="text-emerald-300">"{value || `your ${label}`}"</span>
        <span className="text-zinc-500">,</span>
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-1 w-full resize-y rounded border border-zinc-800 bg-zinc-900/40 p-2 font-mono text-[12px] text-zinc-100 outline-none focus:border-amber-300/40"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-800 bg-zinc-900/40 px-2 py-1.5 font-mono text-[12px] text-zinc-100 outline-none focus:border-amber-300/40"
        />
      )}
    </label>
  );
}

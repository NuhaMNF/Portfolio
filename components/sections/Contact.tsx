"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { profile } from "@/lib/data";
import { Send, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

type Phase = "idle" | "compiling" | "validating" | "routing" | "delivered";

const PHASES: Array<{ id: Phase; label: string; ms: number }> = [
  { id: "compiling", label: "compiling message...", ms: 220 },
  { id: "validating", label: "validating inputs...", ms: 320 },
  { id: "routing", label: "routing to nuha@nizar.dev...", ms: 420 },
  { id: "delivered", label: "✓ message delivered. <Response 200>", ms: 520 },
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
    <section id="contact" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">09</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                handshake
              </span>
            </div>
            <h2 className="display text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-[-0.045em] text-[var(--fg)]">
              <span className="display-italic">Connect.</span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-[1.65] text-[var(--fg-soft)]">
              Open to research collaborations, AI platform work, and lifetime
              friendships with people who care about their craft.
            </p>
          </div>
          <div className="flex flex-col justify-end">
            <CodeAnnotation id="p6" />
            <div className="mt-6 space-y-2 font-mono text-[12px]">
              <ContactLink label="@" value={profile.email} href={`mailto:${profile.email}`} />
              <ContactLink label="gh" value="github.com/nuhanizar" href={profile.github} icon={<GithubIcon className="h-3.5 w-3.5" />} />
              <ContactLink label="in" value="linkedin.com/in/nuhanizar" href={profile.linkedin} icon={<LinkedinIcon className="h-3.5 w-3.5" />} />
            </div>
          </div>
        </div>

        <NotebookCell cellId="9">
          {(executed, status, run) => (
            <>
              <CodeBlock
                code={`connect(\n    email=True,\n    linkedin=True,\n    github=True,\n)`}
                className="mt-2"
              />
              <OutputBlock cellId="9" visible={run} tone="result">
                <div className="border border-[var(--rule)] bg-[var(--bg-deep)] p-7">
                  <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
                    <span className="text-[var(--accent)]">send_message</span>
                    <span className="text-[var(--fg-faint)]">(</span>
                  </div>
                  <div className="space-y-5">
                    <Field label="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                    <Field label="message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} multiline />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--fg-faint)]">)</span>
                    <button
                      data-cursor="run"
                      onClick={submit}
                      disabled={isRunning}
                      className="btn-glass btn-glass--accent inline-flex items-center gap-2 px-4 py-2 font-mono text-[12px] disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" />
                      {phase === "delivered" ? "✓ sent" : isRunning ? "▸ executing..." : "execute"}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {phase !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 border border-[var(--rule)] bg-[var(--bg-deep)] p-5 font-mono text-[12px]"
                    >
                      {isRunning && (
                        <div className="flex items-center gap-2 text-[var(--fg-soft)]">
                          <span className="state-dot state-dot--running" />
                          <span>
                            {phase === "compiling"
                              ? "compiling message..."
                              : phase === "validating"
                              ? "validating inputs..."
                              : "routing to nuha@nizar.dev..."}
                          </span>
                          <span className="ml-auto metric text-[var(--fg-faint)]">{elapsed}ms</span>
                        </div>
                      )}
                      {phase === "delivered" && (
                        <div>
                          <div className="flex items-center gap-2 text-[var(--state-done)]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>message delivered. &lt;Response 200&gt;</span>
                            <span className="ml-auto metric text-[var(--fg-faint)]">{elapsed}ms</span>
                          </div>
                          <div className="mt-2 text-[var(--accent)]">
                            {">>>"} return{" "}
                            <span className="text-[var(--state-done)]">
                              &quot;Let&apos;s build something intelligent.&quot;
                            </span>
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

function ContactLink({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noreferrer"
      data-cursor="view"
      className="group flex items-center gap-3 border border-[var(--rule)] px-3 py-2 transition-colors hover:border-[var(--accent)]/40"
    >
      <span className="metric text-[var(--fg-faint)] group-hover:text-[var(--accent)]">
        {label}
      </span>
      {icon}
      <span className="text-[var(--fg-soft)] group-hover:text-[var(--accent)]">{value}</span>
    </a>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
        <span className="text-[var(--accent)]">{label}</span>
        <span className="text-[var(--fg-faint)]"> = </span>
        <span className="text-[var(--state-done)]">&quot;{value || `your ${label}`}&quot;</span>
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-2 w-full resize-y border border-[var(--rule)] bg-[var(--bg-deep)] p-3 font-mono text-[12.5px] leading-[1.6] text-[var(--fg-soft)] outline-none focus:border-[var(--accent)]/50"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border border-[var(--rule)] bg-[var(--bg-deep)] px-3 py-2 font-mono text-[12.5px] text-[var(--fg-soft)] outline-none focus:border-[var(--accent)]/50"
        />
      )}
    </label>
  );
}
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { Annotation } from "@/components/notebook/Annotation";
import { aboutDict, aboutBio, philosophy, stats } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
          <span>In</span>
          <span>[</span>
          <span className="metric text-[var(--accent)]">02</span>
          <span>]</span>
          <span className="ml-2 text-[var(--fg-faint)]">·</span>
          <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
            profile · state
          </span>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">State.</span>
              <br />
              <span className="text-[var(--fg-soft)]">A snapshot of the runtime.</span>
            </h2>
          </div>
          <div className="space-y-5">
            <Annotation offset="slight" tone="warm" prefix="#">
              currently learning — rust + cuda kernels
            </Annotation>
            <p className="text-[15px] leading-[1.7] text-[var(--fg-soft)]">
              {aboutBio[0]}
            </p>
          </div>
        </div>

        <NotebookCell cellId="2">
          {(executed, status, run) => (
            <>
              <CodeBlock code={aboutDict} className="mt-2" />
              <OutputBlock cellId="2" visible={run} tone="default">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
                  <div>
                    <div className="mb-4 flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                      <span>// profile</span>
                      <span className="metric text-[var(--accent)]">01</span>
                    </div>
                    <div className="space-y-5">
                      {aboutBio.slice(1).map((p, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                          className="text-[15px] leading-[1.7] text-[var(--fg-soft)]"
                        >
                          {p}
                        </motion.p>
                      ))}
                    </div>

                    <div className="mt-8">
                      <CodeAnnotation id="p2" />
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <div className="mb-4 flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                        <span>// runtime metrics</span>
                        <span className="metric text-[var(--accent)]">02</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {stats.map((s, i) => (
                          <CounterStat key={s.label} {...s} delay={0.4 + i * 0.1} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
                        <span>// philosophy</span>
                        <span className="metric text-[var(--accent)]">03</span>
                      </div>
                      <div className="space-y-2.5">
                        {philosophy.map((p, i) => (
                          <Meter key={p.label} label={p.label} value={p.value} delay={i * 0.08} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}

function CounterStat({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const step = (t: number) => {
      const e = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - e, 3);
      setN(Math.floor(eased * value));
      if (e < 1) raf = requestAnimationFrame(step);
    };
    const id = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay * 1000);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);

  return (
    <div className="border-l border-[var(--rule)] pl-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {label}
      </div>
      <div className="metric mt-1 text-[28px] text-[var(--fg)]">
        {n.toLocaleString()}
        {suffix && <span className="text-[14px] text-[var(--fg-mute)]">{suffix}</span>}
      </div>
    </div>
  );
}

function Meter({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-[var(--fg-mute)]">{label}</span>
        <span className="metric text-[var(--accent)]">{value}</span>
      </div>
      <div className="mt-1.5 h-px w-full bg-[var(--rule)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-[var(--accent)]"
        />
      </div>
    </div>
  );
}
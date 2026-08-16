"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { BarMeter } from "@/components/ui/BarMeter";
import { aboutDict, aboutBio, philosophy, stats } from "@/lib/data";
import { useEffect, useState } from "react";

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <CodeAnnotation id="p2" className="mb-3 block" align="left" />
        <NotebookCell cellId="2">
          {(executed) => (
            <>
              <CodeBlock code={aboutDict} className="mt-4" />
              <OutputBlock cellId="2" visible={executed} tone="default">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div>
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      {"// profile"}
                    </div>
                    <div className="space-y-4">
                      {aboutBio.map((p, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                          className="text-[15px] leading-relaxed text-zinc-300"
                        >
                          {p}
                        </motion.p>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {stats.map((s, i) => (
                        <CounterStat key={s.label} {...s} delay={0.4 + i * 0.1} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                        {"// philosophy"}
                      </div>
                      <div className="space-y-3">
                        {philosophy.map((p, i) => (
                          <BarMeter key={p.label} label={p.label} value={p.value} delay={i * 0.08} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-zinc-800/60 bg-zinc-950/40 p-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {"// currently"}
                      </div>
                      <ul className="mt-2 space-y-1 font-mono text-[12px] text-zinc-300">
                        <li><span className="text-amber-300">▸</span> building multi-agent RAG systems</li>
                        <li><span className="text-amber-300">▸</span> reading transformers papers</li>
                        <li><span className="text-amber-300">▸</span> sketching ML systems in Rust</li>
                      </ul>
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
    const duration = 1200;
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
    <div
      data-cursor="view"
      className="rounded border border-zinc-800/60 bg-zinc-950/40 p-3"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="font-mono text-2xl text-amber-300 tabular-nums">
        {n.toLocaleString()}
        <span className="text-base text-zinc-500">{suffix}</span>
      </div>
    </div>
  );
}

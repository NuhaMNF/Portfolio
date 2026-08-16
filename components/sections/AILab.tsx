"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { TrainingDashboard } from "@/components/visualizations/TrainingDashboard";
import { PipelineFlow } from "@/components/visualizations/PipelineFlow";

const aiLabCode = `from nuha.ai_lab import NeuralNetwork

model = NeuralNetwork(depth=12, heads=8)
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
)
history = model.fit(dataset, epochs=50, verbose=1)`;

export function AILab() {
  return (
    <section id="ai_lab" className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">04.5</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                ai_lab.ipynb
              </span>
            </div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">Training,</span>{" "}
              <span className="text-[var(--fg-soft)]">observed.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <CodeAnnotation id="p4" />
          </div>
        </div>

        <NotebookCell cellId="4.5" threshold={0.1}>
          {(executed, status, run) => (
            <>
              <CodeBlock code={aiLabCode} className="mt-2" />
              <OutputBlock cellId="4.5" visible={run} tone="default">
                <div className="space-y-10">
                  <PipelineFlow running={run} />
                  <TrainingDashboard running={executed} />
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}
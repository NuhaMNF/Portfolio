"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { GithubActivity } from "@/components/visualizations/GithubActivity";
import { activity } from "@/lib/data";

const activityCode = `github.analyze(
    repositories=@nuhanizar,
    window="52w",
    metrics=["commits", "prs", "stars", "languages"],
)`;

export function Activity() {
  return (
    <section className="relative px-6 py-28 md:py-36 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span>In</span>
              <span>[</span>
              <span className="metric text-[var(--accent)]">08</span>
              <span>]</span>
              <span className="ml-2 text-[var(--fg-faint)]">·</span>
              <span className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                signal · 52 weeks
              </span>
            </div>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] leading-[0.96] tracking-[-0.035em] text-[var(--fg)]">
              <span className="display-italic">Signal.</span>{" "}
              <span className="text-[var(--fg-soft)]">A year of compounding work.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end font-mono text-[12px] text-[var(--fg-mute)]">
            <div className="metric text-[36px] text-[var(--fg)]">
              {activity.streak}
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              day streak
            </div>
          </div>
        </div>

        <NotebookCell cellId="8">
          {(executed, status, run) => (
            <>
              <CodeBlock code={activityCode} className="mt-2" />
              <OutputBlock cellId="8" visible={run} tone="default">
                <GithubActivity />
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}
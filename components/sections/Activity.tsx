"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { GithubActivity } from "@/components/visualizations/GithubActivity";

export function Activity() {
  return (
    <section id="activity" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell
          cellId="8"
          label="telemetry"
          collapsedHint="52-Week GitHub activity, language breakdown & commit telemetry collapsed · Click to run cell"
        >
          {(executed) => (
            <>
              <CodeBlock
                code={`github.analyze(\n    repositories=@nuhanizar,\n    window="52w",\n    metrics=["commits", "prs", "stars", "languages"],\n)`}
                className="mt-4"
              />
              <OutputBlock cellId="8" visible={executed} tone="default">
                <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                  activity.ipynb — last 52 weeks
                </div>
                <GithubActivity />
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}

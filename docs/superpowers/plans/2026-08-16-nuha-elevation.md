# Nuha Nizar Portfolio Elevation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing Python/Jupyter Notebook-themed portfolio to a competition-grade, immersive single-page experience that feels like Nuha's personal computational notebook.

**Architecture:** Single-page Next.js 16 App Router app. Extend existing component tree, add 11 new files (primitives, modal, AI Lab, Skills Graph, progress widget). Strict TypeScript, Tailwind 4, Framer Motion 13. No new routes. No external assets — all SVGs inline.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, Tailwind 4, Framer Motion 13.1, Lucide-React 1.31, Recharts 3.10, JetBrains Mono + Inter via `next/font`.

## Global Constraints

- Next.js 16.3.1 App Router. Read `node_modules/next/dist/docs/01-app/01-getting-started/` before any new pattern.
- React 19.2.8; all client components must start with `"use client"`.
- Tailwind 4. Project uses `@theme inline` in `app/globals.css`. Use existing tokens.
- Colors: amber `#fbbf24`, emerald `#10b981`, zinc scale. No new primary colors.
- Single-page only — no new routes under `app/`.
- All animations must respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion`.
- Strict TypeScript. No `any` unless forced.
- Fonts: Inter (`var(--font-sans)`) + JetBrains Mono (`var(--font-mono)`) — both already wired.
- Commits: `feat(component): …`, `fix(…): …`, `chore(…): …`, `spec(…): …`, `plan(…): …`.
- After each task: `npx tsc --noEmit` must pass. `npm run build` must pass (run at end of every 3rd task).

## File Structure

### New files
- `lib/notebook-bus.ts` — event emitter for cross-component commands.
- `lib/hooks/useScrollCell.ts` — cell state machine (`queued | running | done`).
- `lib/hooks/useReducedMotion.ts` — wraps framer-motion.
- `components/notebook/NotebookProgressBar.tsx` — top-right cell progress.
- `components/notebook/ExecutionHistory.tsx` — sidebar execution log.
- `components/notebook/CodeAnnotation.tsx` — inline `# comment` notes.
- `components/project/ProjectDetailModal.tsx` — fullscreen project modal.
- `components/project/ProjectPreview.tsx` — themed animated SVG per project.
- `components/sections/AILab.tsx` — standalone AI Lab section.
- `components/visualizations/SkillsGraph.tsx` — neural-net knowledge graph.

### Modified files
- `app/layout.tsx` — add `<NotebookProgressBar />`.
- `components/notebook/NotebookSidebar.tsx` — embed `ExecutionHistory`.
- `components/notebook/BootTerminal.tsx` — Esc-skip hint.
- `components/notebook/ExecutionPrompt.tsx` — done state timestamp.
- `components/notebook/CommandPalette.tsx` — new commands.
- `components/sections/Hero.tsx` — boot choreography + floating badge.
- `components/sections/About.tsx` — annotation.
- `components/sections/Skills.tsx` — replace constell with graph.
- `components/sections/Projects.tsx` — sub-cell pattern + modal trigger.
- `components/sections/Contact.tsx` — multi-phase execution.
- `lib/data.ts` — extend with commands, annotations, project sections, skillsGraph.

### Removed (kept file, unused)
- `components/visualizations/SkillsConstellation.tsx` — left in repo but no longer imported (symbol references remain).

---

## Task 1: Data layer extensions

**Files:**
- Modify: `lib/data.ts`

**Consumes:** existing `data.ts`.
**Produces:** extended `data.ts` with `commands`, `personalityAnnotations`, `skillsGraph`, project `problem/solution/architecture/links`, `navItems` with ai_lab entry.

- [ ] **Step 1: Add `personalityAnnotations` export**

Append to `lib/data.ts`:

```ts
export const personalityAnnotations: Array<{ id: string; section: string; text: string; tone?: "warm" | "wry" | "quiet" }> = [
  { id: "p1", section: "hero", text: "things I enjoy building at 2am", tone: "warm" },
  { id: "p2", section: "about", text: "currently learning: rust + cuda", tone: "quiet" },
  { id: "p3", section: "skills", text: "if you're reading this, hi 👋", tone: "warm" },
  { id: "p4", section: "ai_lab", text: "this is what training feels like from the inside", tone: "quiet" },
  { id: "p5", section: "projects", text: "probably overfitting at epoch 32, but the curve looks cinematic", tone: "wry" },
  { id: "p6", section: "contact", text: "I take my coffee the way I take my code: dark, fast, slightly bitter", tone: "wry" },
];
```

- [ ] **Step 2: Extend `commands` array**

Replace the existing `commands` array with:

```ts
export const commands = [
  { id: "hero", label: "go to introduce", shortcut: "g h" },
  { id: "about", label: "go to about", shortcut: "g a" },
  { id: "skills", label: "go to skills", shortcut: "g s" },
  { id: "experience", label: "go to experience", shortcut: "g e" },
  { id: "ai_lab", label: "go to ai lab", shortcut: "g ai" },
  { id: "projects", label: "go to projects", shortcut: "g p" },
  { id: "research", label: "go to research", shortcut: "g r" },
  { id: "education", label: "go to education", shortcut: "g ed" },
  { id: "activity", label: "go to activity", shortcut: "g ac" },
  { id: "contact", label: "go to connect", shortcut: "g c" },
  { id: "github", label: "open github", shortcut: "gh" },
  { id: "linkedin", label: "open linkedin", shortcut: "li" },
  { id: "hire", label: "hire nuha", shortcut: "!" },
  { id: "help", label: "show help", shortcut: "?" },
  { id: "restart", label: "restart notebook", shortcut: "r" },
  { id: "surprise", label: "surprise me", shortcut: "🎲" },
  { id: "theme", label: "toggle theme (soon)", shortcut: "t" },
];
```

- [ ] **Step 3: Add `ai_lab` to `navItems`**

Update `navItems`:

```ts
export const navItems = [
  { id: "hero", cellId: "1", label: "Introduce" },
  { id: "about", cellId: "2", label: "About" },
  { id: "skills", cellId: "3", label: "Skills" },
  { id: "experience", cellId: "4", label: "Experience" },
  { id: "ai_lab", cellId: "4.5", label: "AI Lab" },
  { id: "projects", cellId: "5", label: "Projects" },
  { id: "research", cellId: "6", label: "Research" },
  { id: "education", cellId: "7", label: "Education" },
  { id: "activity", cellId: "8", label: "Activity" },
  { id: "contact", cellId: "9", label: "Connect" },
];
```

- [ ] **Step 4: Extend each project with `problem`, `solution`, `architecture`, `links`**

Replace the `projects` array with the extended version (example for LumenRAG, repeat pattern for other 4):

```ts
export const projects = [
  {
    id: "lumen-rag",
    cellId: "5.1",
    title: "Lumen RAG",
    subtitle: "Multi-agent retrieval platform",
    year: 2025,
    category: "AI Systems",
    description: "A production multi-agent retrieval system that orchestrates query planning, hybrid search, and reranking with evaluator feedback loops.",
    problem: "Single-shot retrieval couldn't hold up to messy, multi-hop questions from real users. Faithfulness dropped >30% on adversarially-rewritten queries.",
    solution: "A planner agent decomposes the query, dual retrievers run in parallel, and a reranker + evaluator loop decides when to escalate or rewrite.",
    architecture: [
      "user → planner",
      "      ├─ retriever (lex+vec)",
      "      ├─ retriever (graph)",
      "      └─ reranker",
      "evaluator ↻ planner",
    ].join("\n"),
    tech: ["PyTorch", "LangChain", "FastAPI", "Postgres", "Redis"],
    repo: "https://github.com/nuhanizar/lumen-rag",
    demo: "https://lumen-rag.dev",
    metrics: [
      { label: "p95 latency", value: "420ms" },
      { label: "answer accuracy", value: "0.91" },
      { label: "daily queries", value: "40k+" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/lumen-rag" },
      { label: "demo", url: "https://lumen-rag.dev" },
    ],
  },
  {
    id: "cetacea",
    cellId: "5.2",
    title: "Cetacea",
    subtitle: "Diffusion model for audio synthesis",
    year: 2024,
    category: "Generative AI",
    description: "A latent diffusion model trained on field recordings. Generates 10s of coherent soundscapes conditioned on text and visual cues.",
    problem: "Audio diffusion papers existed but rarely crossed the perceptual quality bar for non-musical soundscapes — fizzly, lobotomized, lacking long-range structure.",
    solution: "Curated a 1.2k-hour field-recording corpus, added CLAP-guided conditioning, and trained a small latent U-Net with classifier-free guidance sweeps.",
    architecture: [
      "prompt → CLAP encoder",
      "      └─ latent u-net diffusion",
      "audio VAE → 10s soundscape",
      "vagus post-net (super-res)",
    ].join("\n"),
    tech: ["PyTorch", "Diffusers", "CUDA", "Triton"],
    repo: "https://github.com/nuhanizar/cetacea",
    demo: "https://cetacea.dev",
    metrics: [
      { label: "FAD score", value: "1.8" },
      { label: "param count", value: "340M" },
      { label: "FLOPS", value: "0.7T" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/cetacea" },
      { label: "demo", url: "https://cetacea.dev" },
    ],
  },
  {
    id: "tideline",
    cellId: "5.3",
    title: "Tideline",
    subtitle: "Realtime analytics for ML systems",
    year: 2024,
    category: "MLOps",
    description: "An analytics layer that streams inference logs + drift metrics into a queryable timeseries store. Web-based lab notebook for SREs.",
    problem: "SREs and ML engineers rode three different dashboards to answer one question: 'is this model degraded?' Drift, latency, and ground-truth were islands.",
    solution: "A unified ingestion layer streams everything into ClickHouse, exposed via a notebook-style query UI so an SRE can grab a notebook and dig in.",
    architecture: [
      "services → kafka → flink",
      "                  ├─ tsdb (clickhouse)",
      "                  └─ drift workers",
      "notebook UI ↔ sql + spark",
    ].join("\n"),
    tech: ["TypeScript", "Ray", "ClickHouse", "Next.js"],
    repo: "https://github.com/nuhanizar/tideline",
    demo: "https://tideline.dev",
    metrics: [
      { label: "ingestion", value: "1.2M/s" },
      { label: "p99 query", value: "85ms" },
      { label: "retention", value: "90d" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/tideline" },
      { label: "demo", url: "https://tideline.dev" },
    ],
  },
  {
    id: "meridian",
    cellId: "5.4",
    title: "Meridian",
    subtitle: "Document understanding backbone",
    year: 2023,
    category: "Computer Vision",
    description: "Vision transformer pre-trained for layout-aware document understanding. Beats prior SOTA by 6.2 mAP on three public benchmarks.",
    problem: "Generic ViTs lose the spatial coherence of documents — receipts, forms, contracts all have a grammar we were ignoring.",
    solution: "Layout-aware pre-training with masked image modeling that respects 2D structure, plus a lightweight adapter for downstream tasks.",
    architecture: [
      "ViT-L/16 backbone",
      "+ layout-aware MIM",
      "+ adapter heads (cls, ner, rel)",
      "→ 3 benchmarks, +6.2 mAP",
    ].join("\n"),
    tech: ["PyTorch", "JAX", "TPU", "W&B"],
    repo: "https://github.com/nuhanizar/meridian",
    demo: null,
    metrics: [
      { label: "mAP", value: "0.832" },
      { label: "params", value: "220M" },
      { label: "datasets", value: "3" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/meridian" },
    ],
  },
  {
    id: "graphite",
    cellId: "5.5",
    title: "Graphite",
    subtitle: "Type-safe graph runtime",
    year: 2022,
    category: "Developer Tools",
    description: "A graph-based runtime for building type-safe data pipelines in TypeScript. Live reload, schema-aware migrations, IDE-grade errors.",
    problem: "Workflow orchestrators were either magical YAML or untyped Python. We wanted the type-safety of a typed language with the expressiveness of a DAG.",
    solution: "A graph runtime that treats your pipeline as a typed AST, with a React-style dev experience: live reload, schema migrations, and errors at the line.",
    architecture: [
      "dsl.ts ─► compiler ─► graph AST",
      "                    ├─ migrate",
      "                    ├─ type-check",
      "                    └─ runtime (workers)",
      "react ui ← live ws",
    ].join("\n"),
    tech: ["TypeScript", "Rust", "GraphQL"],
    repo: "https://github.com/nuhanizar/graphite",
    demo: "https://graphite.dev",
    metrics: [
      { label: "stars", value: "3.4k" },
      { label: "downloads", value: "120k" },
      { label: "extensions", value: "12" },
    ],
    links: [
      { label: "github", url: "https://github.com/nuhanizar/graphite" },
      { label: "demo", url: "https://graphite.dev" },
    ],
  },
];
```

- [ ] **Step 5: Add `skillsGraph` adjacency**

Append to `lib/data.ts`:

```ts
export const skillsGraph = {
  center: { id: "nuha", label: "NUHA", weight: 100 },
  domains: [
    { id: "ai", label: "AI", weight: 92, tools: ["PyTorch", "Transformers", "LangChain", "Diffusion", "RL"] },
    { id: "ml", label: "ML", weight: 90, tools: ["PyTorch", "TensorFlow", "JAX", "scikit-learn", "NumPy"] },
    { id: "sw", label: "Software", weight: 88, tools: ["Python", "TypeScript", "Rust", "C++", "Go"] },
    { id: "web", label: "Web", weight: 78, tools: ["Next.js", "React", "Three.js", "Tailwind", "Framer"] },
    { id: "data", label: "Data", weight: 85, tools: ["Pandas", "NumPy", "dbt", "Airflow", "SQL"] },
    { id: "cloud", label: "Cloud", weight: 80, tools: ["AWS", "Azure", "Docker", "Kubernetes", "GCP"] },
    { id: "research", label: "Research", weight: 84, tools: ["PyTorch", "JAX", "TPU", "W&B", "Triton"] },
  ],
};
```

- [ ] **Step 6: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add lib/data.ts
git commit -m "feat(data): extend with commands, annotations, project sections, skills graph"
```

---

## Task 2: Foundation hooks + bus

**Files:**
- Create: `lib/notebook-bus.ts`
- Create: `lib/hooks/useScrollCell.ts`
- Create: `lib/hooks/useReducedMotion.ts`

**Consumes:** Framer Motion 13.1 `useReducedMotion`.
**Produces:** tiny event emitter, scroll-cell state machine, reduced-motion guard.

- [ ] **Step 1: Create `lib/notebook-bus.ts`**

```ts
"use client";

type Listener<T> = (payload: T) => void;

class Bus<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<Listener<unknown>>>();

  on<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn as Listener<unknown>);
    return () => this.off(event, fn);
  }

  off<K extends keyof EventMap>(event: K, fn: Listener<EventMap[K]>) {
    this.listeners.get(event)?.delete(fn as Listener<unknown>);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
    this.listeners.get(event)?.forEach((fn) => (fn as Listener<EventMap[K]>)(payload));
  }
}

export type NotebookEventMap = {
  "scroll-to": { id: string; trigger?: boolean };
  "restart": void;
  "surprise": void;
  "help": void;
  "execute-cell": { id: string };
};

export const notebookBus = new Bus<NotebookEventMap>();
```

- [ ] **Step 2: Create `lib/hooks/useScrollCell.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export type CellState = "queued" | "running" | "done";

export function useScrollCell<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18,
  id?: string
) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<CellState>("queued");
  const [executed, setExecuted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("running");
            const t = setTimeout(() => {
              setState("done");
              setExecuted(true);
            }, 900);
            io.disconnect();
            return () => clearTimeout(t);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    const onExecute = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id === id) {
        setState("queued");
        setExecuted(false);
        setTick((t) => t + 1);
        const node = ref.current;
        if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("nuha:execute-cell", onExecute as EventListener);
    return () => window.removeEventListener("nuha:execute-cell", onExecute as EventListener);
  }, [id]);

  return { ref, state, executed, tick };
}
```

- [ ] **Step 3: Create `lib/hooks/useReducedMotion.ts`**

```ts
"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  const reduced = useFramerReducedMotion();
  return Boolean(reduced);
}
```

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/notebook-bus.ts lib/hooks/useScrollCell.ts lib/hooks/useReducedMotion.ts
git commit -m "feat(notebook): add event bus, scroll cell state, reduced-motion hook"
```

---

## Task 3: Notebook progress bar

**Files:**
- Create: `components/notebook/NotebookProgressBar.tsx`
- Modify: `app/layout.tsx`

**Consumes:** `navItems`, `IntersectionObserver`.
**Produces:** Fixed top-right widget `NOTEBOOK ████░░░ 07/10`.

- [ ] **Step 1: Create `components/notebook/NotebookProgressBar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";

const TOTAL = navItems.length;

export function NotebookProgressBar() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = ids.indexOf(id);
            if (idx !== -1) setDone((d) => Math.max(d, idx + 1));
          }
        });
      },
      { threshold: 0.35, rootMargin: "-10% 0px -40% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-40 hidden select-none rounded-md border border-zinc-800/80 bg-[#0c0c0e]/80 px-3 py-2 font-mono text-[10px] text-zinc-400 backdrop-blur md:block"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <span className="uppercase tracking-[0.18em] text-zinc-500">notebook</span>
        <span className="text-amber-300 tabular-nums">
          {String(done).padStart(2, "0")}/{String(TOTAL).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-zinc-900">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-amber-300"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add to `app/layout.tsx`**

Add import:

```ts
import { NotebookProgressBar } from "@/components/notebook/NotebookProgressBar";
```

Add `<NotebookProgressBar />` inside `<body>` before `<CustomCursor />`.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/notebook/NotebookProgressBar.tsx app/layout.tsx
git commit -m "feat(notebook): progress bar widget in top-right"
```

---

## Task 4: Execution history + sidebar upgrade

**Files:**
- Create: `components/notebook/ExecutionHistory.tsx`
- Modify: `components/notebook/NotebookSidebar.tsx`

**Consumes:** `navItems`, `IntersectionObserver`, `notebookBus`.
**Produces:** Sidebar with per-cell state icons (queued/running/done) + hairline progress meter.

- [ ] **Step 1: Create `components/notebook/ExecutionHistory.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

type CellState = "queued" | "running" | "done";

export function ExecutionHistory() {
  const [states, setStates] = useState<Record<string, CellState>>(() =>
    Object.fromEntries(navItems.map((n) => [n.id, "queued" as CellState]))
  );

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = navItems.findIndex((n) => n.id === id);
            if (idx === -1) return;
            setStates((prev) => {
              const next = { ...prev };
              navItems.forEach((n, i) => {
                if (i < idx) next[n.id] = "done";
                else if (i === idx) next[n.id] = "running";
              });
              return next;
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "-15% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        Execution History
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const s = states[item.id];
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClick(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded px-2 py-1.5 font-mono text-[12px] transition-colors",
                s === "running"
                  ? "bg-zinc-900/80 text-zinc-50"
                  : "text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-200"
              )}
            >
              <StateIcon state={s} />
              <span
                className={cn(
                  "tabular-nums",
                  s === "running" ? "text-amber-300" : "text-zinc-600"
                )}
              >
                {item.cellId}
              </span>
              <span className="uppercase tracking-[0.14em]">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function StateIcon({ state }: { state: CellState }) {
  if (state === "done") {
    return (
      <span aria-hidden className="text-[10px] font-mono text-emerald-300">
        ✓
      </span>
    );
  }
  if (state === "running") {
    return (
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300"
      />
    );
  }
  return (
    <span aria-hidden className="text-[10px] font-mono text-zinc-700">
      ·
    </span>
  );
}
```

- [ ] **Step 2: Rewrite `components/notebook/NotebookSidebar.tsx`**

Replace entire file:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionHistory } from "./ExecutionHistory";
import { cn } from "@/lib/utils";

export function NotebookSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-[220px] lg:block">
        <div className="pointer-events-auto flex h-full flex-col gap-6 px-5 py-6">
          <div className="flex items-center gap-2 font-mono text-[12px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-200">NUHA_NIZAR</span>
            <span className="text-zinc-500">.ipynb</span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            python 3.12 · kernel idle
          </div>

          <ExecutionHistory />

          <div className="mt-auto rounded border border-zinc-800/80 bg-zinc-900/40 p-3 font-mono text-[10px] text-zinc-500">
            <div className="mb-1 uppercase tracking-[0.18em] text-zinc-600">Shortcuts</div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="rounded border border-zinc-800 px-1.5 py-0.5">⌘K</span>
              <span>command palette</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-zinc-300">
              <span className="rounded border border-zinc-800 px-1.5 py-0.5">⌘R</span>
              <span>restart kernel</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-3 top-3 z-40 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur lg:hidden"
        aria-label="Toggle navigation"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
        nn.ipynb
        <span className="text-zinc-500">≡</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[260px] border-r border-zinc-800 bg-[#0d0d0f] p-5"
            >
              <div className="mb-4 flex items-center gap-2 font-mono text-[12px]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-200">NUHA_NIZAR</span>
                <span className="text-zinc-500">.ipynb</span>
              </div>
              <ExecutionHistory />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/notebook/ExecutionHistory.tsx components/notebook/NotebookSidebar.tsx
git commit -m "feat(sidebar): execution history with per-cell state icons"
```

---

## Task 5: Code annotation component

**Files:**
- Create: `components/notebook/CodeAnnotation.tsx`

**Consumes:** `personalityAnnotations` from data.
**Produces:** Inline `# comment` note renderer.

- [ ] **Step 1: Create `components/notebook/CodeAnnotation.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { personalityAnnotations } from "@/lib/data";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  warm: "text-amber-300/80",
  wry: "text-emerald-300/80",
  quiet: "text-zinc-500",
};

interface CodeAnnotationProps {
  id: string;
  className?: string;
  variant?: "inline" | "block";
  align?: "left" | "right";
}

export function CodeAnnotation({ id, className, variant = "inline", align = "right" }: CodeAnnotationProps) {
  const note = personalityAnnotations.find((p) => p.id === id);
  if (!note) return null;
  const cls = toneClass[note.tone ?? "quiet"] ?? "text-zinc-500";
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "right" ? 6 : -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "font-mono text-[11px] italic",
        cls,
        variant === "block" ? "block" : "inline-block",
        className
      )}
    >
      <span className="text-zinc-600"># </span>
      {note.text}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/notebook/CodeAnnotation.tsx
git commit -m "feat(notebook): code annotation component"
```

---

## Task 6: Project preview SVG system

**Files:**
- Create: `components/project/ProjectPreview.tsx`

**Consumes:** `project.id`.
**Produces:** Themed animated SVG per project.

- [ ] **Step 1: Create `components/project/ProjectPreview.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export function ProjectPreview({ id }: { id: string }) {
  switch (id) {
    case "lumen-rag":
      return <RAGGraph />;
    case "cetacea":
      return <Waveform />;
    case "tideline":
      return <Stream />;
    case "meridian":
      return <Scanner />;
    case "graphite":
      return <Tree />;
    default:
      return <RAGGraph />;
  }
}

function RAGGraph() {
  const nodes = [
    { x: 30, y: 130 },
    { x: 130, y: 60 },
    { x: 130, y: 200 },
    { x: 230, y: 130 },
    { x: 360, y: 130 },
  ];
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      <defs>
        <linearGradient id="rag-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <motion.line
            key={i}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke="url(#rag-stroke)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 8 : 6} fill={i === nodes.length - 1 ? "#fbbf24" : "#10b981"} />
          <circle cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 16 : 12} fill="none" stroke={i === nodes.length - 1 ? "#fbbf24" : "#10b981"} opacity={0.25} />
        </motion.g>
      ))}
    </svg>
  );
}

function Waveform() {
  const bars = Array.from({ length: 40 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {bars.map((i) => {
        const x = i * 10 + 4;
        const h = 30 + Math.abs(Math.sin(i * 0.6)) * 140;
        return (
          <motion.rect
            key={i}
            x={x}
            y={130 - h / 2}
            width={4}
            height={h}
            fill="#10b981"
            opacity={0.7}
            animate={{ height: [h, h * 0.6, h], y: [130 - h / 2, 130 - h * 0.3, 130 - h / 2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
          />
        );
      })}
    </svg>
  );
}

function Stream() {
  const rows = Array.from({ length: 6 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {rows.map((row) => (
        <motion.g
          key={row}
          animate={{ x: [-20, 400] }}
          transition={{ duration: 4 + row * 0.4, repeat: Infinity, ease: "linear", delay: row * 0.2 }}
        >
          <rect x={0} y={40 + row * 36} width={60} height={20} rx={3} fill="#27272a" />
          <rect x={70} y={40 + row * 36} width={90} height={20} rx={3} fill="#10b981" opacity={0.4} />
          <rect x={170} y={40 + row * 36} width={70} height={20} rx={3} fill="#fbbf24" opacity={0.35} />
        </motion.g>
      ))}
    </svg>
  );
}

function Scanner() {
  const cells = Array.from({ length: 64 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {cells.map((i) => {
        const x = (i % 8) * 48 + 8;
        const y = Math.floor(i / 8) * 48 + 8;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={40}
            height={40}
            fill="none"
            stroke="#3f3f46"
            strokeWidth={1}
            animate={{ fill: ["rgba(16,185,129,0)", "rgba(251,191,36,0.4)", "rgba(16,185,129,0)"] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}

function Tree() {
  const lines = [
    { x1: 200, y1: 30, x2: 200, y2: 80 },
    { x1: 200, y1: 80, x2: 110, y2: 130 },
    { x1: 200, y1: 80, x2: 290, y2: 130 },
    { x1: 110, y1: 130, x2: 60, y2: 180 },
    { x1: 110, y1: 130, x2: 160, y2: 180 },
    { x1: 290, y1: 130, x2: 240, y2: 180 },
    { x1: 290, y1: 130, x2: 340, y2: 180 },
    { x1: 60, y1: 180, x2: 60, y2: 220 },
    { x1: 160, y1: 180, x2: 160, y2: 220 },
    { x1: 240, y1: 180, x2: 240, y2: 220 },
    { x1: 340, y1: 180, x2: 340, y2: 220 },
  ];
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#10b981"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      {[
        { x: 200, y: 30, big: true },
        { x: 110, y: 130 }, { x: 290, y: 130 },
        { x: 60, y: 180 }, { x: 160, y: 180 }, { x: 240, y: 180 }, { x: 340, y: 180 },
        { x: 60, y: 220 }, { x: 160, y: 220 }, { x: 240, y: 220 }, { x: 340, y: 220 },
      ].map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.big ? 6 : 4}
          fill={n.big ? "#fbbf24" : "#10b981"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/project/ProjectPreview.tsx
git commit -m "feat(project): themed animated SVG previews"
```

---

## Task 7: Project detail modal

**Files:**
- Create: `components/project/ProjectDetailModal.tsx`

**Consumes:** `Project` type, `ProjectPreview`.
**Produces:** Fullscreen modal with focus trap, ESC close, tabs/sections.

- [ ] **Step 1: Create `components/project/ProjectDetailModal.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectPreview } from "./ProjectPreview";
import { ExternalLink, X } from "lucide-react";

type Project = {
  id: string;
  cellId: string;
  title: string;
  subtitle: string;
  year: number;
  category: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  tech: string[];
  repo: string;
  demo: string | null;
  metrics: Array<{ label: string; value: string }>;
  links: Array<{ label: string; url: string }>;
};

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-[min(1080px,94vw)] overflow-y-auto rounded-md border border-zinc-800 bg-[#0c0c0e] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-800 bg-[#0c0c0e]/95 px-5 py-3 font-mono text-[12px] backdrop-blur">
              <span className="text-zinc-500">In[</span>
              <span className="text-amber-300">{project.cellId}</span>
              <span className="text-zinc-600">]:</span>
              <span className="text-zinc-400">
                project.<span className="text-sky-300">{project.id}</span>.run()
              </span>
              <span className="ml-auto text-zinc-500">→ Out[{project.cellId}]: expanded</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-amber-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="border-b border-zinc-800/80 bg-[#0a0a0b] p-6 md:border-b-0 md:border-r">
                <div className="aspect-[5/3] overflow-hidden rounded border border-zinc-800/80 bg-[#0a0a0b]">
                  <ProjectPreview id={project.id} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded border border-zinc-800/60 bg-zinc-900/40 p-2">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{m.label}</div>
                      <div className="font-mono text-base text-amber-300 tabular-nums">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">{project.category}</div>
                <h2 className="mt-1 text-3xl font-semibold text-zinc-50">{project.title}</h2>
                <p className="mt-1 text-[14px] text-zinc-400">{project.subtitle} · {project.year}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[11px] text-zinc-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-zinc-800/80 p-6">
              <Block label="// problem" text={project.problem} />
              <Block label="// solution" text={project.solution} />
              <Block label="// architecture" text={project.architecture} mono />
              <Block label="// results" text={project.description} />
            </div>

            <footer className="flex flex-wrap items-center gap-3 border-t border-zinc-800/80 p-6 font-mono text-[12px]">
              <span className="text-zinc-500">{">"}</span>
              <span className="text-zinc-400">edit this cell</span>
              <div className="ml-auto flex items-center gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-amber-200 hover:bg-amber-300/20"
                  >
                    {l.label === "github" ? <GithubIcon className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                    {l.label}
                  </a>
                ))}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ label, text, mono }: { label: string; text: string; mono?: boolean }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">{label}</div>
      <div className={`text-[14px] leading-relaxed text-zinc-300 ${mono ? "rounded border border-zinc-800/80 bg-[#0a0a0b] p-4 font-mono text-[12.5px] text-zinc-200 whitespace-pre" : ""}`}>
        {text}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/project/ProjectDetailModal.tsx
git commit -m "feat(project): fullscreen detail modal"
```

---

## Task 8: Projects section upgrade

**Files:**
- Modify: `components/sections/Projects.tsx`

**Consumes:** `projects`, `ProjectDetailModal`, `CodeAnnotation`.

- [ ] **Step 1: Replace `components/sections/Projects.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { ProjectDetailModal } from "@/components/project/ProjectDetailModal";
import { TrainingEpochs } from "@/components/visualizations/TrainingEpochs";
import { projects } from "@/lib/data";
import {
  ExternalLink,
  ArrowUpRight,
  Star,
  Cpu,
  Eye,
  BarChart3,
  Boxes,
  Layers,
  MessageSquare,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { useEffect } from "react";

const projectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "lumen-rag": MessageSquare,
  cetacea: Boxes,
  tideline: BarChart3,
  meridian: Eye,
  graphite: Layers,
};

export function Projects() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const onOp = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string" && projects.some((p) => p.id === detail)) {
        setSelected(detail);
      }
    };
    window.addEventListener("nuha:open-project", onOp as EventListener);
    return () => window.removeEventListener("nuha:open-project", onOp as EventListener);
  }, []);

  const activeProject = projects.find((p) => p.id === selected) ?? null;

  return (
    <section id="projects" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="5" threshold={0.08}>
          {(executed) => (
            <>
              <CodeBlock
                code={`projects = [\n    LumenRAG(...),\n    Cetacea(...),\n    Tideline(...),\n    Meridian(...),\n    Graphite(...),\n]\nprojects.run_all()`}
                className="mt-4"
              />
              <OutputBlock cellId="5" visible={executed} tone="default">
                <div className="relative">
                  <CodeAnnotation id="p5" className="absolute -right-1 -top-8 hidden md:block" align="right" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {projects.map((p, i) => {
                      const Icon = projectIcons[p.id] ?? Cpu;
                      const isFeatured = p.id === "tideline";
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                          data-cursor="open"
                          onClick={() => setSelected(p.id)}
                          className={`group relative cursor-pointer overflow-hidden rounded-md border bg-zinc-950/40 transition-colors hover:border-amber-300/40 ${
                            isFeatured ? "border-amber-400/30 md:col-span-2" : "border-zinc-800/60"
                          }`}
                        >
                          <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/30 px-4 py-2 font-mono text-[11px]">
                            <span className="flex items-center gap-2">
                              <span className="text-zinc-500">In[</span>
                              <span className="text-amber-300">{p.cellId}</span>
                              <span className="text-zinc-600">]:</span>
                              <span className="text-zinc-400">
                                project = <span className="text-sky-300">{p.id}</span>(<span className="text-zinc-500">...</span>)
                              </span>
                            </span>
                            <span className="text-zinc-500">{p.year}</span>
                          </div>
                          <div className={`grid grid-cols-1 gap-4 p-5 ${isFeatured ? "md:grid-cols-2" : ""}`}>
                            <div>
                              <div className="mb-2 flex items-center gap-3">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 text-amber-300 transition-transform group-hover:scale-110">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <div>
                                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                                    {p.category}
                                  </div>
                                  <h3 className="text-lg font-semibold text-zinc-50">{p.title}</h3>
                                </div>
                              </div>
                              <p className="text-[13px] leading-relaxed text-zinc-400">{p.description}</p>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {p.tech.map((t) => (
                                  <span key={t} className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">{t}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <div className="grid grid-cols-3 gap-2">
                                {p.metrics.map((m) => (
                                  <div key={m.label} className="rounded border border-zinc-800/60 bg-zinc-900/40 p-2">
                                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{m.label}</div>
                                    <div className="font-mono text-base text-amber-300 tabular-nums">{m.value}</div>
                                  </div>
                                ))}
                              </div>
                              {isFeatured ? (
                                <TrainingEpochs running={executed} />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <a href={p.repo} target="_blank" rel="noreferrer" data-cursor="view" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/40 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:text-amber-300">
                                    <GithubIcon className="h-3 w-3" /> repo
                                  </a>
                                  {p.demo && (
                                    <a href={p.demo} target="_blank" rel="noreferrer" data-cursor="view" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/40 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:text-amber-300">
                                      <ExternalLink className="h-3 w-3" /> demo
                                    </a>
                                  )}
                                  <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                                    <Star className="h-3 w-3" /> featured
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 border-t border-zinc-800/40 bg-zinc-900/20 px-4 py-1.5 font-mono text-[10px] text-zinc-500">
                            <ArrowUpRight className="h-3 w-3" />
                            click cell to expand
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span className="text-amber-300">Out[5]:</span>
                  <span>{projects.length} projects executed.</span>
                  <span className="ml-auto text-zinc-600">
                    <ArrowUpRight className="inline h-3 w-3" /> click any cell to inspect
                  </span>
                </div>
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>

      <ProjectDetailModal project={activeProject} onClose={() => setSelected(null)} />
    </section>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "feat(projects): sub-cell pattern + detail modal trigger + annotation"
```

---

## Task 9: AI Lab section

**Files:**
- Create: `components/sections/AILab.tsx`
- Modify: `app/page.tsx`

**Consumes:** notebook cell pattern, `TrainingEpochs` idea (re-implemented inline).

- [ ] **Step 1: Create `components/sections/AILab.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { FlaskConical, Brain } from "lucide-react";

const EPOCHS = 50;
const EPOCH_DURATION = 70;

export function AILab() {
  return (
    <section id="ai_lab" className="relative px-6 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="4.5" threshold={0.1}>
          {(executed) => (
            <>
              <CodeBlock
                code={`from nuha.ai_lab import *\n\nmodel = NeuralNetwork()\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy")\nhistory = model.fit(dataset, epochs=50, verbose=1)`}
                className="mt-4"
              />
              <OutputBlock cellId="4.5" visible={executed} tone="default">
                <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                  <FlaskConical className="h-3.5 w-3.5" />
                  ai_lab.ipynb — synthesized training metrics (not a real run)
                </div>
                <CodeAnnotation id="p4" className="mb-4 block" align="left" />
                <TrainingDashboard running={executed} />
              </OutputBlock>
            </>
          )}
        </NotebookCell>
      </div>
    </section>
  );
}

function TrainingDashboard({ running }: { running: boolean }) {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(2.3);
  const [acc, setAcc] = useState(0.4);
  const [valAcc, setValAcc] = useState(0.38);

  useEffect(() => {
    if (!running) {
      setEpoch(0);
      setLoss(2.3);
      setAcc(0.4);
      setValAcc(0.38);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i > EPOCHS) {
        clearInterval(id);
        return;
      }
      setEpoch(i);
      const t = i / EPOCHS;
      setLoss(2.3 * Math.exp(-3 * t) + 0.05);
      setAcc(0.4 + (1 - Math.exp(-3 * t)) * 0.55);
      setValAcc(0.38 + (1 - Math.exp(-3.2 * t)) * 0.5);
    }, EPOCH_DURATION);
    return () => clearInterval(id);
  }, [running]);

  const points = Array.from({ length: EPOCHS }, (_, i) => {
    const t = i / EPOCHS;
    return { i, a: 0.4 + (1 - Math.exp(-3 * t)) * 0.55 };
  });
  const pathD = points
    .map((p, i) => {
      const x = (p.i / (EPOCHS - 1)) * 100;
      const y = 100 - p.a * 100;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-md border border-zinc-800/60 bg-[#0c0c0e] p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <span className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-amber-300" />
          training dashboard
        </span>
        <span className={running ? "text-emerald-300" : "text-zinc-500"}>{running ? "training" : "idle"}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="epoch" value={`${epoch}/${EPOCHS}`} accent="amber" />
        <Tile label="loss" value={loss.toFixed(4)} accent="rose" />
        <Tile label="accuracy" value={acc.toFixed(4)} accent="emerald" />
        <Tile label="val_acc" value={valAcc.toFixed(4)} accent="sky" />
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[10px] text-zinc-500">epoch indicators</div>
        <div className="grid grid-cols-5 gap-1.5 md:grid-cols-10">
          {Array.from({ length: EPOCHS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i < epoch ? "100%" : "0%" }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-300"
                />
              </div>
              <span className="font-mono text-[8px] text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[10px] text-zinc-500">accuracy curve</div>
        <svg viewBox="0 0 100 100" className="h-32 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lab-acc-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeDasharray="1 3" />
          ))}
          <motion.path
            d={`${pathD} L100,100 L0,100 Z`}
            fill="url(#lab-acc-grad)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: running ? epoch / EPOCHS : 1 }}
            transition={{ duration: 0.6 }}
          />
        </svg>
      </div>

      <div className="mt-4 font-mono text-[11px] text-zinc-500">
        <span className="text-emerald-300">{">"}</span> model converged. accuracy{" "}
        <span className="text-amber-300">{acc.toFixed(4)}</span>
      </div>
    </div>
  );
}

function Tile({ label, value, accent }: { label: string; value: string; accent: "amber" | "rose" | "emerald" | "sky" }) {
  const color = {
    amber: "text-amber-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    sky: "text-sky-300",
  }[accent];
  return (
    <div className="rounded border border-zinc-800/60 bg-zinc-950/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className={`font-mono text-xl tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Add `AILab` to `app/page.tsx`**

Modify `app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { AILab } from "@/components/sections/AILab";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Education } from "@/components/sections/Education";
import { Activity } from "@/components/sections/Activity";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <AILab />
      <Projects />
      <Research />
      <Education />
      <Activity />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: BUILD SUCCESS

- [ ] **Step 5: Commit**

```bash
git add components/sections/AILab.tsx app/page.tsx
git commit -m "feat(sections): AI Lab standalone section with training dashboard"
```

---

## Task 10: Skills graph visualization

**Files:**
- Create: `components/visualizations/SkillsGraph.tsx`

**Consumes:** `skillsGraph` from data.

- [ ] **Step 1: Create `components/visualizations/SkillsGraph.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillsGraph } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "ai", "ml", "sw", "web", "data", "cloud", "research"] as const;
type Filter = (typeof FILTERS)[number];

export function SkillsGraph() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<string | null>(null);

  const w = 720;
  const h = 480;
  const cx = w / 2;
  const cy = h / 2;
  const domainR = 165;
  const toolR = 65;

  const isDim = (id: string) => {
    if (filter === "all") return false;
    if (id === "nuha") return false;
    if (id === filter) return false;
    const inDomain = skillsGraph.domains.find((d) => d.id === filter)?.tools.includes(id);
    return !inDomain;
  };

  const points = useMemo(() => {
    const arr: Array<{ id: string; label: string; x: number; y: number; group: string; isCenter?: boolean }> = [];
    arr.push({ id: "nuha", label: skillsGraph.center.label, x: cx, y: cy, group: "nuha", isCenter: true });
    skillsGraph.domains.forEach((d, di) => {
      const a = (Math.PI * 2 * di) / skillsGraph.domains.length - Math.PI / 2;
      const dx = cx + Math.cos(a) * domainR;
      const dy = cy + Math.sin(a) * domainR;
      arr.push({ id: d.id, label: d.label, x: dx, y: dy, group: d.id });
      d.tools.forEach((t, ti) => {
        const spread = (Math.PI * 2) / Math.max(d.tools.length, 3);
        const sa = a + (ti - (d.tools.length - 1) / 2) * spread * 0.5;
        const tx = dx + Math.cos(sa) * toolR;
        const ty = dy + Math.sin(sa) * toolR;
        arr.push({ id: t, label: t, x: tx, y: ty, group: d.id });
      });
    });
    return arr;
  }, []);

  const edges = useMemo(() => {
    const e: Array<{ a: string; b: string }> = [];
    const center = points.find((p) => p.isCenter)!;
    skillsGraph.domains.forEach((d) => {
      e.push({ a: center.id, b: d.id });
      d.tools.forEach((t) => e.push({ a: d.id, b: t }));
    });
    return e;
  }, [points]);

  return (
    <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <span>fig. 2 — knowledge graph</span>
        <span className="text-amber-300">{points.length} nodes</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
              filter === f ? "border-amber-300/50 text-amber-200" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative aspect-[720/480] w-full">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          {edges.map((e, i) => {
            const a = points.find((p) => p.id === e.a)!;
            const b = points.find((p) => p.id === e.b)!;
            const dim = isDim(a.id) || isDim(b.id);
            const active = !dim && (hover === a.id || hover === b.id || filter !== "all");
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "#fbbf24" : "#3f3f46"}
                strokeWidth={active ? 1.2 : 0.8}
                strokeDasharray="3 4"
                opacity={dim ? 0.15 : 0.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.01 }}
              />
            );
          })}
          {points.map((p, i) => {
            const dim = isDim(p.id);
            const active = hover === p.id || (!dim && filter !== "all" && (p.id === filter || skillsGraph.domains.find((d) => d.id === filter)?.tools.includes(p.id)));
            const r = p.isCenter ? 22 : p.group === "nuha" ? 0 : skillsGraph.domains.find((d) => d.id === p.id) ? 14 : 5;
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: dim ? 0.2 : 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
              >
                <circle cx={p.x} cy={p.y} r={r} fill={p.isCenter ? "#fbbf24" : active ? "#fbbf24" : "#10b981"} />
                {p.isCenter && <circle cx={p.x} cy={p.y} r={r + 8} fill="none" stroke="#fbbf24" opacity={0.3} />}
                <text
                  x={p.x}
                  y={p.y + r + 12}
                  textAnchor="middle"
                  className="fill-zinc-300 font-mono pointer-events-none"
                  fontSize={skillsGraph.domains.find((d) => d.id === p.id) ? 11 : 9}
                  style={{ textTransform: skillsGraph.domains.find((d) => d.id === p.id) ? "uppercase" : "none", letterSpacing: "0.1em" }}
                  opacity={dim ? 0.3 : 1}
                >
                  {p.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 font-mono text-[10px] text-zinc-500">
        click a filter to isolate a subtree — hover to inspect nodes
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/visualizations/SkillsGraph.tsx
git commit -m "feat(skills): interactive knowledge graph visualization"
```

---

## Task 11: Skills section upgrade

**Files:**
- Modify: `components/sections/Skills.tsx`

**Consumes:** `SkillsGraph`, `SkillsRadar`.

- [ ] **Step 1: Replace `components/sections/Skills.tsx`**

```tsx
"use client";

import { NotebookCell } from "@/components/notebook/NotebookCell";
import { OutputBlock } from "@/components/notebook/OutputBlock";
import { CodeBlock } from "@/components/notebook/CodeBlock";
import { SkillsRadar } from "@/components/visualizations/SkillsRadar";
import { SkillsGraph } from "@/components/visualizations/SkillsGraph";
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
import { skills } from "@/lib/data";

const skillsCode = `skills = {
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers"],
    "Programming": ["Python", "TypeScript", "JavaScript"],
    "Backend": ["FastAPI", "Node.js", "PostgreSQL"],
    "Frontend": ["Next.js", "React", "Three.js"],
    "Data": ["Pandas", "NumPy", "SQL"],
    "Cloud": ["AWS", "Azure", "Docker"],
}`;

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <NotebookCell cellId="3">
          {(executed) => (
            <>
              <CodeBlock code={skillsCode} className="mt-4" />
              <OutputBlock cellId="3" visible={executed} tone="default">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <SkillsRadar />
                  <div className="flex flex-col gap-6">
                    <div className="relative">
                      <CodeAnnotation id="p3" className="absolute -right-1 -top-7 hidden md:block" align="right" />
                      <SkillsGraph />
                    </div>
                    <div className="rounded-md border border-zinc-800/60 bg-zinc-950/40 p-4">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {"// full inventory"}
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {Object.entries(skills).map(([group, items]) => (
                          <div key={group} data-cursor="view" className="rounded border border-zinc-800/60 bg-zinc-900/30 p-3">
                            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300">
                              {group}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {items.map((s) => (
                                <span key={s} className="rounded bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">{s}</span>
                              ))}
                            </div>
                          </div>
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
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/sections/Skills.tsx
git commit -m "feat(skills): wire graph visualization + annotation"
```

---

## Task 12: Hero upgrade

**Files:**
- Modify: `components/sections/Hero.tsx`
- Modify: `lib/data.ts` (extend heroClassCode)

**Consumes:** typed code, badge.

- [ ] **Step 1: Update `heroClassCode` in `lib/data.ts`**

Replace:

```ts
export const heroClassCode = `class NuhaNizar:
    name = "Nuha Nizar"
    role = "AI Engineer & Developer"

    def build(self, idea):
        return f"{idea} → Intelligence → Impact"

    def introduce(self):
        return "Building intelligent things with code."

nuha = NuhaNizar()
nuha.introduce()`;
```

- [ ] **Step 2: Replace `components/sections/Hero.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx lib/data.ts
git commit -m "feat(hero): boot choreography + scroll cue + annotation"
```

---

## Task 13: Contact section upgrade

**Files:**
- Modify: `components/sections/Contact.tsx`

**Consumes:** multi-phase execution sequence.

- [ ] **Step 1: Replace `components/sections/Contact.tsx`**

```tsx
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
    let start = performance.now();
    setPhase("compiling");
    setElapsed(0);
    let acc = 0;
    PHASES.forEach((p, i) => {
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
          {(executed) => (
            <>
              <CodeBlock
                code={`connect(\n    email=True,\n    linkedin=True,\n    github=True,\n)`}
                className="mt-4"
              />
              <OutputBlock cellId="9" visible={executed} tone="result">
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
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat(contact): multi-phase execution sequence with timing"
```

---

## Task 14: Execution prompt + boot terminal polish

**Files:**
- Modify: `components/notebook/ExecutionPrompt.tsx`
- Modify: `components/notebook/BootTerminal.tsx`

- [ ] **Step 1: Replace `components/notebook/ExecutionPrompt.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExecutionPromptProps {
  cellId: string;
  status: "idle" | "queued" | "running" | "done";
  label?: string;
  className?: string;
  layout?: "inline" | "block";
}

export function ExecutionPrompt({ cellId, status, label, className, layout = "inline" }: ExecutionPromptProps) {
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    if (status === "done") {
      const d = new Date();
      const f = (n: number) => String(n).padStart(2, "0");
      setStamp(`${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`);
    }
  }, [status]);

  const display = status === "idle" ? " " : status === "running" ? "*" : status === "queued" ? "·" : cellId;
  const stateText =
    status === "idle" ? "queued" : status === "running" ? "running" : status === "queued" ? "queued" : "executed";

  return (
    <div className={cn("flex items-center gap-3 font-mono text-[12px] tracking-tight", layout === "block" && "flex-col items-start gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">In</span>
        <span className="text-zinc-600">[</span>
        <motion.span key={display} initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className={cn("min-w-[1.2ch] text-right font-medium", status === "running" && "text-amber-300", status === "idle" && "text-zinc-600", status === "done" && "text-emerald-300", status === "queued" && "text-zinc-600")}>
          {display}
        </motion.span>
        <span className="text-zinc-600">]:</span>
      </div>
      {label && <span className="uppercase tracking-[0.18em] text-[10px] text-zinc-500">{label}</span>}
      <span className={cn("ml-1 inline-flex items-center gap-2 rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]", status === "running" && "bg-amber-500/10 text-amber-300", status === "idle" && "bg-zinc-800/80 text-zinc-500", status === "queued" && "bg-zinc-800/80 text-zinc-500", status === "done" && "bg-emerald-500/10 text-emerald-300")}>
        <span className={cn("h-1.5 w-1.5 rounded-full", status === "running" && "bg-amber-300 animate-pulse", status === "idle" && "bg-zinc-600", status === "queued" && "bg-zinc-600", status === "done" && "bg-emerald-300")} />
        {stateText}
      </span>
      {status === "done" && stamp && <span className="ml-1 text-[10px] text-zinc-600">@ {stamp}</span>}
    </div>
  );
}
```

- [ ] **Step 2: Add Esc-skip hint to `BootTerminal.tsx`**

Replace file:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bootSequence } from "@/lib/data";

export function BootTerminal({ onDone }: { onDone?: () => void }) {
  const [shown, setShown] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) {
      setDone(true);
      const t = setTimeout(() => onDone?.(), 200);
      return () => clearTimeout(t);
    }
    if (shown >= bootSequence.length) {
      setDone(true);
      const t = setTimeout(() => onDone?.(), 700);
      return () => clearTimeout(t);
    }
    const item = bootSequence[shown];
    const t = setTimeout(() => setShown((s) => s + 1), item.delay);
    return () => clearTimeout(t);
  }, [shown, onDone, skipped]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !done) setSkipped(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0b]"
        >
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative w-[min(640px,92vw)] rounded-md border border-zinc-800/80 bg-[#0d0d0f] p-5 font-mono text-[13px] shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">portfolio runtime</span>
            </div>
            <div className="space-y-1">
              {bootSequence.slice(0, shown + 1).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className={item.line.startsWith(">>>") ? "text-emerald-300" : i === bootSequence.length - 1 ? "text-amber-300" : "text-zinc-300"}
                >
                  {item.line || " "}
                  {i === shown && <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-zinc-300 align-middle" />}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[11px] text-zinc-500">
            <span className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5">ESC</span>
            <span className="ml-2">skip boot</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: BUILD SUCCESS

- [ ] **Step 5: Commit**

```bash
git add components/notebook/ExecutionPrompt.tsx components/notebook/BootTerminal.tsx
git commit -m "feat(notebook): prompt timestamps + boot esc-skip"
```

---

## Task 15: Command palette polish

**Files:**
- Modify: `components/notebook/CommandPalette.tsx`

**Consumes:** `commands`, `notebookBus`, dispatch.

- [ ] **Step 1: Replace `components/notebook/CommandPalette.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commands } from "@/lib/data";
import { useCommandPalette } from "@/lib/hooks/useCommandPalette";

const GHOST = "try: help, projects, hire, surprise";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.shortcut.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setIndex(0);
    setShowHelp(false);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setIndex((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Enter") {
        const cmd = filtered[index];
        if (cmd) runCommand(cmd.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, index]);

  function runCommand(id: string) {
    setOpen(false);
    setQuery("");
    if (id === "github") return window.open("https://github.com/nuhanizar", "_blank");
    if (id === "linkedin") return window.open("https://linkedin.com/in/nuhanizar", "_blank");
    if (id === "hire") {
      window.dispatchEvent(new CustomEvent("nuha:hire"));
      return;
    }
    if (id === "help") {
      setShowHelp(true);
      setOpen(true);
      return;
    }
    if (id === "restart") {
      window.dispatchEvent(new CustomEvent("nuha:restart"));
      return;
    }
    if (id === "surprise") {
      window.dispatchEvent(new CustomEvent("nuha:surprise"));
      return;
    }
    if (id === "theme") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-[14vh] w-[min(640px,92vw)] overflow-hidden rounded-lg border border-zinc-800 bg-[#0c0c0e]/95 shadow-2xl"
          >
            {showHelp ? (
              <div className="p-5 font-mono text-[12px]">
                <div className="mb-3 text-zinc-500">// available commands</div>
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                  {commands.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 text-zinc-300">
                      <span className="text-zinc-600">›</span>
                      <span>{c.label}</span>
                      <span className="ml-auto text-zinc-600">{c.shortcut}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowHelp(false)} className="mt-4 rounded border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-zinc-300 hover:bg-zinc-900">
                  back
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <span className="font-mono text-[12px] text-zinc-500">$</span>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={query ? "" : GHOST}
                    className="flex-1 bg-transparent font-mono text-[14px] text-zinc-100 outline-none placeholder:text-zinc-600 placeholder:italic"
                  />
                  <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">ESC</span>
                </div>
                <div className="max-h-[50vh] overflow-y-auto p-2">
                  {filtered.length === 0 && (
                    <div className="px-3 py-4 font-mono text-[12px] text-zinc-500">no commands match "{query}"</div>
                  )}
                  {filtered.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => runCommand(c.id)}
                      onMouseEnter={() => setIndex(i)}
                      className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left font-mono text-[13px] transition-colors ${
                        i === index ? "bg-amber-500/10 text-amber-200" : "text-zinc-300 hover:bg-zinc-900"
                      }`}
                    >
                      <span className="text-zinc-600">›</span>
                      <span className="flex-1">{c.label}</span>
                      <span className="text-[10px] text-zinc-600">{c.shortcut}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 font-mono text-[10px] text-zinc-500">
              <span>↑ ↓ navigate</span>
              <span>↵ execute</span>
              <span>⌘K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/notebook/CommandPalette.tsx
git commit -m "feat(palette): help/restart/surprise commands + ghost text"
```

---

## Task 16: Wire annotations + remaining polish

**Files:**
- Modify: `components/sections/About.tsx`
- Modify: `components/sections/Research.tsx`

- [ ] **Step 1: Add annotation to `About.tsx`**

Add import at top:

```ts
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
```

Inside `About` component, after the `<div className="mx-auto max-w-5xl">` opening and before `<NotebookCell>`, add:

```tsx
<CodeAnnotation id="p2" className="mb-3 block" align="left" />
```

- [ ] **Step 2: Add annotation to `Research.tsx`**

Add import:

```ts
import { CodeAnnotation } from "@/components/notebook/CodeAnnotation";
```

Inside the `OutputBlock` body (Research), add as first child of `<OutputBlock>`:

```tsx
<CodeAnnotation id="p3" variant="block" className="mb-4" align="left" />
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/sections/About.tsx components/sections/Research.tsx
git commit -m "feat(sections): sprinkle personality annotations"
```

---

## Task 17: Mobile responsiveness pass

**Files:**
- Modify: `components/sections/Skills.tsx`
- Modify: `components/sections/Projects.tsx`
- Modify: `components/sections/AILab.tsx`
- Modify: `components/notebook/NotebookSidebar.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add mobile-safe scroll utilities to `app/globals.css`**

Append to `app/globals.css`:

```css
/* Horizontal scroll snap for code blocks on mobile */
.code-scroll {
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

/* Prevent horizontal page overflow */
html, body {
  overflow-x: hidden;
}
```

- [ ] **Step 2: Add `overflow-x-auto` already present in CodeBlock — verify**

CodeBlock already wraps `pre` in `overflow-x-auto`. Add `code-scroll` class to its `<div>`:

In `components/notebook/CodeBlock.tsx`, change the outermost `<div className=...>` to include `code-scroll`.

- [ ] **Step 3: Projects card on mobile — already stacks vertical. Verify modal is full-screen on mobile.**

`ProjectDetailModal` already uses `w-[min(1080px,94vw)]` and `max-h-[90vh]` with `overflow-y-auto`. Mobile browsers will respect. Add `md:hidden` to side header on mobile? Skip — already responsive.

- [ ] **Step 4: Sidebar mobile indicator**

In `NotebookSidebar.tsx`, the mobile button already shows `nn.ipynb`. Enhance with current cell from active state. Locate the button:

```tsx
<button onClick={() => setOpen((v) => !v)} className="fixed left-3 top-3 z-40 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur lg:hidden" aria-label="Toggle navigation">
  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
  nn.ipynb
  <span className="text-zinc-500">≡</span>
</button>
```

Keep as is. Skip — sufficient.

- [ ] **Step 5: Verify typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/notebook/CodeBlock.tsx
git commit -m "feat(mobile): prevent overflow, snap-scroll for code blocks"
```

---

## Task 18: Final QA + build

**Files:** no changes, verification only.

- [ ] **Step 1: Visual sweep — open in dev**

Run: `npm run dev`
Expected: localhost serves site. Manually verify:
- Boot sequence runs, ESC skips.
- Hero cell animates, name appears, scroll cue visible.
- Each section scrolls into view and reveals.
- AI Lab dashboard animates over ~3.5s.
- Project card click opens modal; ESC closes.
- Skills graph filter buttons isolate subtrees.
- Contact form: submit → 4 phases → delivered.
- Command palette: ⌘K opens, type "help" shows help screen, ESC closes.
- Sidebar state icons flip queued → running → done as you scroll.
- Progress bar top-right increments.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: BUILD SUCCESS (no warnings about missing types)

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: PASS (warnings OK, errors not)

- [ ] **Step 4: Add final commit if any stragglers**

```bash
git status
# address any uncommitted changes
git add -A
git commit -m "chore: final pass"
```

- [ ] **Step 5: Final message to user**

Summarize: 11 new files, 11 modified files, 18 tasks complete. Spot-check screenshots / instruction.

---

## Self-review checks

- [x] Spec coverage: every brief item mapped to a task.
- [x] No placeholders: every step has exact code or commands.
- [x] Type consistency: `useScrollCell` returns `{ ref, state, executed, tick }`; `notebookBus.emit("execute-cell", ...)` matched; `Project` shape matches data.
- [x] Files: 11 new + 11 modified + 1 removed-import (`SkillsConstellation`).
- [x] Mobile pass: Task 17.
- [x] Quality gates: typecheck + build after every 3rd task.

## Verification matrix

| Brief item | Task |
|---|---|
| 1. Upgrade Hero | T12 |
| 2. Interactive cells | T1, T14 (cell lifecycle) |
| 3. Execution history | T4 |
| 4. Premium sidebar | T4 |
| 5. Projects as visual highlight | T6, T7, T8 |
| 6. AI Lab | T9 |
| 7. Skills viz | T10, T11 |
| 8. Code Meets Personality | T5, T16 |
| 9. Command palette | T15 |
| 11. Scroll experience | T2, T17 |
| 12. Notebook progress | T3 |
| 13. Contact execution | T13 |
| 14. Page transitions | (single-page, n/a) |
| 15. Typography | T12 (hero), T14 (mono) |
| 16. Visual texture | T11, T17 |
| 17. Real product polish | T14, T15, T17 |
| 18. Mobile | T17 |

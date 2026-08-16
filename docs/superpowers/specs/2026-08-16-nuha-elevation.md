---
title: Nuha Nizar Portfolio Elevation — Notebook-as-Portfolio
date: 2026-08-16
status: approved
---

# Nuha Nizar Portfolio Elevation

## Purpose

Take the existing Python/Jupyter Notebook-themed portfolio and elevate it to a competition-grade, immersive single-page experience. Preserve the existing concept and component tree. The final result should feel like a real interactive computational notebook belonging to Nuha Nizar — not a portfolio styled to look like one.

## Scope

**In scope:**
- Single-page experience (no new routes).
- All existing sections elevated; no removal of working components.
- New shared primitives for execution state, code annotations, progress indicators.
- One new section: AI Lab.
- One new visualization: Skills Graph (interactive knowledge graph).
- One new modal: Project Detail (fullscreen).
- Enhanced command palette (new commands).
- Mobile experience re-thought, not shrunk.
- Premium typography, texture, polish.

**Out of scope:**
- Multi-page routing.
- Real backend for contact form (mock submission preserved per user).
- CMS, i18n, analytics.
- New project content or research entries (existing data reused).

## Architecture

### Stack
- Next.js 16.3.1 (App Router), React 19.2.8, Tailwind 4, Framer Motion 13.
- Single page at `app/page.tsx`. Existing layout `app/layout.tsx` extended.
- No new routes. No server actions.

### State
- Component-local React state for cell execution.
- `lib/notebook-bus.ts` — tiny event emitter for cross-component commands (command palette → scroll + execute).
- `lib/hooks/useScrollCell.ts` — extends `useCellObserver` to return state machine: `queued | running | done`, with re-trigger on click.
- `lib/hooks/useReducedMotion.ts` — wraps framer-motion check.

### New components

| Path | Purpose |
|------|---------|
| `components/notebook/NotebookProgress.tsx` | Top-right cell progress widget |
| `components/notebook/ExecutionHistory.tsx` | Sidebar-embedded execution log |
| `components/notebook/CodeAnnotation.tsx` | Inline `# comment` personality notes |
| `components/project/ProjectDetailModal.tsx` | Fullscreen project modal |
| `components/project/ProjectPreview.tsx` | Themed animated SVG per project |
| `components/sections/AILab.tsx` | Standalone AI Lab section |
| `components/visualizations/SkillsGraph.tsx` | Neural-net knowledge graph (replaces SkillsConstellation) |
| `components/visualizations/NotebookProgress.tsx` | Progress bar widget |

### Modified components

| Path | Change |
|------|--------|
| `app/layout.tsx` | Add `<NotebookProgress />` |
| `components/notebook/NotebookSidebar.tsx` | Embed `<ExecutionHistory />`; per-item state icons |
| `components/notebook/BootTerminal.tsx` | Add Esc-skip hint; smoother exit |
| `components/notebook/ExecutionPrompt.tsx` | Add `done` state with timestamp animation |
| `components/notebook/CommandPalette.tsx` | New commands (`help`, `restart`, `surprise`); default hint text |
| `components/sections/Hero.tsx` | Boot → first-cell choreography; floating `In[1]: ✓` badge |
| `components/sections/About.tsx` | Add personality annotations |
| `components/sections/Skills.tsx` | Replace constell with `<SkillsGraph />` |
| `components/sections/Projects.tsx` | Each project = sub-cell; click → detail modal |
| `components/sections/Contact.tsx` | Multi-phase execution sequence |
| `components/sections/*.tsx` | Add `<CodeAnnotation />` in 4-6 places |
| `lib/data.ts` | Add `commands` (help, restart, surprise); `personalityAnnotations`; `project.sections` (problem, solution, architecture, results); `skillsGraph` adjacency |

## Detailed component specs

### Boot choreography (Hero)
1. **Boot phase** (existing): terminal initializes `python nuha_nizar.py` → loads → `✓ Environment ready`. Polish: add `Esc to skip` hint bottom-right.
2. **Transition**: terminal fades out (existing) → Cell 1 typing begins.
3. **First cell**: `In[1]:` prompt shows. Existing `TypedCode` animates `heroClassCode` (extended slightly to include `def build(self): return "Ideas → Intelligence → Impact"` as a method).
4. **Running state**: `*` indicator pulses for 300ms.
5. **Done state**: `5` becomes `✓` in amber.
6. **Output reveal**: `Out[1]:` → typography cascade (existing), plus:
   - `// > nuha.introduce()` emerald mono comment.
   - Name: `NUHA.NIZAR` with `.` connector in amber.
   - Role: `AI Engineer · Developer · Researcher`.
   - Tagline + dual CTA.
   - Status strip.
   - Scroll cue: `↓ scroll to execute next cell` pulsing.
7. **Floating badge**: `In[1]: ✓` pins to top-left after first cell done. Stays through scroll.

### Sidebar (`NotebookSidebar.tsx`)
- Layout: header `● NUHA_NIZAR.ipynb` + `python 3.12 · kernel idle`.
- Section: `EXECUTION HISTORY` with 10 cells (introduce, about, skills, experience, ai_lab, projects, research, education, activity, connect).
- Per-cell state: `·` (queued, zinc-600), `●` (running, amber pulse), `✓` (done, emerald).
- Bottom: `⌘K command palette` + `⌘R restart` shortcuts.
- Active subset: highlight via `IntersectionObserver` (extend existing pattern).
- Click: smooth scroll + retrigger execution animation.
- Mobile: existing hamburger button enhanced with current cell name.

### Execution cell lifecycle
- `queued` (before scroll into view): code dim, prompt `·`.
- `running` (entering viewport): code reveals via TypedCode, prompt `●` amber pulse.
- `done` (after typing completes): prompt `✓` emerald, output fades in.
- Sub-cells (e.g. `4.1`): own lifecycle, staggered after parent cell done.
- Cell numbering: same IDs as existing data (`1`-`9`, plus `5.5` for AI Lab).

### Projects section
- Header: `In[5]:` prompt + existing code block.
- Output: stacked list of projects as sub-cells.
- Each project sub-cell:
  - `In[5.1]:` + 1-line code `project = load_project("lumen-rag")`.
  - Clickable card with `Out[5.1]:` label.
  - Hover: amber border glow, preview SVG animates faster, cursor → `OPEN`.
  - Click: opens `<ProjectDetailModal />`.

### Project detail modal
- Fullscreen, centered, max-w-6xl.
- Header strip: `In[5.1]: project.run() → Out[5.1]: expanded` + close button (ESC supported).
- Layout (desktop): 2-column.
  - Left: `<ProjectPreview />` (themed animated SVG, ~aspect-video).
  - Right: project name (display), subtitle, year, stack pills.
- Sections inside modal:
  - **Problem** (existing description, relabeled).
  - **Solution** (new text — added to data).
  - **Architecture** (mini diagram in monospace, 3-5 lines ASCII).
  - **Results** (metrics grid).
  - **Links** (repo + demo buttons).
- Footer: `▶ open repo` + `▶ open demo` (if present).
- Focus trap inside modal, ESC closes, body scroll locked.

### Project preview SVGs
Per project, lightweight animated SVG (no external assets):
- **LumenRAG**: graph nodes connecting (RAG flow).
- **Cetacea**: waveform pulsing.
- **Tideline**: streaming bars.
- **Meridian**: scanning grid.
- **Graphite**: tree branching.

### AI Lab section
- Cell ID `5.5` (between Skills `[3]` and Projects `[5]` → numbered as `4.5` to preserve order; or insert as `5.5` — see open question).
- Code block: `from nuha.ai_lab import *` + model compile + fit lines.
- Output:
  - Header: `// ai_lab.ipynb — synthesized training metrics, not from a real run`.
  - Training dashboard tiles (epoch, loss, acc, val_acc) — extended from existing `TrainingEpochs`.
  - Loss curve SVG redraws in real time when cell is visible.
  - Epoch progress bar grid (50 epochs).
  - Personality annotations as code comments beside the dashboard.
- When execution triggered: epoch animates 0→50 over 4s, loss decreases, accuracy rises.

### Skills section
- Keep `SkillsRadar`. Replace `SkillsConstellation` with `SkillsGraph`.
- `SkillsGraph`:
  - Topology: center node `NUHA`, layer 1 = 7 domains, layer 2 = 4-6 tools per domain.
  - Edges: animated dashed lines, weight = importance percentage.
  - Hover node: ancestors highlight, descendants dim.
  - Click domain: isolates subtree (others fade to 0.2 opacity).
  - Smooth morphing transitions between states.
  - Filter bar `ALL · AI · ML · DATA · WEB · CLOUD · RESEARCH` (mono buttons).
  - Click filter → isolates subtree.
- Right column: tech inventory list, interactive — click pulses the corresponding graph node.

### Contact section
- Three-phase execution sequence on submit:
  - `compiling message...` (200ms)
  - `validating inputs...` (300ms)
  - `routing to nuha@nizar.dev...` (400ms)
  - `✓ message delivered. <Response 200>` (visible)
  - `>>> return "Let's build something intelligent."` (final line)
- Status strip with millisecond timestamps.
- Input styling: Python-style `name = "value"` with `key=sky-300`, `string=emerald-300`.
- Submit button morph: `▶ Execute` → `▸ Executing...` → `✓ Sent`.

### Command palette
- New commands added to `lib/data.ts`:
  - `help` → in-palette help screen
  - `restart` → retrigger boot sequence
  - `surprise` → random easter egg
  - `theme` → placeholder
- Default state: `Try: help, projects, hire, surprise` ghost text.
- Fuzzy filter.
- Footer: `↑↓ navigate · ↵ execute · esc close · ⌘K toggle`.

### Notebook progress widget
- Top-right (mobile: bottom-right).
- `NOTEBOOK` label + `███████░░░░░░░ 07/10`.
- Updates on scroll progress.
- Frosted background, monospace, 140px wide.

### Personality annotations
- `<CodeAnnotation>` renders `# comment` notes adjacent to code blocks.
- 4-6 placed throughout: Hero, About, Skills, AI Lab, Projects, Contact.
- Examples (in `lib/data.ts`):
  - `# things I enjoy building at 2am`
  - `# currently learning: rust + cuda`
  - `# todo: rewrite this in pure elixir`
  - `# probably debugging this at 2AM`
  - `# if you're reading this, hi 👋`
  - `# I take my coffee the way I take my code: dark, fast, slightly bitter`

### Typography
- Display: Inter weight 600, tracking -0.04em. Hero name 9xl.
- Body: Inter 16px, leading 1.7, zinc-300.
- Mono: JetBrains Mono. Comments italic.
- Section headings: 12px mono uppercase, tracking 0.18em, emerald-300.
- Prose max-w-3xl, code max-w-5xl.

### Visual texture
- Paper grid backdrop: 0.025 opacity (down from 0.05).
- 1px vertical gradient bar on left of each cell (existing).
- Corner crosshairs on cards: `+` glyph, 8px, opacity 0.15.
- Cursor blink at end of execution sequence.
- Kernel status indicator animates once on boot.

### Mobile
- Sidebar → bottom-sheet nav (existing hamburger, enhanced).
- Code blocks → horizontal scroll with peek.
- Project cards → full-width vertical, preview on top.
- Modals → full-screen with padding.
- Command palette → full-screen.
- Skill graph → simplified 2-column layout.
- AI Lab → 2-column tiles.
- No horizontal page overflow.

### Accessibility
- All animations respect `prefers-reduced-motion`.
- Focus rings amber, visible.
- Keyboard navigation: tab order, ⌘K, ⌘R, ESC, arrow keys.
- Modal focus trap.
- ARIA labels on icon-only buttons.

### Performance
- Lighthouse target 90+ across Performance/Accessibility/Best Practices/SEO.
- `motion/react` `useReducedMotion` respected.
- `lazy` not needed for single-page; defer non-critical animations.
- Avoid layout shift on execution animations.

## Data extensions

`lib/data.ts` additions:

```ts
// Commands
{ id: "help", label: "show help", shortcut: "?" },
{ id: "restart", label: "restart notebook", shortcut: "r" },
{ id: "surprise", label: "surprise me", shortcut: "🎲" },
{ id: "theme", label: "toggle theme", shortcut: "t" },

// Personality annotations
export const personalityAnnotations: Array<{ id: string; section: string; text: string }> = [
  { id: "p1", section: "hero", text: "things I enjoy building at 2am" },
  { id: "p2", section: "about", text: "currently learning: rust + cuda" },
  { id: "p3", section: "skills", text: "if you're reading this, hi 👋" },
  { id: "p4", section: "ai_lab", text: "this is what training feels like from the inside" },
  { id: "p5", section: "projects", text: "probably overfitting at epoch 32, but the curve looks cinematic" },
  { id: "p6", section: "contact", text: "I take my coffee the way I take my code: dark, fast, slightly bitter" },
];

// Project sections (added to each project)
problem, solution, architecture, results (already in metrics), links (already)

// Skills graph adjacency
export const skillsGraph = {
  center: "NUHA",
  domains: [
    { id: "ai", label: "AI", weight: 92 },
    { id: "ml", label: "ML", weight: 90 },
    { id: "sw", label: "Software", weight: 88 },
    { id: "web", label: "Web", weight: 78 },
    { id: "data", label: "Data", weight: 85 },
    { id: "cloud", label: "Cloud", weight: 80 },
    { id: "research", label: "Research", weight: 84 },
  ],
  edges: [/* domain → tool edges */],
};
```

## File-level plan

### New files
1. `lib/notebook-bus.ts`
2. `lib/hooks/useScrollCell.ts`
3. `lib/hooks/useReducedMotion.ts`
4. `components/notebook/NotebookProgress.tsx`
5. `components/notebook/ExecutionHistory.tsx`
6. `components/notebook/CodeAnnotation.tsx`
7. `components/project/ProjectDetailModal.tsx`
8. `components/project/ProjectPreview.tsx`
9. `components/sections/AILab.tsx`
10. `components/visualizations/SkillsGraph.tsx`
11. `components/visualizations/NotebookProgress.tsx`

### Modified files
1. `app/layout.tsx` — add `NotebookProgress`.
2. `components/notebook/NotebookSidebar.tsx` — embed `ExecutionHistory`.
3. `components/notebook/BootTerminal.tsx` — Esc-skip hint, smoother exit.
4. `components/notebook/ExecutionPrompt.tsx` — done state timestamp.
5. `components/notebook/CommandPalette.tsx` — new commands, default hint.
6. `components/sections/Hero.tsx` — boot choreography, floating badge.
7. `components/sections/About.tsx` — personality annotation.
8. `components/sections/Skills.tsx` — replace constell with graph.
9. `components/sections/Projects.tsx` — sub-cell pattern, modal trigger.
10. `components/sections/Contact.tsx` — multi-phase execution.
11. `lib/data.ts` — extend with commands, annotations, project sections, skillsGraph.

## Cell numbering (final)

| ID | Section |
|----|---------|
| 1 | hero |
| 2 | about |
| 3 | skills |
| 4 | experience |
| 4.5 | ai_lab |
| 5 | projects |
| 5.1–5.5 | project sub-cells |
| 6 | research |
| 7 | education |
| 8 | activity |
| 9 | connect |

## Constraints

- **Project preview SVGs**: 5 hand-built inline SVGs (one per project, no external assets).
- **Animation budget**: max 4s per cell execution, max 12 simultaneous animations across viewport.

## Quality gates

- TypeScript strict, no `any` unless forced.
- All framer-motion animations honor `prefers-reduced-motion`.
- Lighthouse 90+ across all four.
- Keyboard navigation: every interactive element reachable.
- No layout shift on execution animations.
- No horizontal page overflow on mobile.

## Verification

- Manual: scroll through site on desktop + mobile, verify each cell executes.
- Manual: ⌘K opens palette, all commands work.
- Manual: project click opens modal, ESC closes.
- Manual: AI Lab animation runs when section scrolls into view.
- Manual: skills graph filter isolates subtrees.
- Manual: contact submit shows full execution sequence.
- Build: `npm run build` passes.
- Lint: `npm run lint` passes.

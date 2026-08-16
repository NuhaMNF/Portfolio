# Nuha Nizar — Portfolio Design

**Date:** 2026-08-16
**Status:** Approved (per user spec)
**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide, Recharts

## Concept

Portfolio masquerades as Nuha Nizar's personal Jupyter notebook. Every section = executed cell (`In [n]` → `Out [n]`). Visitor scrolls through a computational narrative: run hero → inspect identity → analyze skills → step through experience → explore projects → enter research lab → review activity → connect.

## Visual System

- **Typography:** Inter (display + body), JetBrains Mono (code)
- **Palette:** ink black `#0a0a0b`, paper `#f7f5ef`, accent `#10b981` (terminal green), warm sepia `#a16207`, muted grid `#27272a`
- **Texture:** subtle graph paper background, math glyphs, marginalia
- **Motion:** spring-based reveals, type-on code execution, scroll-triggered cell execution, parallax minimal
- **Cursor:** custom — `OPEN` on project cards, `EDIT` on code, `VIEW` on links

## Architecture

```
app/
  layout.tsx            // root, fonts, theme, cursor provider
  page.tsx              // notebook composer
  globals.css           // tailwind base + notebook overrides
components/
  notebook/
    NotebookShell.tsx
    NotebookCell.tsx    // In[n] + input + animated output
    CodeBlock.tsx       // syntax-highlighted Python
    ExecutionPrompt.tsx // In [n]: with running state
    OutputBlock.tsx     // Out[n]: with stagger reveal
    NotebookSidebar.tsx // fixed file-explorer nav
    CommandPalette.tsx  // Ctrl/Cmd+K
    BootTerminal.tsx    // loading screen
  sections/
    Hero.tsx
    About.tsx
    Skills.tsx
    Experience.tsx
    Projects.tsx
    FeaturedProject.tsx // training visualizer
    Research.tsx
    Activity.tsx        // GitHub stats
    Education.tsx
    Contact.tsx
    Footer.tsx
  ui/
    CustomCursor.tsx
    Typewriter.tsx
    BarMeter.tsx
    SectionHeader.tsx
  visualizations/
    SkillsRadar.tsx     // radar chart categories
    SkillsConstellation.tsx // network graph
    GithubActivity.tsx  // contribution grid + bars
    TrainingEpochs.tsx  // epoch progress
lib/
  data.ts               // all portfolio content (single source)
  hooks/
    useCellObserver.ts  // in-view trigger for cells
    useEasterEgg.ts     // key listener
    useCommandPalette.ts
```

## Cell Numbering

| # | Section |
|---|---|
| 1 | Hero |
| 2 | About |
| 3 | Skills |
| 4 | Experience |
| 5 | Projects (5.1…5.n) |
| 5.3 | Featured Project training |
| 6 | Research |
| 7 | Education |
| 8 | Activity |
| 9 | Contact |

## Interactions

- **Run button on hero:** animates `In [ ]` → `In [1]`, reveals output, triggers staggered children
- **Section in view:** cell executes (prompt lights up, code types, output fades in)
- **Skill hover:** highlight related tech + brief description
- **Project cards:** expand to detail with animated code execution
- **Ctrl/Cmd+K:** command palette with `> go projects`, `> contact nuha`, etc.
- **Type `sudo hire nuha`:** hidden reward

## Animations

- Framer Motion springs for cell entrances (stiffness 100, damping 20)
- Typewriter for code (configurable speed)
- StaggerChildren for outputs
- Subtle parallax on hero gradient
- Reduced-motion respected everywhere

## Responsive

- Desktop: sidebar visible, side-by-side About
- Tablet: sidebar collapses, single-column cells
- Mobile: drawer sidebar, full-width cards, code blocks scroll horizontally

## Accessibility

- `prefers-reduced-motion` disables non-essential animation
- Keyboard navigation across sidebar
- Focus rings on all interactive cells
- ARIA labels on command palette

## Performance

- Lazy-load heavy viz (Radar, Activity) below the fold
- `next/font` for self-hosted fonts
- tree-shake Lucide
- next/image for any raster
- Static generation of all content

## Data

All content lives in `lib/data.ts` — name, bio, skills dict, experience list, projects array, research, education, contact. Easy to swap.

## Out of Scope

- Real GitHub API (mocked, pluggable later)
- CMS
- Backend for contact form (UI + simulated success)
- Blog

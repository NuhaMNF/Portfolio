# Interactive 3D Box Field — Hero Background

Date: 2026-08-16
Status: Approved

## 1. Overview

Replace the hero's `StarfieldBackground` with a full-hero, pure-black interactive
3D scene: ~28 thin rectangular box frames floating in a diagonal perspective
platform. At rest the boxes are dark violet and nearly invisible; moving the
mouse across the structure reveals it — nearby boxes brighten to violet/pink,
rise slightly, and tilt toward the cursor with smooth radial falloff. A small
warm glowing point sits at the structure's center.

The canvas sits at `z-0` behind all hero content (left text column and right
code cell panel both remain). Background is `#000000`; purple comes only from
the 3D geometry.

## 2. Implementation Approach

- **React Three Fiber** (`@react-three/fiber` v9, React 19 compatible) +
  `three` + `@react-three/drei` + `@react-three/postprocessing` +
  `@types/three`. New dev dependencies: none; runtime deps installed via npm.
- Entire canvas lazy-loaded with `next/dynamic` + `{ ssr: false }` (per
  Next.js lazy-loading docs: `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`),
  so ~600KB of three.js never enters the initial bundle.
- All per-frame work mutates refs in `useFrame` — zero React re-renders on
  pointer move.
- Existing `useReducedMotion` hook (lib/hooks/useReducedMotion.ts) gates idle
  animation.

## 3. Files

- `components/ui/BoxField3D.tsx` — `"use client"` R3F scene.
  - Default export `BoxFieldCanvas`: `<Canvas>` + ambient/directional lights +
    `<BoxFieldScene>` + `<EffectComposer>` with restrained `<Bloom>`.
  - `BoxFieldScene`: structure `<group>` (rotation/position/animation), renders
    28 `<BoxModule>` instances, `<CenterGlow>`.
  - `BoxModule`: `<group>` containing interior `<mesh>` (dark violet
    `meshBasicMaterial`, transparent) + `<lineSegments>` from `EdgesGeometry`
    (`lineBasicMaterial`, transparent). Per-frame ref mutation.
- `CenterGlow`: warm sphere (r≈0.2, `#ffe9b3`) + additive radial sprite
  (canvas-generated texture) + low-intensity warm pointLight. Boxes in the
  central ring get a small static brightness boost (per spec §7).
  - Module-level mutable pointer store + window `pointermove` listener
    (canvas stays `pointer-events-none`; mirrors Starfield's window-listener
    pattern).
- `components/ui/BoxFieldBackground.tsx` — `next/dynamic(() => import("./BoxField3D"), { ssr: false, loading: () => null })`; exports `BoxFieldBackground`.
- `components/sections/Hero.tsx` — replace `<StarfieldBackground />` with
  `<BoxFieldBackground />` (same `absolute inset-0 z-0` full-hero, pointer-events-none container).

## 4. Geometry & Look

- Box module dims: `1.4 × 0.9 × 0.25` (width/height/depth), randomized ±8% per
  box. Sharp corners, thin glowing edges only (front edges, rear edges,
  connecting depth edges), subtle dark transparent interior surface.
- Per-box rest tilt ±2–4°; no two boxes identical.
- Rest edge color deep violet (`#3b2a6b`–`#5a3fa8` family); active lerps toward
  bright violet `#a855f7` → pink `#ec4899` with influence. Line width stays 1;
  bloom + opacity carry the glow.
- Interior: `meshBasicMaterial` dark violet (`#1a0f2e`), transparent, base
  opacity ~0.22, up to ~0.5 near cursor.
- Layout: procedural — 5–7 columns × 4–6 rows, only ~28 filled cells, gaps
  where cells are skipped, x/y jitter ±0.25, z stagger ±0.4, ~6 boxes pushed
  back on −z for a second depth layer. Structure silhouette: loose rectangular
  platform (see spec ASCII).
- Structure group rotation: x −20°, y ~27°, z −10° (within spec ranges
  −15…−25 / 20…35 / −5…−15), positioned slightly right of center.
- Camera: `fov 40`, `position (5, 4, 7)`, `lookAt (0, 0, 0)`. Fixed — cursor
  never controls the camera.
- Depth shading: per-box `depthFactor` from z position — back boxes dimmer,
  front boxes slightly more visible.
- Bloom: `intensity ≈0.5`, `luminanceThreshold ≈0.65`, `mipmapBlur` — sharp
  purple edges with a small soft violet halo; no huge neon bloom.
- Idle animation: structure group bob `y ±0.05` (~7s period) + tiny rotation
  wobble; per-box independent slow drift (±0.02 units, ±1°, 5–8s phases).
  Reduced motion → static single frame.

## 5. Cursor Interaction

- Window `pointermove` (mouse pointer type only) writes NDC to module store.
- `useFrame`: `raycaster.setFromCamera(ndc, camera)` → intersect structure base
  plane (`y = 0` in local space) → smooth cursor world point via
  `lerp(current, target, 1 − exp(−6·dt))`.
- Per-box: `dist = distance(box.xz, cursor.xz)`; three smoothstep radii —
  `0.6` (full), `1.4` (medium), `2.6` (weak) world units (tuned from spec's
  60/140/250px bands; tuned visually). `influence = smoothstep(radius, 0, dist)`.
- Response (all damped toward targets with `1 − exp(−8·dt)`):
  - edge color lerp rest→active (violet→pink), edge opacity
    `0.35 + 0.6·influence`, interior opacity `+ 0.3·influence`.
  - `y += 0.09·influence`; tilt ~2–4° toward cursor; `scale 1 + 0.03·influence`.
  - Smooth gradient across 3–6 boxes; brightest closest to cursor. Smooth
    return to dark rest when cursor leaves.
- Inactive state decays fully — structure nearly invisible when cursor is far
  away.
- Touch/coarse pointers: pointer interaction disabled; idle animation only.

## 6. Responsiveness & Performance

- Structure scale = `clamp(viewport.width / 14, 0.5, 1)` via `useThree`
  viewport (desktop/tablet); mobile `≈0.42`, pushed right/down so it never
  covers hero text. Box count stays 28 (shared geometries/materials are cheap).
- `dpr={[1, 1.75]}`, `gl={{ antialias: true, powerPreference: "high-performance" }}`.
- Pause rendering when hero off-screen (IntersectionObserver → `frameloop="demand"`
  + `invalidate()`) and on `visibilitychange` (mirrors Starfield pattern).
- Reduced motion: static frame, no idle animation.

## 7. Verification

- `npm run lint` and `npx tsc --noEmit`.
- `npm run build` — confirm dynamic import splits and SSR is clean.
- `npm run dev` manual pass: cursor reveal + gradient falloff, idle float,
  center glow, mobile scale + text readability, off-screen pause,
  reduced-motion static frame.
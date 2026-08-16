"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const STAR_COLORS = [
  "243, 247, 255", // white
  "165, 182, 255", // blue
  "201, 170, 255", // violet
  "150, 132, 218", // faint purple
] as const;

const COLOR_WEIGHTS = [0.42, 0.24, 0.2, 0.14];

const MAX_STARS = 170;
const MIN_STARS = 45;
const AREA_PER_STAR = 14000;

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  color: number;
  phase: number;
  twinkle: number;
  drift: boolean;
  dx: number;
  dy: number;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function pickColor() {
  const roll = Math.random();
  let acc = 0;
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    acc += COLOR_WEIGHTS[i];
    if (roll <= acc) return i;
  }
  return 0;
}

function makeGlowSprite(rgb: string, size = 64) {
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const g = sprite.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb}, 0.5)`);
  grad.addColorStop(0.3, `rgba(${rgb}, 0.12)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return sprite;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = false;
    let hovering = false;
    let visible = true;

    const rect = { left: 0, top: 0 };
    const target = { x: -1e4, y: -1e4 };
    const cursor = { x: -1e4, y: -1e4 };
    let interaction = 0;
    let glowAlpha = 0;

    const haloSprites = STAR_COLORS.map((c) => makeGlowSprite(c)).filter(Boolean) as HTMLCanvasElement[];
    const cursorGlow = makeGlowSprite("148, 158, 255", 512);

    const syncRect = () => {
      const r = canvas.getBoundingClientRect();
      rect.left = r.left;
      rect.top = r.top;
    };

    const initStars = () => {
      const count = Math.round(
        Math.min(MAX_STARS, Math.max(MIN_STARS, (width * height) / AREA_PER_STAR))
      );
      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < 0.07;
        return {
          x: Math.random(),
          y: Math.random(),
          r: bright ? 1.3 + Math.random() * 0.9 : 0.3 + Math.pow(Math.random(), 2.2) * 0.9,
          alpha: bright ? 0.28 + Math.random() * 0.2 : 0.04 + Math.pow(Math.random(), 2.6) * 0.22,
          color: pickColor(),
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.3 + Math.random() * 1.1,
          drift: Math.random() < 0.45,
          dx: (Math.random() - 0.5) * 0.022,
          dy: (Math.random() - 0.5) * 0.022,
        };
      });
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      syncRect();
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const px = t * 0.001;
      const radius = Math.min(300, Math.max(180, Math.min(width, height) * 0.32));
      const cursorInside =
        hovering &&
        cursor.x >= -20 &&
        cursor.x <= width + 20 &&
        cursor.y >= -20 &&
        cursor.y <= height + 20;

      if (glowAlpha > 0.002 && cursorGlow) {
        ctx.globalAlpha = glowAlpha;
        ctx.globalCompositeOperation = "lighter";
        const size = radius * 2.4;
        ctx.drawImage(cursorGlow, cursor.x - size / 2, cursor.y - size / 2, size, size);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }

      for (const s of stars) {
        if (s.drift && !reduced) {
          s.x += s.dx / width;
          s.y += s.dy / height;
          if (s.x < 0) s.x += 1;
          else if (s.x > 1) s.x -= 1;
          if (s.y < 0) s.y += 1;
          else if (s.y > 1) s.y -= 1;
        }

        const sx = s.x * width;
        const sy = s.y * height;
        let influence = 0;
        let ox = sx;
        let oy = sy;

        if (cursorInside) {
          const dx = sx - cursor.x;
          const dy = sy - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            influence = 1 - smoothstep(0, radius, dist);
            const repel = influence * influence * 2.4;
            if (dist > 0.0001) {
              ox = sx + (dx / dist) * repel;
              oy = sy + (dy / dist) * repel;
            }
          }
        }

        const twinkle = reduced ? 1 : 0.78 + 0.22 * Math.sin(px * s.twinkle * 2.1 + s.phase);
        const alpha = Math.min(0.68, s.alpha + 0.38 * influence * interaction) * twinkle;
        if (alpha <= 0.012) continue;

        const size = s.r * (1 + 0.7 * influence * interaction);

        const haloStrength = 0.2 * influence * interaction + (s.r > 1.5 ? 0.06 : 0);
        if (haloStrength > 0.05) {
          const sprite = haloSprites[s.color];
          if (sprite) {
            const hSize = size * 7;
            ctx.globalAlpha = Math.min(0.3, haloStrength);
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(sprite, ox - hSize / 2, oy - hSize / 2, hSize, hSize);
            ctx.globalCompositeOperation = "source-over";
          }
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${STAR_COLORS[s.color]})`;
        ctx.beginPath();
        ctx.arc(ox, oy, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const frame = (t: number) => {
      if (!running) return;
      cursor.x += (target.x - cursor.x) * 0.085;
      cursor.y += (target.y - cursor.y) * 0.085;
      interaction += ((hovering ? 1 : 0) - interaction) * 0.055;
      glowAlpha += ((hovering ? 0.12 : 0) - glowAlpha) * 0.05;
      draw(t);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || document.hidden || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      hovering = true;
    };

    const onPointerLeave = () => {
      hovering = false;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onScroll = () => {
      syncRect();
    };

    const onBlur = () => {
      hovering = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      const nowVisible = entry.isIntersecting;
      if (nowVisible === visible) return;
      visible = nowVisible;
      if (nowVisible) start();
      else stop();
    });
    io.observe(canvas);

    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
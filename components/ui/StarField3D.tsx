"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useTheme } from "@/lib/hooks/useTheme";

const DARK_CLEAR = "#000000";
const LIGHT_CLEAR = "#e6e1d6";
const AREA_PER_STAR = 11000;
const MIN_STARS = 90;
const MAX_STARS = 220;
const RADIUS = 110;
const PULL = 10;

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
};

export function StarFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const light = theme === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let running = false;
    let hovering = false;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const init = () => {
      const count = Math.round(
        Math.min(MAX_STARS, Math.max(MIN_STARS, (width * height) / AREA_PER_STAR))
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() < 0.18 ? 1.25 : 1,
        a: 0.22 + Math.random() * 0.55,
      }));
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
      init();
    };

    const draw = () => {
      ctx.fillStyle = light ? LIGHT_CLEAR : DARK_CLEAR;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = light ? "#2a2722" : "#ffffff";

      const cx = mouse.x;
      const cy = mouse.y;

      for (const s of stars) {
        let x = s.x * width;
        let y = s.y * height;

        if (!reduced && hovering) {
          const dx = cx - x;
          const dy = cy - y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const t = 1 - dist / RADIUS;
            const falloff = t * t;
            x += (dx / dist) * PULL * falloff;
            y += (dy / dist) * PULL * falloff;
          }
        }

        ctx.globalAlpha = light ? 0.35 + s.a * 0.5 : s.a;
        ctx.fillRect(x, y, s.r, s.r);
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      if (!running) return;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      hovering = true;
    };

    const onLeave = () => {
      hovering = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduced) {
      draw();
    } else {
      running = true;
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      ro.disconnect();
    };
  }, [reduced, light]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

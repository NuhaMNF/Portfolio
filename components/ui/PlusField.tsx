'use client';

import { useEffect, useRef } from 'react';

type Plus = {
  x: number;
  y: number;
  s: number;
  a: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
};

/** Y-Vision-style faint plus signs that drift and part around the cursor. */
export function PlusField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const pluses: Plus[] = [];
    const mouse = { x: 0, y: 0, active: 0 };
    const mouseTarget = { x: 0, y: 0, active: 0 };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      pluses.length = 0;
      const n = Math.round((w * h) / 14000);
      for (let i = 0; i < n; i++) {
        pluses.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: 3 + Math.random() * 5,
          a: 0.12 + Math.random() * 0.22,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.06,
          ox: 0,
          oy: 0,
        });
      }
    };

    const radius = 140;
    const radiusSq = radius * radius;

    const draw = () => {
      mouse.x += (mouseTarget.x - mouse.x) * 0.16;
      mouse.y += (mouseTarget.y - mouse.y) * 0.16;
      mouse.active += (mouseTarget.active - mouse.active) * 0.12;

      ctx.clearRect(0, 0, w, h);
        const stroke =
          getComputedStyle(canvas).getPropertyValue("--fg-faint").trim() || "#8a857a";
        ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      for (const p of pluses) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;

        p.ox *= 0.88;
        p.oy *= 0.88;

        let prox = 0;
        if (mouse.active > 0.02) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radiusSq) {
            const dist = Math.sqrt(d2) + 0.0001;
            prox = (1 - dist / radius) * mouse.active;
            const push = prox * prox * 22;
            p.ox += (dx / dist) * push;
            p.oy += (dy / dist) * push;
          }
        }

        const px = p.x + p.ox;
        const py = p.y + p.oy;
        const size = p.s * (1 + prox * 0.55);
        ctx.globalAlpha = Math.min(0.55, p.a * (1 + prox * 1.4));
        ctx.beginPath();
        ctx.moveTo(px - size, py);
        ctx.lineTo(px + size, py);
        ctx.moveTo(px, py - size);
        ctx.lineTo(px, py + size);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (reduce || !fine) return;
      const r = canvas.getBoundingClientRect();
      mouseTarget.x = e.clientX - r.left;
      mouseTarget.y = e.clientY - r.top;
      mouseTarget.active = 1;
    };
    const onLeave = () => {
      mouseTarget.active = 0;
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full bg-transparent"
    />
  );
}

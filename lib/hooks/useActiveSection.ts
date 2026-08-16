"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { resolveActiveIndex } from "@/lib/active-section";

const SPY_RATIO = 0.28;
const BOTTOM_SLACK = 24;

export function useActiveSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const spyY = window.innerHeight * SPY_RATIO;
      const tops = navItems.map((item) => {
        const el = document.getElementById(item.id);
        return el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      });
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - BOTTOM_SLACK;
      const next = resolveActiveIndex(tops, spyY, atBottom);
      setIndex((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const item = navItems[index] ?? navItems[0];
  return { index, id: item.id, item };
}

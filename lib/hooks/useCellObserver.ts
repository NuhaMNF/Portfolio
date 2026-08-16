"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Triggers once when an element enters the viewport.
 * Used to "execute" notebook cells as they scroll into view.
 */
export function useCellObserver<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.18
) {
  const ref = useRef<T | null>(null);
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setExecuted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, executed };
}

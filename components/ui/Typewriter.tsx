"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

export function Typewriter({ text, delay = 0, speed = 28, className, onDone }: TypewriterProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            onDone?.();
            return c;
          }
          return c + 1;
        });
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay, speed, onDone]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        className="ml-0.5 inline-block h-[1em] w-[0.5ch] -translate-y-[2px] bg-current align-middle"
      />
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { highlightPython } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  variant?: "default" | "minimal";
  language?: "python" | "text";
}

export function CodeBlock({ code, className, variant = "default", language = "python" }: CodeBlockProps) {
  const tokens = language === "python" ? highlightPython(code) : [{ text: code, cls: "text-zinc-200" }];
  return (
    <div
      className={cn(
        "code-scroll relative overflow-x-auto rounded-md border border-zinc-800/80 bg-[#0e0e10]/95",
        "font-mono text-[13px] leading-[1.65]",
        variant === "default" ? "p-4 md:p-5" : "p-3",
        className
      )}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400/40 via-emerald-400/10 to-transparent" />
      <pre className="whitespace-pre">
        {tokens.map((t, i) => (
          <span key={i} className={t.cls}>
            {t.text}
          </span>
        ))}
      </pre>
    </div>
  );
}

/**
 * Typewriter — animates code as if being typed.
 * Reveals one character at a time, tokens colored as they appear.
 */
export function TypedCode({
  code,
  speed = 14,
  startDelay = 0,
  onDone,
  className,
  start = true,
}: {
  code: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
  start?: boolean;
}) {
  const tokens = highlightPython(code);
  const chars = tokens.map((t) => Array.from(t.text)).flat();

  return (
    <motion.div
      className={cn(
        "relative overflow-x-auto rounded-md border border-zinc-800/80 bg-[#0e0e10]/95",
        "font-mono text-[13px] leading-[1.65] p-4 md:p-5",
        className
      )}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400/50 via-emerald-400/10 to-transparent" />
      <pre className="whitespace-pre">
        {start &&
          chars.map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: startDelay + i * (speed / 1000),
                duration: 0.001,
              }}
              onAnimationComplete={() => {
                if (i === chars.length - 1) onDone?.();
              }}
              className={tokens[tokenIndexForChar[i]].cls}
            >
              {chars[i]}
            </motion.span>
          ))}
        {!start && (
          <span className="text-zinc-500">// waiting to run…</span>
        )}
      </pre>
    </motion.div>
  );
}

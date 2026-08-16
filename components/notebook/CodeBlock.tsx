"use client";

import { motion } from "framer-motion";
import { highlightPython } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  variant?: "default" | "minimal" | "wide";
  language?: "python" | "text";
  showLineNumbers?: boolean;
  showCursor?: boolean;
}

/**
 * CodeBlock — authentic computational cell feel.
 * Subtle line numbers in gutter, optional cursor, syntax highlight.
 */
export function CodeBlock({
  code,
  className,
  variant = "default",
  language = "python",
  showLineNumbers = true,
  showCursor = false,
}: CodeBlockProps) {
  const tokens =
    language === "python" ? highlightPython(code) : [{ text: code, cls: "text-zinc-200" }];
  const lines = code.split("\n");
  const tokenLines: Array<Array<{ text: string; cls: string }>> = [];
  let cursor = 0;
  for (const line of lines) {
    const lineTokens: Array<{ text: string; cls: string }> = [];
    let remaining = line.length;
    while (remaining > 0 && cursor < tokens.length) {
      const t = tokens[cursor];
      if (t.text.length <= remaining) {
        lineTokens.push(t);
        remaining -= t.text.length;
        cursor++;
      } else {
        lineTokens.push({ text: t.text.slice(0, remaining), cls: t.cls });
        tokens[cursor] = { text: t.text.slice(remaining), cls: t.cls };
        remaining = 0;
      }
    }
    tokenLines.push(lineTokens);
  }

  return (
    <div
      className={cn(
        "code-frame code-scroll relative overflow-x-auto",
        variant === "wide" && "px-6 py-5",
        variant === "default" && "px-5 py-4",
        variant === "minimal" && "px-3 py-2",
        className
      )}
    >
      <pre className="whitespace-pre">
        {tokenLines.map((line, i) => (
          <div key={i} className="flex">
            {showLineNumbers && (
              <span className="line-gutter metric">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <span className="flex-1">
              {line.length === 0 ? (
                <span>{" "}</span>
              ) : (
                line.map((t, j) => (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ))
              )}
              {showCursor && i === tokenLines.length - 1 && (
                <span className="line-cursor" />
              )}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/**
 * TypedCode — animates code as if being typed.
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
  const chars = tokens.flatMap((t) => Array.from(t.text));
  const tokenIndexForChar = tokens.flatMap((t, _i) => Array.from(t.text).map(() => _i));

  const lines = code.split("\n");
  const charPerLine: number[] = [];
  let counted = 0;
  for (const l of lines) {
    charPerLine.push(counted);
    counted += l.length + 1;
  }

  return (
    <motion.div
      className={cn(
        "code-frame code-scroll relative overflow-x-auto px-5 py-4",
        className
      )}
    >
      <pre className="whitespace-pre">
        {start &&
          chars.map((_, i) => {
            const lineIdx = charPerLine.findIndex(
              (start, idx) =>
                i >= start &&
                (idx === charPerLine.length - 1 || i < charPerLine[idx + 1])
            );
            const isLastChar =
              i === chars.length - 1 ||
              (i < chars.length - 1 &&
                charPerLine[lineIdx + 1] === i + 1);
            return (
              <span
                key={i}
                className="inline"
                style={{
                  display: "inline",
                }}
              >
                <motion.span
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
                {isLastChar && <br />}
              </span>
            );
          })}
        {!start && (
          <span className="text-[var(--fg-faint)]">// waiting to run…</span>
        )}
      </pre>
    </motion.div>
  );
}
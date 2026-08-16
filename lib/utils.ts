import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Tiny Python syntax highlighter.
 * Not a full parser — just enough to make the code blocks feel real.
 */
export function highlightPython(code: string): Array<{ text: string; cls: string }> {
  const KEYWORDS = new Set([
    "class", "def", "return", "if", "elif", "else", "for", "while", "in", "not",
    "and", "or", "import", "from", "as", "with", "try", "except", "finally",
    "lambda", "yield", "True", "False", "None", "self", "pass", "break", "continue",
  ]);
  const tokens: Array<{ text: string; cls: string }> = [];
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    // comment
    if (ch === "#") {
      const end = code.indexOf("\n", i);
      const slice = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ text: slice, cls: "text-zinc-500 italic" });
      i += slice.length;
      continue;
    }
    // string
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === "\\") j++;
        j++;
      }
      const slice = code.slice(i, j + 1);
      tokens.push({ text: slice, cls: "text-emerald-400" });
      i = j + 1;
      continue;
    }
    // number
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < code.length && /[0-9.]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), cls: "text-amber-300" });
      i = j;
      continue;
    }
    // identifier / keyword
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, cls: "text-violet-300" });
      } else if (code[j] === "(") {
        tokens.push({ text: word, cls: "text-sky-300" });
      } else {
        tokens.push({ text: word, cls: "text-zinc-100" });
      }
      i = j;
      continue;
    }
    // default
    tokens.push({ text: ch, cls: "text-zinc-300" });
    i++;
  }
  return tokens;
}

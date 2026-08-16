"use client";

import { useEffect, useState } from "react";

export const GREETINGS = [
  "வணக்கம்",      // Tamil
  "ආයුබෝවන්",    // Sinhala
  "مرحباً",       // Arabic
  "Guten Tag",    // German
  "Bonjour",      // French
  "こんにちは",     // Japanese
  "Hola",         // Spanish
  "Ciao",         // Italian
  "안녕하세요",     // Korean
  "Hello",        // English
];

export function MultilingualGreeting() {
  const [langIndex, setLangIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = GREETINGS[langIndex];
    // Split using Intl.Segmenter or Array.from for multi-byte Unicode/Indic/Arabic graphemes
    const characters = Array.from(fullWord);
    const currentLength = Array.from(displayText).length;

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // TYPING FORWARD
      if (currentLength < characters.length) {
        timer = setTimeout(() => {
          setDisplayText(characters.slice(0, currentLength + 1).join(""));
        }, 90);
      } else {
        // Full word typed -> Pause before backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      // BACKSPACING / DELETING
      if (currentLength > 0) {
        timer = setTimeout(() => {
          setDisplayText(characters.slice(0, currentLength - 1).join(""));
        }, 45);
      } else {
        // Word cleared -> Switch to next language and type forward
        setIsDeleting(false);
        setLangIndex((prev) => (prev + 1) % GREETINGS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, langIndex]);

  return (
    <div className="mb-2 flex items-center gap-2 text-[clamp(22px,3.2vw,36px)] font-serif font-normal tracking-tight select-none">
      {/* Typewriter Text Container */}
      <div className="inline-flex items-center min-h-[38px] sm:min-h-[46px]">
        <span className="text-[var(--accent)] font-semibold min-w-[2px]">
          {displayText}
        </span>
        {/* Blinking Caret */}
        <span className="ml-1 inline-block h-6 sm:h-8 w-[2px] bg-[var(--accent)] animate-pulse" />
      </div>

      {/* Static Suffix */}
      <span className="text-[var(--fg-soft)] font-light">, I am</span>
    </div>
  );
}

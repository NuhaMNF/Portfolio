"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, Sparkles, X } from "lucide-react";
import { playSelect } from "@/lib/sound";
import { profile } from "@/lib/data";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  icon?: "check" | "copy" | "sparkle";
}

export function showToast(title: string, description?: string, icon: "check" | "copy" | "sparkle" = "check") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nuha:toast", {
      detail: { id: Math.random().toString(36), title, description, icon },
    })
  );
}

export async function copyEmailToClipboard(email = profile.email) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(email);
    } else {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    playSelect(2);
    showToast("Copied to Clipboard!", email, "copy");
  } catch {
    showToast("Email address", email, "check");
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const toast = customEvent.detail;
      setToasts((prev) => [...prev.slice(-2), toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2800);
    };

    window.addEventListener("nuha:toast", onToast);
    return () => window.removeEventListener("nuha:toast", onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col gap-2 select-none"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/95 px-4 py-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/15 dark:ring-white/10"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
              {t.icon === "copy" ? (
                <Copy className="h-4 w-4" />
              ) : t.icon === "sparkle" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 pr-2">
              <div className="font-serif text-[13.5px] font-medium text-[var(--fg)]">
                {t.title}
              </div>
              {t.description && (
                <div className="font-mono text-[11px] text-[var(--accent)] font-medium truncate">
                  {t.description}
                </div>
              )}
            </div>

            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="btn-glass ml-2 flex h-5 w-5 items-center justify-center rounded-full text-[var(--fg-mute)] hover:text-[var(--fg)]"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

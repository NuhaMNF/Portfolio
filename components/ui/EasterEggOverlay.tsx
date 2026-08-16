"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEasterEgg } from "@/lib/hooks/useEasterEgg";

export function EasterEggOverlay() {
  const [open, setOpen] = useState(false);
  useEasterEgg("sudo hire nuha", () => setOpen(true));
  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("nuha:hire", on);
    return () => window.removeEventListener("nuha:hire", on);
  }, []);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[min(540px,92vw)] rounded-md border border-emerald-500/30 bg-[#0c0c0e] p-6 font-mono text-[13px] shadow-2xl"
          >
            <div className="text-zinc-500">$ sudo hire nuha</div>
            <div className="mt-2 text-zinc-400">[sudo] password for you: ********</div>
            <div className="mt-3 text-emerald-300">Permission granted.</div>
            <div className="text-amber-300">Good decision.</div>
            <div className="mt-3 text-zinc-500">
              // routing handshake to nuha@nizar.dev
            </div>
            <button
              onClick={() => setOpen(false)}
              data-cursor="view"
              className="btn-glass mt-5 px-3 py-1.5 font-mono text-[12px] text-[var(--fg)]"
            >
              close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

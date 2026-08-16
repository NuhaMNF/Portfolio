"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-[#0a0a0b] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="font-mono text-[11px] text-zinc-500">
          <span className="text-emerald-300">{`>`}</span> end of notebook · saved
          <span className="ml-2 text-zinc-600">
            {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-500">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="text-zinc-700">·</span>
          <span>built with next.js + framer-motion</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { ArrowRight, GraduationCap, Award, Code2 } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

const notes = [
  {
    icon: GraduationCap,
    title: "BSc (Hons) MIT",
    detail: "University of Kelaniya · 2025–2028",
  },
  {
    icon: Award,
    title: "Top 10 finalist",
    detail: "Trinova · IdeaSprint",
  },
  {
    icon: Code2,
    title: "Building with",
    detail: "React · Node.js · PostgreSQL",
  },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-20 md:pt-24 md:pb-24"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,380px)]">
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>01 / Introduce</span>
            </motion.div>

            <h1 className="hero-display text-[var(--fg)]">
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
                  className="block text-[clamp(56px,8.5vw,128px)]"
                >
                  Nuha
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.18 }}
                  className="display-italic block text-[clamp(56px,8.5vw,128px)] text-[var(--fg-soft)]"
                >
                  Nizar
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={reduced ? false : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
              className="mt-6 h-px w-20 origin-left bg-[var(--accent)]"
            />

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-mute)]"
            >
              Management & IT · University of Kelaniya
            </motion.p>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              className="mt-5 max-w-md text-[17px] leading-[1.7] text-[var(--fg-soft)]"
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projects"
                data-cursor="view"
                className="btn-glass btn-glass--accent group inline-flex min-h-11 items-center gap-2.5 rounded-xl px-6 font-mono text-[12.5px] shadow-sm"
              >
                <span>View work</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                data-cursor="view"
                className="btn-glass inline-flex min-h-11 items-center px-5 font-mono text-[12.5px] text-[var(--fg-soft)]"
              >
                Get in touch
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
            className="flex w-full flex-col gap-5"
          >
            <div className="flex items-end gap-4">
              <div className="relative h-[248px] w-[198px] shrink-0 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)] shadow-[0_18px_48px_-28px_rgba(0,0,0,0.65)]">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="198px"
                />
              </div>
              <div className="min-w-0 pb-1">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--state-done)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--state-done)]" />
                  Available
                </div>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-[var(--fg-soft)]">
                  Open to internships in data analysis and software.
                </p>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-faint)]">
                  Kelaniya, LK
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-4 backdrop-blur-md">
              <div className="space-y-3.5">
                {notes.map((note) => {
                  const Icon = note.icon;
                  return (
                    <div key={note.title} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="text-[13.5px] font-medium text-[var(--fg)]">{note.title}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-[var(--fg-mute)]">{note.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

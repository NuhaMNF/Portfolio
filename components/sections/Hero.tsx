"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import {
  ArrowRight,
  GraduationCap,
  Award,
  Code2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CopyEmailButton, MeetingLinkButton } from "@/components/ui/QuickContactActions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MultilingualGreeting } from "@/components/ui/MultilingualGreeting";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-20 md:pt-24 md:pb-24"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-12 lg:grid-cols-[1.15fr_1fr]">
          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO HEADLINE & INTRODUCING NUHA NIZAR       */}
          {/* ========================================================= */}
          <div>
            {/* Section Tag */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                <span>01 / Introduce</span>
              </motion.div>
            </div>

            {/* Multilingual Dynamic Greeting */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            >
              <MultilingualGreeting />
            </motion.div>

            {/* Large Editorial Headline */}
            <h1 className="hero-display text-[var(--fg)]">
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
                  className="block text-[clamp(52px,7.5vw,112px)] font-normal tracking-[-0.03em] leading-[0.95]"
                >
                  Nuha
                </motion.span>
              </span>
              <span className="block overflow-hidden mt-1">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.18 }}
                  className="display-italic block text-[clamp(52px,7.5vw,112px)] text-[var(--fg-soft)] leading-[0.95]"
                >
                  Nizar
                </motion.span>
              </span>
            </h1>

            {/* Glowing Rule Divider */}
            <motion.div
              initial={reduced ? false : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="mt-6 h-[1.5px] w-24 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent"
            />

            {/* Degree & University Tag */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="mt-6 font-mono text-[11.5px] uppercase tracking-[0.22em] text-[var(--accent)] font-medium"
            >
              Management & IT · University of Kelaniya
            </motion.p>

            {/* Tagline Statement */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              className="mt-4 max-w-lg text-[17px] leading-[1.75] text-[var(--fg-soft)]"
            >
              Bridging organizational management insight with data-driven decision making, full-stack software development, and PostgreSQL persistence.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#projects"
                data-cursor="view"
                className="btn-glass btn-glass--accent group inline-flex min-h-11 items-center gap-2.5 rounded-xl px-6 font-mono text-[12.5px] shadow-sm"
              >
                <span>View Projects</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>

              <MeetingLinkButton />
            </motion.div>

            {/* Quick Contact & Social Channels */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <CopyEmailButton variant="pill" />

              <div className="flex items-center gap-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                  title="GitHub Profile"
                  className="btn-glass flex h-9 w-9 items-center justify-center rounded-xl text-[var(--fg-mute)] hover:text-[var(--fg)] shadow-xs transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="view"
                  title="LinkedIn Profile"
                  className="btn-glass flex h-9 w-9 items-center justify-center rounded-xl text-[var(--fg-mute)] hover:text-[var(--fg)] shadow-xs transition-colors"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: UNIFIED EXECUTIVE PROFILE CHASSIS           */}
          {/* ========================================================= */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
            className="w-full"
          >
            <SpotlightCard className="overflow-hidden p-6 md:p-8 shadow-2xl">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-4 font-mono text-[10.5px]">
                <div className="flex items-center gap-2 uppercase tracking-[0.2em] text-[var(--fg-mute)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Academic & Technical Profile</span>
                </div>
                <span className="rounded-md border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 uppercase tracking-wider text-[var(--state-done)] font-medium">
                  2025 — 2028
                </span>
              </div>

              {/* Executive Portrait & Identity Section */}
              <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Framed Portrait Box */}
                <div className="relative h-28 w-24 sm:h-32 sm:w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--rule)] bg-zinc-900 shadow-xl ring-2 ring-[var(--accent)]/30">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Identity & Status Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-serif text-[22px] font-medium text-[var(--fg)]">
                      {profile.name}
                    </h3>
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--state-done)]/10 border border-[var(--state-done)]/20 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--state-done)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--state-done)] animate-pulse" />
                      Available for Roles
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[12px] font-semibold text-[var(--accent)]">
                    {profile.role}
                  </div>

                  <div className="mt-1 text-[13.5px] text-[var(--fg-soft)]">
                    Department of Industrial Management
                  </div>

                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 font-mono text-[11px] text-[var(--fg-mute)]">
                    <MapPin className="h-3 w-3 text-[var(--accent)]" />
                    <span>University of Kelaniya, Sri Lanka</span>
                  </div>
                </div>
              </div>

              {/* Key Credentials Breakdown */}
              <div className="mt-6 space-y-3 border-t border-[var(--rule-soft)] pt-5">
                <div className="flex items-start gap-3.5 rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3.5 transition-colors hover:border-[var(--accent)]/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-[var(--fg)]">
                      BSc (Hons) in Management & IT
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)] mt-0.5">
                      University of Kelaniya · Expected 2028
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3.5 transition-colors hover:border-[var(--accent)]/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-[var(--fg)]">
                      2× Innovation Competition Finalist
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)] mt-0.5">
                      Top 10 at IdeaSprint & Trinova Youth Innovation
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3.5 transition-colors hover:border-[var(--accent)]/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                    <Code2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-[var(--fg)]">
                      Full-Stack & Database Engineering
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)] mt-0.5">
                      React.js · Node.js · PostgreSQL · MySQL · Java · C++
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Stats */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-[var(--rule-soft)] pt-4">
                <div className="rounded-lg bg-[var(--surface-2)]/70 p-2.5 text-center">
                  <div className="font-mono text-[18px] font-bold text-[var(--fg)]">1</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Flagship App
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--surface-2)]/70 p-2.5 text-center">
                  <div className="font-mono text-[18px] font-bold text-[var(--accent)]">2×</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Finalist
                  </div>
                </div>
                <div className="rounded-lg bg-[var(--surface-2)]/70 p-2.5 text-center">
                  <div className="font-mono text-[18px] font-bold text-[var(--fg)]">5</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Focus Areas
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { profile, stats } from "@/lib/data";
import { ArrowRight, Sparkles, GraduationCap, Award, FolderGit2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { CopyEmailButton, MeetingLinkButton } from "@/components/ui/QuickContactActions";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-24 md:pt-24 md:pb-28"
    >
      <div className="relative z-[1] mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Identity & Bio */}
          <div className="relative">
            {/* Section Index Marker */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>01 / Introduce</span>
            </motion.div>

            {/* Name Heading */}
            <h1 className="hero-display text-[var(--fg)]">
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
                  className="block text-[clamp(60px,9.5vw,144px)]"
                >
                  Nuha
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? false : { y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.18 }}
                  className="display-italic block text-[clamp(60px,9.5vw,144px)] text-[var(--fg-soft)]"
                >
                  Nizar
                </motion.span>
              </span>
            </h1>

            {/* Accent Rule */}
            <motion.div
              initial={reduced ? false : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
              className="mt-5 h-px w-24 origin-left bg-[var(--accent)]"
            />

            {/* Role / Subtitle */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-mute)]"
            >
              <span>Management & IT</span>
              <span className="text-[var(--fg-ghost)]">·</span>
              <span>University of Kelaniya</span>
            </motion.div>

            {/* Main Tagline */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              className="mt-6 max-w-xl text-[16px] md:text-[17px] leading-[1.7] text-[var(--fg-soft)]"
            >
              {profile.tagline}
            </motion.p>

            {/* Location & Status Badge */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]"
            >
              <span className="inline-flex items-center gap-2">
                <span className="state-dot state-dot--done" />
                {profile.location}
              </span>
              <span className="text-[var(--fg-ghost)]">·</span>
              <span className="text-[var(--fg-mute)]">Open for Data & Software Roles</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#projects"
                data-cursor="view"
                className="btn-glass btn-glass--accent group inline-flex min-h-11 items-center gap-2.5 px-6 font-mono text-[12.5px] rounded-xl shadow-sm"
              >
                <span>View Projects</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <MeetingLinkButton />
            </motion.div>

            {/* Quick Email Copy & Social Links */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <CopyEmailButton variant="pill" />

              <div className="flex items-center gap-2">
                <SocialLink href={profile.github} label="GitHub">
                  <GithubIcon className="h-4 w-4" />
                </SocialLink>
                <SocialLink href={profile.linkedin} label="LinkedIn">
                  <LinkedinIcon className="h-4 w-4" />
                </SocialLink>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Executive Overview & Highlights Card */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/75 p-7 md:p-8 backdrop-blur-xl shadow-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-4">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-mute)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Academic & Technical Profile</span>
                </div>
                <span className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--state-done)]">
                  2025 — 2028
                </span>
              </div>

              {/* Institution Highlights */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="font-medium text-[15px] text-[var(--fg)]">
                      BSc (Hons) in Management & Information Technology
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)]">
                      University of Kelaniya · Dept. of Industrial Management
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="font-medium text-[15px] text-[var(--fg)]">
                      Innovation Competition Finalist
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)]">
                      Top 10 at IdeaSprint & Trinova Youth Innovation
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                    <FolderGit2 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="font-medium text-[15px] text-[var(--fg)]">
                      Software & Database Systems
                    </div>
                    <div className="font-mono text-[11px] text-[var(--fg-mute)]">
                      Java, C++, React.js, Node.js, PostgreSQL, MySQL
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro Stats Grid */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--rule-soft)] pt-6">
                <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3 text-center">
                  <div className="font-mono text-[22px] font-semibold text-[var(--fg)]">1</div>
                  <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Flagship
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3 text-center">
                  <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">2×</div>
                  <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Finalist
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 p-3 text-center">
                  <div className="font-mono text-[22px] font-semibold text-[var(--fg)]">5</div>
                  <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                    Focus Areas
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-cursor="view"
      aria-label={label}
      className="btn-glass inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--fg-mute)] hover:text-[var(--fg)] transition-colors shadow-xs"
    >
      {children}
    </a>
  );
}

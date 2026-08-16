"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { achievements } from "@/lib/data";
import {
  Trophy,
  Award,
  Maximize2,
  Sparkles,
  Building2,
  X,
  Target,
  Users,
  Presentation,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playModalOpen, playModalClose, playSelect } from "@/lib/sound";

const TRINOVA_HIGHLIGHTS = [
  "3D Foot-Scanning & Mobile App Workflow",
  "Custom 3D-Printed Insole Engineering",
  "Industry Collaboration with FRYM Intimates",
  "On-Stage Live Prototype & Venture Pitch",
];

const IDEASPRINT_HIGHLIGHTS = [
  "Creative Problem Identification & Solution Design",
  "Rapid Software Prototype & Architecture",
  "Business Model & Unit Economics Validation",
  "Department of Industrial Management Representation",
];

export function Achievements() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  useEffect(() => {
    if (!lightboxImg) return;
    playModalOpen();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playModalClose();
        setLightboxImg(null);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxImg]);

  const handleCloseLightbox = () => {
    playModalClose();
    setLightboxImg(null);
  };

  const trinova = achievements[0];
  const ideasprint = achievements[1];
  const trinovaPhotos = trinova?.images ?? [];

  return (
    <section id="achievements" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header Tag */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <span>06 / Achievements</span>
        </div>

        {/* Section Headline */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[1.04] tracking-[-0.03em] text-[var(--fg)]">
              Innovation honors & <span className="display-italic text-[var(--fg-soft)]">competitions</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Demonstrated creative problem-solving, rapid technical prototyping, and venture pitch validation across university and national innovation stages.
            </p>
          </div>
        </div>

        {/* Balanced Two-Column Master Honors Showcase */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch">
          {/* ========================================================= */}
          {/* PLAQUE 1: TRINOVA YOUTH INNOVATION COMPETITION (CINEC)    */}
          {/* ========================================================= */}
          <SpotlightCard className="flex flex-col justify-between p-7 md:p-9 shadow-2xl border-[var(--rule)]">
            <div>
              {/* Plaque Header */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-md ring-2 ring-[var(--accent)]/20">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/15 via-[var(--surface-2)] to-transparent px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] font-bold shadow-xs">
                        <Sparkles className="h-3 w-3" />
                        Finalist Plaque
                      </span>
                      <span className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--state-done)] font-bold">
                        Top 10 Finalist
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--fg-mute)]">
                      CINEC Campus × FRYM Intimates
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[12px] font-medium text-[var(--accent)]">
                  01 / 02
                </span>
              </div>

              {/* Event Title & Summary */}
              <div className="mt-6">
                <h3 className="font-serif text-[24px] md:text-[28px] font-normal leading-[1.2] text-[var(--fg)]">
                  {trinova.event}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--fg-soft)]">
                  {trinova.description}
                </p>
              </div>

              {/* Highlight Badges */}
              <div className="mt-5 space-y-2 border-t border-[var(--rule-soft)] pt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                  // Key Deliverables & Validation:
                </div>
                {TRINOVA_HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-[var(--fg-soft)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Photo Stage Preview */}
            <div className="mt-7 border-t border-[var(--rule-soft)] pt-5">
              {/* Photo Selector Tabs */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {trinovaPhotos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        playSelect(idx + 1);
                        setActivePhotoIdx(idx);
                      }}
                      data-cursor="view"
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
                        activePhotoIdx === idx
                          ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--fg)] font-semibold"
                          : "border-transparent text-[var(--fg-mute)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {idx === 0 ? <Presentation className="h-3 w-3 text-[var(--accent)]" /> : <Users className="h-3 w-3 text-[var(--accent)]" />}
                      <span>{photo.title}</span>
                    </button>
                  ))}
                </div>

                <span className="hidden sm:flex items-center gap-1 font-mono text-[10.5px] text-[var(--fg-faint)]">
                  <Maximize2 className="h-3 w-3" />
                  <span>Click to zoom</span>
                </span>
              </div>

              {/* Photo Frame */}
              {trinovaPhotos[activePhotoIdx] && (
                <div
                  className="group relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--rule)] bg-black/80 shadow-md"
                  onClick={() => setLightboxImg(trinovaPhotos[activePhotoIdx].src)}
                >
                  <Image
                    src={trinovaPhotos[activePhotoIdx].src}
                    alt={trinovaPhotos[activePhotoIdx].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-center justify-between">
                    <span className="font-mono text-[11.5px] text-white/90">
                      {trinovaPhotos[activePhotoIdx].description}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-xs">
                      <Maximize2 className="h-3 w-3" />
                      <span>Full View</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>

          {/* ========================================================= */}
          {/* PLAQUE 2: IDEASPRINT INNOVATION COMPETITION (KELANIYA)   */}
          {/* ========================================================= */}
          <SpotlightCard className="flex flex-col justify-between p-7 md:p-9 shadow-2xl border-[var(--rule)]">
            <div>
              {/* Plaque Header */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-md ring-2 ring-[var(--accent)]/20">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/15 via-[var(--surface-2)] to-transparent px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] font-bold shadow-xs">
                        <Sparkles className="h-3 w-3" />
                        Finalist Plaque
                      </span>
                      <span className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--state-done)] font-bold">
                        Top 10 Finalist
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--fg-mute)]">
                      University of Kelaniya
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[12px] font-medium text-[var(--accent)]">
                  02 / 02
                </span>
              </div>

              {/* Event Title & Summary */}
              <div className="mt-6">
                <h3 className="font-serif text-[24px] md:text-[28px] font-normal leading-[1.2] text-[var(--fg)]">
                  {ideasprint.event} Innovation Competition
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--fg-soft)]">
                  Selected among the premier <strong>Top 10 Finalist Teams</strong> at the flagship annual IdeaSprint innovation competition hosted at the University of Kelaniya, evaluating technical feasibility, creative design, and strategic business execution.
                </p>
              </div>

              {/* Highlight Badges */}
              <div className="mt-5 space-y-2 border-t border-[var(--rule-soft)] pt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                  // Core Evaluation Criteria:
                </div>
                {IDEASPRINT_HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-[var(--fg-soft)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department of Industrial Management Seal / Certificate Card */}
            <div className="mt-7 border-t border-[var(--rule-soft)] pt-5">
              <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 p-4.5 backdrop-blur-sm">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-[14px] text-[var(--fg)]">
                      Academic & Competitive Excellence
                    </div>
                    <p className="mt-1 text-[12.5px] leading-[1.6] text-[var(--fg-mute)]">
                      Representing the Department of Industrial Management in inter-faculty innovation challenges, demonstrating rapid prototype execution and quantitative business modeling.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule-soft)] pt-3 font-mono text-[10.5px]">
                  <span className="text-[var(--fg-faint)]">Host: University of Kelaniya</span>
                  <span className="text-[var(--accent)] font-semibold">Status: Top 10 Plaque Awarded</span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Bottom Achievement Telemetry Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[var(--rule-soft)] pt-8">
          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[28px] font-bold text-[var(--accent)]">2×</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Top 10 Finalist Honors
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              IdeaSprint & Trinova Youth Innovation
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[28px] font-bold text-[var(--fg)]">100%</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Venture Feasibility
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              Validated Prototypes & Business Models
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[28px] font-bold text-[var(--state-done)]">1</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Industry Partnership
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              CINEC Campus × FRYM Intimates Collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-xl"
            onClick={handleCloseLightbox}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[92vh] max-w-6xl w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImg}
                alt="Innovation Competition Event"
                width={1600}
                height={1000}
                className="h-auto max-h-[90vh] w-full object-contain"
                sizes="100vw"
                priority
              />
              <button
                type="button"
                onClick={handleCloseLightbox}
                className="btn-glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[12px] text-white shadow-xl backdrop-blur-md"
              >
                <X className="h-4 w-4" />
                <span>Close (ESC)</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

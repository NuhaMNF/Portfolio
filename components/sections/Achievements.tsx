"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { achievements } from "@/lib/data";
import { Trophy, Award, Maximize2, Sparkles, Building, X } from "lucide-react";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playModalOpen, playModalClose } from "@/lib/sound";

export function Achievements() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

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

  return (
    <section id="achievements" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>06 / Achievements</span>
        </div>

        {/* Section Title */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[1.04] tracking-[-0.03em] text-[var(--fg)]">
              Innovation honors & <span className="display-italic text-[var(--fg-soft)]">competitions</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Demonstrated creative problem-solving, product pitch validation, and rapid prototyping in competitive university and national hackathons.
            </p>
          </div>
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {achievements.map((item, i) => {
            const photos = item.images ?? [];
            const featured = photos.length > 0;
            const Icon = featured ? Trophy : Award;

            return (
              <motion.div
                key={item.event}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className={featured ? "md:col-span-2" : ""}
              >
                <SpotlightCard className="p-7 md:p-9 shadow-xl border-[var(--rule)] hover:border-[var(--accent)]/50 transition-all">
                  {/* Top Plaque Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule-soft)] pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xs">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Golden Plaque Ribbon */}
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent-glow)]/80 via-[var(--surface-2)] to-transparent px-3 py-1 font-mono text-[9.5px] uppercase tracking-wider text-[var(--accent)] font-bold shadow-xs">
                          <Sparkles className="h-3 w-3" />
                          Finalist Award
                        </span>
                        <span className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-mute)]">
                          Top 10
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                      {String(i + 1).padStart(2, "0")} / {String(achievements.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Body Details & Photo Lightbox Grid */}
                  <div className={`mt-7 ${featured ? "grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start" : ""}`}>
                    <div>
                      <h3 className="font-serif text-[clamp(26px,3vw,36px)] font-normal leading-[1.15] text-[var(--fg)]">
                        {item.title}
                      </h3>
                      <div className="mt-2.5 font-mono text-[13.5px] font-semibold text-[var(--accent)]">
                        {item.event}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--fg-mute)]">
                        <Building className="h-3 w-3 text-[var(--fg-faint)]" />
                        <span>Organized by {item.org}</span>
                      </div>
                      <p className="mt-4 text-[15px] leading-[1.7] text-[var(--fg-soft)]">
                        {item.description}
                      </p>
                    </div>

                    {/* On-Stage Event Photographs */}
                    {featured && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {photos.map((photo) => (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() => setLightboxImg(photo.src)}
                            data-cursor="open"
                            className="group relative overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)] text-left shadow-md transition-all duration-300 hover:border-[var(--accent)]/60 hover:shadow-xl focus:outline-hidden"
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                              <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                sizes="(max-width: 768px) 100vw, 40vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)]/90 backdrop-blur-sm">
                              <div>
                                <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                                  {photo.tag}
                                </div>
                                <div className="mt-0.5 text-[13px] font-medium text-[var(--fg)] truncate">
                                  {photo.title}
                                </div>
                              </div>
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--fg-mute)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-colors">
                                <Maximize2 className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Overlay */}
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

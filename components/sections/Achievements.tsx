"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { achievements } from "@/lib/data";
import { Trophy, Award, Maximize2 } from "lucide-react";
import Image from "next/image";

export function Achievements() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxImg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImg(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxImg]);

  return (
    <section id="achievements" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>06 / Achievements</span>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Innovation honors & <span className="display-italic text-[var(--fg-soft)]">competitions</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Demonstrated creative problem-solving and rapid ideation in competitive hackathons and innovation challenges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                className={`rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-7 md:p-8 backdrop-blur-xl shadow-lg transition-all hover:border-[var(--accent)]/40 hover:shadow-xl ${
                  featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                      Finalist Award
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                    {String(i + 1).padStart(2, "0")} / {String(achievements.length).padStart(2, "0")}
                  </span>
                </div>

                <div className={`mt-6 ${featured ? "grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start" : ""}`}>
                  <div>
                    <h3 className="font-serif text-[clamp(24px,2.8vw,34px)] font-normal leading-[1.15] text-[var(--fg)]">
                      {item.title}
                    </h3>
                    <div className="mt-2 font-mono text-[13px] font-medium text-[var(--accent)]">
                      {item.event}
                    </div>
                    <div className="mt-1 font-mono text-[11.5px] text-[var(--fg-mute)]">
                      Organized by {item.org}
                    </div>
                    <p className="mt-4 text-[14.5px] leading-[1.7] text-[var(--fg-soft)]">
                      {item.description}
                    </p>
                  </div>

                  {featured && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => setLightboxImg(photo.src)}
                          className="group overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)] text-left shadow-md transition-colors hover:border-[var(--accent)]/40"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <Image
                              src={photo.src}
                              alt={photo.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                          </div>
                          <div className="flex items-center justify-between px-3.5 py-3">
                            <div>
                              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                                {photo.tag}
                              </div>
                              <div className="mt-0.5 text-[13.5px] text-[var(--fg)]">{photo.title}</div>
                            </div>
                            <Maximize2 className="h-4 w-4 text-[var(--fg-faint)]" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-lg"
            onClick={() => setLightboxImg(null)}
          >
            <div className="relative max-h-[90vh] max-w-6xl w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
              <Image
                src={lightboxImg}
                alt="Trinova Youth Innovation Competition"
                width={1600}
                height={1000}
                className="h-auto max-h-[90vh] w-full object-contain"
                sizes="100vw"
              />
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="btn-glass absolute right-4 top-4 rounded-full p-2 font-mono text-[12px] text-white"
              >
                Close (ESC)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

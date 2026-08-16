"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import { GraduationCap, BookOpen, Calendar, MapPin } from "lucide-react";

export function Education() {
  return (
    <section id="education" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>05 / Education</span>
        </div>

        {/* Heading */}
        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Academic foundations & <span className="display-italic text-[var(--fg-soft)]">disciplines</span>.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              Rigorous formal coursework bridging information technology architecture with organizational management science.
            </p>
          </div>
        </div>

        {/* Education Card */}
        <div className="space-y-8">
          {education.map((edu, i) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 p-8 md:p-10 backdrop-blur-xl shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule-soft)] pb-6">
                <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--fg-mute)]">
                  <span className="flex items-center gap-1.5 text-[var(--accent)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{edu.period}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[var(--fg-faint)]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Sri Lanka</span>
                  </span>
                </div>
                <span className="rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--state-done)]">
                  {edu.note}
                </span>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex items-center gap-3 text-[var(--accent)] mb-3">
                    <GraduationCap className="h-6 w-6" />
                    <span className="font-mono text-[12px] uppercase tracking-[0.18em]">Undergraduate Degree</span>
                  </div>
                  <h3 className="font-serif text-[clamp(26px,3.2vw,40px)] font-normal leading-[1.15] text-[var(--fg)]">
                    {edu.degree}
                  </h3>
                  <div className="mt-3 text-[17px] font-medium text-[var(--fg-soft)]">
                    {edu.institution}
                  </div>
                  <div className="mt-1 font-mono text-[13px] text-[var(--fg-mute)]">
                    {edu.department}
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-6">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] mb-4">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Areas of Interest</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[12px] text-[var(--fg-soft)] shadow-xs"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
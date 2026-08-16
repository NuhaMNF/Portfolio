import { education } from "@/lib/data";
import { GraduationCap } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function Education() {
  return (
    <section id="education" className="relative px-6 py-16 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>05 / Education</span>
        </div>

        {education.map((edu) => (
          <SpotlightCard
            key={edu.institution}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-[clamp(22px,2.4vw,32px)] font-normal leading-[1.2] text-[var(--fg)]">
                    {edu.degree}
                  </h2>
                  <p className="mt-1.5 text-[15px] text-[var(--fg-soft)]">
                    {edu.institution}
                  </p>
                  <p className="mt-0.5 font-mono text-[12px] text-[var(--fg-mute)]">
                    {edu.department} · {edu.period} · {edu.note}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
                {edu.focus.map((f) => (
                  <span
                    key={f}
                    className="rounded-md border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-1 font-mono text-[11.5px] text-[var(--fg-soft)]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

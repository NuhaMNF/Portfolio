import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-20 md:py-24 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>03 / Capabilities</span>
        </div>

        <h2 className="mb-10 font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.03em] text-[var(--fg)]">
          Tools I actually use
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([group, items]) => (
            <div
              key={group}
              className="rounded-xl border border-[var(--rule)] bg-[var(--surface)]/60 p-5"
            >
              <div className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                {group}
              </div>
              <ul className="mt-3 space-y-1.5">
                {items.map((s) => (
                  <li key={s} className="text-[14px] text-[var(--fg-soft)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

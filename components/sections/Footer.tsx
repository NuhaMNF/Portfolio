"use client";

import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--rule)] px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="display text-[36px] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
              <span className="display-italic">Nuha</span> Nizar
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-[1.6] text-[var(--fg-mute)]">
              {profile.role}. A living computational notebook.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              workspace
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li><a href="#about" className="link-underline">/about</a></li>
              <li><a href="#skills" className="link-underline">/capabilities</a></li>
              <li><a href="#projects" className="link-underline">/projects</a></li>
              <li><a href="#research" className="link-underline">/research</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              channels
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li><a href={`mailto:${profile.email}`} className="link-underline">/email</a></li>
              <li><a href={profile.github} target="_blank" rel="noreferrer" className="link-underline">/github</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline">/linkedin</a></li>
              <li><a href={profile.twitter} target="_blank" rel="noreferrer" className="link-underline">/twitter</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              notebook
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("nuha:run"))}
                  className="link-underline"
                >
                  /run_nuha()
                </button>
              </li>
              <li>
                <span className="text-[var(--fg-faint)]">⌘K</span> command palette
              </li>
              <li>
                <span className="text-[var(--fg-faint)]">⌘⏎</span> activate
              </li>
              <li>
                <span className="text-[var(--fg-faint)]">ESC</span> skip boot
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--rule)] pt-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)] md:flex-row md:items-center">
          <span>
            <span className="text-[var(--accent)]">↳</span> end of notebook · saved{" "}
            <span className="metric text-[var(--fg-mute)]">{new Date().toISOString().slice(0, 10)}</span>
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name} · built with care
          </span>
        </div>
      </div>
    </footer>
  );
}
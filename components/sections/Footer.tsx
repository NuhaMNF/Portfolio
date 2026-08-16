"use client";

import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--rule)] px-6 py-12 lg:px-12 bg-[var(--surface)]/30 backdrop-blur-md">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="display text-[32px] leading-[1] tracking-[-0.02em] text-[var(--fg)]">
              <span className="display-italic">Nuha</span> Nizar
            </div>
            <p className="mt-3 max-w-xs text-[13.5px] leading-[1.6] text-[var(--fg-mute)]">
              {profile.role} · University of Kelaniya
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              Sections
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li><a href="#about" className="link-underline">02 / About</a></li>
              <li><a href="#skills" className="link-underline">03 / Capabilities</a></li>
              <li><a href="#projects" className="link-underline">04 / Projects</a></li>
              <li><a href="#education" className="link-underline">05 / Education</a></li>
              <li><a href="#achievements" className="link-underline">06 / Achievements</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              Connect
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li><a href={`mailto:${profile.email}`} className="link-underline">Email</a></li>
              <li><a href={profile.github} target="_blank" rel="noreferrer" className="link-underline">GitHub</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
              Shortcuts
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[12px] text-[var(--fg-mute)]">
              <li>
                <span className="text-[var(--fg-faint)]">⌘K</span> Command Menu
              </li>
              <li>
                <span className="text-[var(--fg-faint)]">T</span> Toggle Theme
              </li>
              <li>
                <span className="text-[var(--fg-faint)]">K</span> Cycle Glow
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--rule)] pt-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--fg-faint)] md:flex-row md:items-center">
          <span>
            {profile.role} · Department of Industrial Management
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name} · All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { education } from "@/lib/data";
import {
  GraduationCap,
  BookOpen,
  Code2,
  BarChart3,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Compass,
  Layers,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playSelect } from "@/lib/sound";

const CURRICULUM_PILLARS = [
  {
    icon: Code2,
    title: "Software Engineering & Systems",
    tagline: "Architecture & Implementation",
    modules: [
      "Object-Oriented Programming (Java, C++)",
      "Relational Database Management (PostgreSQL, MySQL)",
      "Web Application Development (React.js, Node.js)",
      "Systems Analysis & Software Architecture",
    ],
    outcome:
      "Hands-on engineering of production-grade applications with normalized 3NF database design and RESTful APIs.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Quantitative Science",
    tagline: "Informed Decision Support",
    modules: [
      "Applied Statistics & Quantitative Techniques",
      "Data Modeling & Business Intelligence",
      "Management Information Systems (MIS)",
      "Decision Support Systems & Predictive Analytics",
    ],
    outcome:
      "Translating complex operational data into actionable dashboards and strategic business insights.",
  },
  {
    icon: Building2,
    title: "Industrial Management & Operations",
    tagline: "Strategic Process Execution",
    modules: [
      "Operations Management & Process Optimization",
      "Agile Project Management & Sprint Planning",
      "Supply Chain & Enterprise Systems (ERP)",
      "Organizational Behavior & Tech Leadership",
    ],
    outcome:
      "Bridging technical delivery with corporate objectives, resource allocation, and team velocity.",
  },
];

const HIGHLIGHT_MODULES = [
  { name: "Database Management Systems", code: "PostgreSQL · 3NF Normalization · SQL DDL/DML" },
  { name: "Object-Oriented Development", code: "Java · C++ · Design Patterns · Modular Architecture" },
  { name: "Web Application Engineering", code: "React.js · Node.js · REST APIs · State Management" },
  { name: "Management Information Systems", code: "Enterprise ERP · Business Workflow Modeling" },
  { name: "Quantitative Decision Making", code: "Applied Statistical Modeling · Optimization" },
  { name: "Agile Project Management", code: "Scrum · Sprint Backlogs · Cross-Team Collaboration" },
];

export function Education() {
  const [activePillar, setActivePillar] = useState<number>(0);
  const edu = education[0];

  return (
    <section id="education" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Tag */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <span>05 / Academic Foundation</span>
        </div>

        {/* Section Headline */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Rigorous grounding in <span className="display-italic text-[var(--fg-soft)]">management science</span> and software.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              The <strong>BSc (Hons) in Management and Information Technology (MIT)</strong> at the University of Kelaniya provides a multidisciplinary curriculum combining quantitative analytics with modern software engineering.
            </p>
          </div>
        </div>

        {/* Master Academic Chassis */}
        <SpotlightCard className="overflow-hidden p-6 md:p-10 shadow-2xl">
          {/* Top Institution & Degree Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[var(--rule-soft)] pb-8">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xl ring-2 ring-[var(--accent)]/20">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                    Faculty of Science · University of Kelaniya
                  </span>
                  <span className="hidden sm:inline text-[var(--fg-faint)]">·</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--state-done)]/15 border border-[var(--state-done)]/25 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[var(--state-done)] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--state-done)] animate-pulse" />
                    Active Candidate
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-[clamp(26px,3.2vw,40px)] font-normal leading-[1.15] text-[var(--fg)]">
                  {edu.degree}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-[var(--fg-soft)]">
                  <span className="font-medium text-[var(--fg)]">{edu.institution}</span>
                  <span>·</span>
                  <span className="text-[var(--accent)]">{edu.department}</span>
                  <span>·</span>
                  <span className="text-[var(--fg-mute)]">{edu.period} (Expected {edu.note})</span>
                </div>
              </div>
            </div>

            {/* Quick Department Metrics */}
            <div className="flex items-center gap-3 self-start lg:self-center font-mono text-[11px]">
              <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-4 py-2.5 text-center">
                <div className="text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">Degree Program</div>
                <div className="text-[14px] font-bold text-[var(--fg)] mt-0.5">4-Year Honours</div>
              </div>
              <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-4 py-2.5 text-center">
                <div className="text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">Department</div>
                <div className="text-[14px] font-bold text-[var(--accent)] mt-0.5">Industrial Mgmt</div>
              </div>
            </div>
          </div>

          {/* Three Core Academic Pillars */}
          <div className="mt-9">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)] mb-4">
              // Core Multidisciplinary Curriculum Pillars
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {CURRICULUM_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isSelected = activePillar === idx;

                return (
                  <div
                    key={pillar.title}
                    onClick={() => {
                      playSelect(idx + 1);
                      setActivePillar(idx);
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--surface-2)]/80 ring-1 ring-[var(--accent)]/30 shadow-lg"
                        : "border-[var(--rule-soft)] bg-[var(--surface-2)]/30 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)]/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                          Pillar 0{idx + 1}
                        </span>
                      </div>

                      <h4 className="font-serif text-[18px] font-medium text-[var(--fg)]">
                        {pillar.title}
                      </h4>
                      <div className="font-mono text-[11.5px] text-[var(--accent)] mt-0.5">
                        {pillar.tagline}
                      </div>

                      {/* Course Modules List */}
                      <ul className="mt-4 space-y-2 border-t border-[var(--rule-soft)] pt-3.5 font-sans text-[13px] text-[var(--fg-soft)]">
                        {pillar.modules.map((m) => (
                          <li key={m} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Applied Outcome */}
                    <div className="mt-5 rounded-xl border border-[var(--rule-soft)] bg-[var(--surface)]/70 p-3 font-sans text-[12px] leading-[1.6] text-[var(--fg-mute)]">
                      <strong className="font-mono text-[10.5px] uppercase text-[var(--fg)] block mb-1">
                        Practical Application:
                      </strong>
                      {pillar.outcome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key University Modules Matrix */}
          <div className="mt-10 border-t border-[var(--rule-soft)] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-faint)]">
                // Verified Academic Competencies & Coursework
              </div>
              <div className="font-mono text-[11px] text-[var(--fg-mute)]">
                University of Kelaniya · Department of Industrial Management
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHT_MODULES.map((mod) => (
                <div
                  key={mod.name}
                  className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-4 transition-colors hover:border-[var(--accent)]/30 hover:bg-[var(--surface-2)]/70"
                >
                  <div className="flex items-center gap-2 font-medium text-[14px] text-[var(--fg)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                    <span>{mod.name}</span>
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] text-[var(--fg-mute)]">
                    {mod.code}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Distinction Banner */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)]">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium text-[14.5px] text-[var(--fg)]">
                  Department of Industrial Management (DIM)
                </div>
                <p className="text-[12.5px] text-[var(--fg-soft)] mt-0.5">
                  Renowned in Sri Lanka for producing technology leaders who integrate software engineering with industrial management strategy.
                </p>
              </div>
            </div>

            <a
              href="#achievements"
              data-cursor="view"
              className="btn-glass shrink-0 inline-flex items-center gap-2 px-4 py-2 font-mono text-[11.5px] text-[var(--fg-soft)] rounded-xl"
            >
              <span>View Competition Honors</span>
            </a>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Database,
  Terminal,
  BarChart3,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  Server,
  Workflow,
  Shield,
  Compass,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playSelect, playSwitch } from "@/lib/sound";

export interface SkillItem {
  id: string;
  name: string;
  category: "languages" | "web" | "database" | "tools" | "management";
  level: "Advanced" | "Proficient" | "Core Competency";
  description: string;
  icon: typeof Code2;
  projectLink?: string;
  projectLinkLabel?: string;
}

const CATEGORIES = [
  { id: "all", label: "All Capabilities", icon: Sparkles },
  { id: "languages", label: "Languages & OOP", icon: Code2 },
  { id: "web", label: "Web & Full-Stack", icon: Server },
  { id: "database", label: "Database Engineering", icon: Database },
  { id: "tools", label: "Developer Toolchain", icon: Terminal },
  { id: "management", label: "Management & MIS", icon: BarChart3 },
] as const;

const SKILLS_DATA: SkillItem[] = [
  // Database Engineering
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "database",
    level: "Advanced",
    description: "Normalized 3NF relational schemas, composite indices, foreign keys, and audit logging triggers.",
    icon: Database,
    projectLink: "#projects",
    projectLinkLabel: "Flagship Task Management",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "database",
    level: "Proficient",
    description: "Relational database modeling, complex JOIN queries, indexing strategies, and transactional integrity.",
    icon: Database,
    projectLink: "#education",
    projectLinkLabel: "Academic Coursework",
  },
  {
    id: "3nf-schema",
    name: "Database Normalization (3NF)",
    category: "database",
    level: "Advanced",
    description: "Eliminating data redundancy and ensuring referential integrity in high-concurrency production models.",
    icon: Layers,
    projectLink: "#projects",
    projectLinkLabel: "Task Management DDL",
  },

  // Web & Full-Stack
  {
    id: "react",
    name: "React.js",
    category: "web",
    level: "Advanced",
    description: "Component architecture, reactive state management, custom hooks, and high-performance UI engineering.",
    icon: Server,
    projectLink: "#projects",
    projectLinkLabel: "Task Management Frontend",
  },
  {
    id: "nodejs",
    name: "Node.js & Express",
    category: "web",
    level: "Proficient",
    description: "REST API endpoints, middleware routing, request validation, and asynchronous task execution.",
    icon: Server,
    projectLink: "#projects",
    projectLinkLabel: "Task Management Backend",
  },
  {
    id: "rest-api",
    name: "RESTful API Architecture",
    category: "web",
    level: "Advanced",
    description: "HTTP verbs (GET, POST, PATCH, DELETE), standardized JSON responses, and status code lifecycle.",
    icon: Workflow,
    projectLink: "#projects",
    projectLinkLabel: "Express API Endpoints",
  },

  // Languages & Core
  {
    id: "java",
    name: "Java",
    category: "languages",
    level: "Proficient",
    description: "Object-oriented programming, data structures, inheritance, polymorphism, and modular software design.",
    icon: Code2,
    projectLink: "#education",
    projectLinkLabel: "Department of Industrial Mgmt",
  },
  {
    id: "cpp",
    name: "C++",
    category: "languages",
    level: "Proficient",
    description: "Algorithmic problem solving, pointer arithmetic, memory management, and structured computing.",
    icon: Cpu,
    projectLink: "#education",
    projectLinkLabel: "Computer Science Modules",
  },
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "languages",
    level: "Advanced",
    description: "Modern asynchronous JavaScript, promises, DOM manipulation, and functional patterns.",
    icon: Code2,
    projectLink: "#projects",
    projectLinkLabel: "Full-Stack Web Stack",
  },

  // Developer Toolchain
  {
    id: "git",
    name: "Git & GitHub",
    category: "tools",
    level: "Advanced",
    description: "Version control workflows, branch management, collaborative pull requests, and commit history tracking.",
    icon: Terminal,
    projectLink: "https://github.com/NuhaMNF",
    projectLinkLabel: "github.com/NuhaMNF",
  },
  {
    id: "postman",
    name: "Postman & API Testing",
    category: "tools",
    level: "Proficient",
    description: "Endpoint contract testing, JSON payload validation, authorization headers, and status debugging.",
    icon: Terminal,
  },
  {
    id: "debugging",
    name: "Software Debugging & QA",
    category: "tools",
    level: "Proficient",
    description: "Browser DevTools profiling, breakpoint inspection, network tab analysis, and error stack tracing.",
    icon: Shield,
  },

  // Management & Analytics
  {
    id: "data-analysis",
    name: "Quantitative Data Analysis",
    category: "management",
    level: "Advanced",
    description: "Structuring operational metrics, statistical modeling, and data-driven executive decision making.",
    icon: BarChart3,
    projectLink: "#education",
    projectLinkLabel: "University of Kelaniya (DIM)",
  },
  {
    id: "mis",
    name: "Management Information Systems (MIS)",
    category: "management",
    level: "Advanced",
    description: "Enterprise workflows, ERP system concepts, operations management, and technology leadership.",
    icon: Compass,
    projectLink: "#education",
    projectLinkLabel: "BSc (Hons) MIT Core",
  },
  {
    id: "agile",
    name: "Agile & Scrum Methodologies",
    category: "management",
    level: "Proficient",
    description: "Sprint planning, user story decomposition, backlog grooming, and cross-functional team coordination.",
    icon: Workflow,
    projectLink: "#projects",
    projectLinkLabel: "Team Project Execution",
  },
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredSkills =
    activeCategory === "all"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Tag */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <span>03 / Capabilities & Domain Studio</span>
        </div>

        {/* Section Headline */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(34px,4.5vw,60px)] leading-[1.04] tracking-[-0.03em] text-[var(--fg)]">
              Software engineering, <span className="display-italic text-[var(--fg-soft)]">database architecture</span>, and analytics.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              A balanced technical toolchain honed through academic rigor at the <strong>Department of Industrial Management (University of Kelaniya)</strong> and applied full-stack software development.
            </p>
          </div>
        </div>

        {/* Interactive Domain Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--rule-soft)] pb-5 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playSwitch();
                  setActiveCategory(cat.id);
                }}
                data-cursor="view"
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-[12px] transition-all duration-200 ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--fg)] font-semibold shadow-xs ring-1 ring-[var(--accent)]/30"
                    : "border-transparent bg-transparent text-[var(--fg-mute)] hover:bg-[var(--surface-2)]/50 hover:text-[var(--fg)]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}`} />
                <span>{cat.label}</span>
                {cat.id !== "all" && (
                  <span className="rounded bg-[var(--surface)] px-1.5 py-0.2 text-[9.5px] font-mono text-[var(--fg-faint)]">
                    {SKILLS_DATA.filter((s) => s.category === cat.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Skills Grid */}
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;

              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <SpotlightCard className="flex h-full flex-col justify-between p-6 shadow-md transition-all hover:border-[var(--accent)]/40 hover:shadow-xl">
                    <div>
                      {/* Card Header: Icon & Proficiency Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--accent)] shadow-xs">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider font-semibold border ${
                            skill.level === "Advanced"
                              ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]"
                              : skill.level === "Proficient"
                              ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                              : "bg-[var(--surface-2)] border-[var(--rule)] text-[var(--fg-mute)]"
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>

                      {/* Skill Name & Description */}
                      <h3 className="font-serif text-[18px] font-medium text-[var(--fg)]">
                        {skill.name}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--fg-soft)]">
                        {skill.description}
                      </p>
                    </div>

                    {/* Project / Academic Linkage */}
                    {skill.projectLink && (
                      <div className="mt-5 border-t border-[var(--rule-soft)] pt-3.5">
                        <a
                          href={skill.projectLink}
                          target={skill.projectLink.startsWith("http") ? "_blank" : undefined}
                          rel={skill.projectLink.startsWith("http") ? "noreferrer" : undefined}
                          data-cursor="view"
                          onClick={() => playSelect(2)}
                          className="group/link inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-mute)] hover:text-[var(--accent)] transition-colors"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                          <span className="truncate">{skill.projectLinkLabel}</span>
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Technical Telemetry Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[var(--rule-soft)] pt-8">
          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[26px] font-bold text-[var(--accent)]">5</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Core Technical Domains
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              Databases, Full-Stack, OOP, Toolchain, MIS
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[26px] font-bold text-[var(--fg)]">3NF</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Relational Integrity
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              Normalized PostgreSQL & MySQL Architectures
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface)]/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono text-[26px] font-bold text-[var(--state-done)]">100%</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-soft)] font-medium">
              Applied Execution
            </div>
            <p className="mt-1 text-[12px] text-[var(--fg-mute)]">
              Production Full-Stack & Competition Prototypes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

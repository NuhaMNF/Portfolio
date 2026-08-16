"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectDetailModal } from "@/components/project/ProjectDetailModal";
import { projects } from "@/lib/data";
import {
  ArrowUpRight,
  Layers,
  Database,
  Maximize2,
  Table,
  SlidersHorizontal,
  Bell,
  Presentation,
  Users,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import Image from "next/image";

export function Projects() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const project = projects[0];
  const activeProject = selected ? project : null;

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

  const views = [
    {
      id: "presentation",
      label: "Presentation",
      title: "Project presentation",
      icon: Presentation,
      tag: "On stage",
      src: "/projects/task-management/presentation.png",
      caption: "Presenting the problem, solution, and product flow to a live audience.",
      kind: "photo" as const,
    },
    {
      id: "team",
      label: "Team",
      title: "Team",
      icon: Users,
      tag: "Event",
      src: "/projects/task-management/team.png",
      caption: "Team photograph from the collaboration event.",
      kind: "photo" as const,
    },
    {
      id: "tasks-table",
      label: "Tasks Directory",
      title: "All Tasks Directory & Filters",
      icon: Table,
      tag: "Table View",
      src: "/projects/task-management/tasks-table.jpg",
      caption: "Interactive table with status/priority filtering, role assignment tags, and deadline tracking.",
      kind: "ui" as const,
    },
    {
      id: "task-details",
      label: "Task Configuration",
      title: "Task Configuration & Comments",
      icon: SlidersHorizontal,
      tag: "Modal Editor",
      src: "/projects/task-management/task-details.jpg",
      caption: "Task modal editor featuring dynamic assignee selection, due date picker, and collaborative comments thread.",
      kind: "ui" as const,
    },
    {
      id: "notifications",
      label: "Live Notifications",
      title: "Live Activity & Notifications",
      icon: Bell,
      tag: "Activity Hub",
      src: "/projects/task-management/notifications.jpg",
      caption: "Real-time activity audit feed tracking task assignment changes and team status updates.",
      kind: "ui" as const,
    },
  ];

  return (
    <section id="projects" className="relative px-6 py-24 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>04 / Flagship Project</span>
        </div>

        {/* Heading */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(36px,5vw,68px)] leading-[1.02] tracking-[-0.03em] text-[var(--fg)]">
              Centralized <span className="display-italic text-[var(--fg-soft)]">task orchestration</span> & collaboration platform.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[16px] leading-[1.75] text-[var(--fg-soft)]">
              A full-stack web application designed to help teams create, organize, assign, and track engineering tasks with real-time audit notifications and PostgreSQL persistence.
            </p>
          </div>
        </div>

        {/* Flagship Project Showcase Container */}
        <div className="rounded-3xl border border-[var(--rule)] bg-[var(--surface)]/75 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
          {/* Top Project Badge & Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule-soft)] pb-6">
            <div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--fg-mute)]">
                <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 font-semibold text-[var(--accent)] uppercase tracking-wider">
                  Featured Application
                </span>
                <span>·</span>
                <span className="metric font-medium text-[var(--fg)]">{project.year}</span>
                <span>·</span>
                <span className="text-[var(--state-done)]">● Production Ready</span>
              </div>
              <h3 className="mt-3 font-serif text-[clamp(28px,3.5vw,44px)] font-normal text-[var(--fg)]">
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-[13px] text-[var(--accent)]">
                {project.subtitle}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
                className="btn-glass btn-glass--accent inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[12px] rounded-lg shadow-sm"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Repository</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                data-cursor="open"
                onClick={() => setSelected(project.id)}
                className="btn-glass inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[12px] text-[var(--fg-soft)] rounded-lg"
              >
                <span>Architecture Specs</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Studio */}
          <div className="mt-8">
            {/* View Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule-soft)] pb-3">
              <div className="flex flex-wrap gap-2">
                {views.map((v, idx) => {
                  const Icon = v.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      data-cursor="view"
                      className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-[12px] transition-all duration-200 ${
                        isActive
                          ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--fg)] shadow-xs"
                          : "border-transparent bg-transparent text-[var(--fg-mute)] hover:bg-[var(--surface-2)]/50 hover:text-[var(--fg)]"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}`} />
                      <span>{v.label}</span>
                      <span className="rounded bg-[var(--surface)] px-1.5 py-0.2 text-[9px] uppercase tracking-wider text-[var(--fg-faint)]">
                        {v.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[var(--fg-faint)]">
                <span>Click image to expand</span>
                <Maximize2 className="h-3 w-3" />
              </div>
            </div>

            {/* Browser Window Mockup Frame */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--bg-paper)] shadow-xl">
              {/* Browser Window Bar */}
              <div className="flex items-center justify-between border-b border-[var(--rule)] bg-[var(--surface)] px-4 py-2.5 font-mono text-[11px] text-[var(--fg-mute)]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="rounded-md border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 px-4 py-1 text-[11px] text-[var(--fg-soft)]">
                  {views[activeTab].kind === "photo"
                    ? views[activeTab].title
                    : "https://app.taskmanagement.local/workspace/tasks"}
                </div>
                <span className="metric text-[var(--accent)] font-medium text-[10px]">
                  {String(activeTab + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")}
                </span>
              </div>

              {/* Image Canvas with Fade Animation */}
              <div
                className={`group relative w-full cursor-zoom-in overflow-hidden bg-black/90 ${
                  views[activeTab].kind === "photo" ? "aspect-[16/10]" : "aspect-[16/9]"
                }`}
                onClick={() => setLightboxImg(views[activeTab].src)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={views[activeTab].src}
                      alt={views[activeTab].title}
                      fill
                      className={`transition-transform duration-500 group-hover:scale-[1.02] ${
                        views[activeTab].kind === "photo" ? "object-cover" : "object-contain"
                      }`}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-5 backdrop-blur-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-serif text-[15px] text-white font-medium">
                        {views[activeTab].title}
                      </div>
                      <p className="font-mono text-[11.5px] text-white/75 mt-0.5">
                        {views[activeTab].caption}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">
                      <Maximize2 className="h-3 w-3" />
                      <span>Full View</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event photos */}
          <div className="mt-10 mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                From the event
              </div>
              <p className="mt-1 text-[14px] text-[var(--fg-soft)]">
                Stage presentation and the team photograph, shown beside the product screens.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {views
              .filter((v) => v.kind === "photo")
              .map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(views.findIndex((v) => v.id === photo.id));
                    setLightboxImg(photo.src);
                  }}
                  className="group overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)] text-left shadow-md transition-colors hover:border-[var(--accent)]/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                        {photo.tag}
                      </div>
                      <div className="mt-0.5 text-[14px] text-[var(--fg)]">{photo.title}</div>
                    </div>
                    <Maximize2 className="h-4 w-4 text-[var(--fg-faint)]" />
                  </div>
                </button>
              ))}
          </div>

          {/* Deep-Dive Feature Breakdown Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] mb-3.5">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-medium text-[15.5px] text-[var(--fg)]">Multi-Member Assignment</h4>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--fg-soft)]">
                Assign tasks with role-based visibility (Project Manager, Collaborator), due date pickers, and dynamic priority tagging.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] mb-3.5">
                <Bell className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-medium text-[15.5px] text-[var(--fg)]">Live Notification Center</h4>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--fg-soft)]">
                Instant audit feed tracking member status transitions, attachment uploads, and comment thread notifications.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/40 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] mb-3.5">
                <Database className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-medium text-[15.5px] text-[var(--fg)]">PostgreSQL & REST API</h4>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--fg-soft)]">
                Normalized database schemas, relational foreign key integrity, and secure Node.js backend endpoints with JWT authentication.
              </p>
            </div>
          </div>

          {/* Tech Stack Matrix Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule-soft)] pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mr-2">
                Stack:
              </span>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-1 font-mono text-[11.5px] text-[var(--fg-soft)]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="font-mono text-[11px] text-[var(--fg-mute)]">
              Repository: <span className="text-[var(--accent)]">NuhaMNF/Task-Management-System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Full-Screen Modal */}
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
                alt="Expanded project photo"
                width={1600}
                height={1000}
                className="h-auto max-h-[90vh] w-full object-contain"
                sizes="100vw"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="btn-glass absolute right-4 top-4 rounded-full p-2 font-mono text-[12px] text-white"
              >
                Close (ESC)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectDetailModal project={activeProject} onClose={() => setSelected(null)} />
    </section>
  );
}
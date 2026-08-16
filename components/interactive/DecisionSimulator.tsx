"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Database,
  ArrowRight,
  RotateCcw,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { playSelect, playDroidChirp } from "@/lib/sound";

interface Scenario {
  id: string;
  title: string;
  badge: string;
  problem: string;
  context: string;
  options: {
    id: string;
    label: string;
    type: "management" | "technical" | "hybrid";
    typeLabel: string;
    description: string;
    isOptimal: boolean;
    feedback: string;
    metrics: { velocity: number; throughput: number; roi: number };
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "sprint-bottleneck",
    title: "The Sprint Bottleneck: Database Concurrency Lag",
    badge: "Scenario 01 / Full-Stack Engineering",
    problem:
      "3 days before the Task Management System deployment, team notification queries are slowing down under heavy concurrent load.",
    context:
      "Managers need accurate real-time task updates, but the relational database needs optimization without breaking the project timeline.",
    options: [
      {
        id: "opt-1",
        label: "Postpone the sprint deadline by 10 days",
        type: "management",
        typeLabel: "Pure Management",
        description: "Re-negotiate milestones with stakeholders to allow more time for review.",
        isOptimal: false,
        feedback: "Safe, but introduces delivery delays that impact product momentum.",
        metrics: { velocity: 45, throughput: 60, roi: 55 },
      },
      {
        id: "opt-2",
        label: "Completely rewrite backend into another language",
        type: "technical",
        typeLabel: "Pure Technical",
        description: "Overhaul the entire architecture from scratch hoping for faster execution.",
        isOptimal: false,
        feedback: "High risk of introducing new bugs and extreme technical overhead.",
        metrics: { velocity: 30, throughput: 70, roi: 40 },
      },
      {
        id: "opt-3",
        label: "Add 3NF composite indices & automated async notification batching",
        type: "hybrid",
        typeLabel: "Nuha's Hybrid MIT Approach",
        description:
          "Targeted PostgreSQL index optimization (idx_notif_recipient) paired with agile priority filtering.",
        isOptimal: true,
        feedback:
          "⚡ Perfect! 94% faster database execution, 0 days delayed, 100% team productivity.",
        metrics: { velocity: 98, throughput: 96, roi: 99 },
      },
    ],
  },
  {
    id: "competition-pitch",
    title: "The Innovation Pitch: 48-Hour Competition Crunch",
    badge: "Scenario 02 / Innovation Strategy",
    problem:
      "At IdeaSprint / Trinova competitions, teams have 48 hours to impress academic and industry judges.",
    context:
      "Judges look for both commercial business viability and a concrete, functional technology prototype.",
    options: [
      {
        id: "opt-1",
        label: "Present a 50-slide theoretical business model deck only",
        type: "management",
        typeLabel: "Pure Management",
        description: "Focus exclusively on financial TAM/SAM forecasts with zero working code.",
        isOptimal: false,
        feedback: "Lacks technical credibility and proof of engineering feasibility.",
        metrics: { velocity: 60, throughput: 40, roi: 65 },
      },
      {
        id: "opt-2",
        label: "Build raw terminal scripts with no market pitch",
        type: "technical",
        typeLabel: "Pure Technical",
        description: "Show command-line output without explaining user value or business impact.",
        isOptimal: false,
        feedback: "Judges cannot evaluate how the product solves a real customer problem.",
        metrics: { velocity: 50, throughput: 75, roi: 45 },
      },
      {
        id: "opt-3",
        label: "Deploy a live interactive web prototype backed by clear unit economics",
        type: "hybrid",
        typeLabel: "Nuha's Hybrid MIT Approach",
        description:
          "Demonstrate a working React & PostgreSQL application paired with a sharp value proposition.",
        isOptimal: true,
        feedback:
          "🏆 Phenomenal! Selected as a Top 10 Finalist at both IdeaSprint & Trinova Youth Innovation!",
        metrics: { velocity: 99, throughput: 95, roi: 98 },
      },
    ],
  },
  {
    id: "ops-efficiency",
    title: "Operations Optimization: Eliminating Spreadsheet Chaos",
    badge: "Scenario 03 / Operations & MIS",
    problem:
      "A cross-functional department loses 15+ hours every week manually chasing task statuses across disparate Excel sheets.",
    context:
      "Team members are overwhelmed by email updates and managers lack visibility into project bottlenecks.",
    options: [
      {
        id: "opt-1",
        label: "Hire 2 extra project coordinators to manually sync sheets",
        type: "management",
        typeLabel: "Pure Management",
        description: "Increase operational headcount to keep up with administrative overhead.",
        isOptimal: false,
        feedback: "Increases operational costs significantly without addressing the root inefficiency.",
        metrics: { velocity: 55, throughput: 50, roi: 40 },
      },
      {
        id: "opt-2",
        label: "Deploy a customized relational Task Management System with audit feeds",
        type: "hybrid",
        typeLabel: "Nuha's Hybrid MIT Approach",
        description:
          "Centralize tasks in a normalized PostgreSQL database with real-time assignment alerts.",
        isOptimal: true,
        feedback:
          "📈 85% administrative friction eliminated! Full transparency across management and engineering.",
        metrics: { velocity: 97, throughput: 99, roi: 96 },
      },
      {
        id: "opt-3",
        label: "Write temporary ad-hoc Python scripts for individual computers",
        type: "technical",
        typeLabel: "Pure Technical",
        description: "Scrape individual spreadsheets without creating a unified collaborative database.",
        isOptimal: false,
        feedback: "Fragile fix that breaks as soon as file formats change.",
        metrics: { velocity: 40, throughput: 65, roi: 50 },
      },
    ],
  },
];

export function DecisionSimulator() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const scenario = SCENARIOS[currentIdx];
  const selected = scenario.options.find((o) => o.id === chosenOption);

  const handleSelectOption = (optId: string) => {
    setChosenOption(optId);
    const opt = scenario.options.find((o) => o.id === optId);
    if (!opt) return;

    if (opt.isOptimal) {
      playDroidChirp("trivia_win");
      if (!completedScenarios.includes(currentIdx)) {
        setCompletedScenarios((prev) => [...prev, currentIdx]);
        setTotalScore((s) => s + 100);
      }
    } else {
      playSelect(1);
    }
  };

  const handleNext = () => {
    playSelect(2);
    setChosenOption(null);
    if (currentIdx + 1 < SCENARIOS.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  const handleReset = () => {
    playSelect(1);
    setCurrentIdx(0);
    setChosenOption(null);
    setCompletedScenarios([]);
    setTotalScore(0);
  };

  return (
    <section id="simulator" className="relative px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <span>Interactive Simulator · The Management & IT Advantage</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11.5px] text-[var(--fg-mute)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Score: <strong className="text-[var(--accent)]">{totalScore} XP</strong></span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="display text-[clamp(32px,4.5vw,56px)] leading-[1.05] tracking-[-0.03em] text-[var(--fg)]">
              How <span className="display-italic text-[var(--fg-soft)]">Management & IT</span> solves problems differently.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[15.5px] leading-[1.7] text-[var(--fg-soft)]">
              Undergraduate training at the <strong>Department of Industrial Management (University of Kelaniya)</strong> bridges strategic business decision making with full-stack engineering. Test the difference below:
            </p>
          </div>
        </div>

        {/* Simulator Chassis */}
        <SpotlightCard className="overflow-hidden p-6 md:p-9 shadow-2xl">
          {/* Top Scenario Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule-soft)] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {SCENARIOS.map((sc, idx) => {
                const isActive = currentIdx === idx;
                const isDone = completedScenarios.includes(idx);
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      playSelect(idx + 1);
                      setCurrentIdx(idx);
                      setChosenOption(null);
                    }}
                    data-cursor="view"
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-mono text-[11.5px] transition-all ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--fg)] shadow-xs"
                        : "border-[var(--rule-soft)] text-[var(--fg-mute)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span>Scenario {idx + 1}</span>
                    {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--state-done)]" />}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-wider">
              {scenario.badge}
            </span>
          </div>

          {/* Scenario Problem Box */}
          <div className="mt-6 rounded-2xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 p-5 md:p-6 backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)] shadow-xs">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-[20px] font-medium text-[var(--fg)]">
                  {scenario.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.65] text-[var(--fg)] font-medium">
                  {scenario.problem}
                </p>
                <p className="mt-1 text-[13px] text-[var(--fg-soft)]">
                  {scenario.context}
                </p>
              </div>
            </div>
          </div>

          {/* Option Selector Cards */}
          <div className="mt-6 space-y-3">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--fg-faint)]">
              // Choose an Approach to Resolve the Challenge:
            </div>

            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
              {scenario.options.map((opt) => {
                const isSelected = chosenOption === opt.id;
                const isOptimal = opt.isOptimal;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    data-cursor="view"
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? isOptimal
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-lg"
                          : "border-amber-500/60 bg-amber-500/10"
                        : "border-[var(--rule-soft)] bg-[var(--surface)]/80 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)]/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider font-semibold ${
                            opt.type === "hybrid"
                              ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
                              : "bg-[var(--surface-2)] text-[var(--fg-mute)]"
                          }`}
                        >
                          {opt.typeLabel}
                        </span>
                        {isSelected && isOptimal && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>

                      <h4 className="font-medium text-[14.5px] text-[var(--fg)] leading-[1.5]">
                        {opt.label}
                      </h4>
                      <p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--fg-soft)]">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--rule-soft)]/50 font-mono text-[10px] text-[var(--fg-faint)]">
                      Click to simulate outcome →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outcome & Telemetry Feedback */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 shadow-xl"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Text Feedback */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                      {selected.isOptimal ? (
                        <>
                          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-bold text-emerald-400">Optimal Strategy Recognized</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                          <span className="font-bold text-amber-400">Sub-Optimal Tradeoff</span>
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-[15px] leading-[1.65] text-[var(--fg)] font-medium">
                      {selected.feedback}
                    </p>
                  </div>

                  {/* Telemetry Impact Gauges */}
                  <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0 font-mono text-[11px]">
                    <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 p-3 text-center min-w-[90px]">
                      <div className="text-[10px] uppercase text-[var(--fg-faint)]">Velocity</div>
                      <div className="text-[17px] font-bold text-[var(--fg)] mt-0.5">
                        {selected.metrics.velocity}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 p-3 text-center min-w-[90px]">
                      <div className="text-[10px] uppercase text-[var(--fg-faint)]">DB Throughput</div>
                      <div className="text-[17px] font-bold text-[var(--accent)] mt-0.5">
                        {selected.metrics.throughput}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 p-3 text-center min-w-[90px]">
                      <div className="text-[10px] uppercase text-[var(--fg-faint)]">Business ROI</div>
                      <div className="text-[17px] font-bold text-[var(--state-done)] mt-0.5">
                        {selected.metrics.roi}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Scenario Button */}
                <div className="mt-5 flex items-center justify-end gap-3 border-t border-[var(--rule-soft)] pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    data-cursor="view"
                    className="btn-glass btn-glass--accent inline-flex items-center gap-2 rounded-xl px-5 py-2 font-mono text-[12px] shadow-xs"
                  >
                    <span>Next Scenario</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </div>
    </section>
  );
}

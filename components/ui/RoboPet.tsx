"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  X,
  Compass,
  Trophy,
  Copy,
  Zap,
  HelpCircle,
  RotateCw,
  Flame,
  Music,
  GraduationCap,
  Glasses,
  Crown,
  CheckCircle2,
  XCircle,
  Settings,
  Smile,
} from "lucide-react";
import { profile } from "@/lib/data";
import { playDroidChirp, playSelect, playSwitch } from "@/lib/sound";
import { copyEmailToClipboard, showToast } from "./ToastNotification";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

type EyeEmotion = "normal" | "happy" | "blink" | "curious" | "sleep" | "love" | "party";
type Accessory = "none" | "cap" | "sunglasses" | "crown";
type VisorColor = "amber" | "cyan" | "magenta" | "emerald" | "rainbow";
type DialogTab = "commands" | "tricks" | "trivia" | "wardrobe";

interface TriviaQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "Which degree is Nuha pursuing at the University of Kelaniya?",
    options: ["BSc (Hons) in Management & IT", "BSc in Computer Science", "BBA in Marketing"],
    correct: 0,
    explanation: "Nuha is pursuing BSc (Hons) in Management & Information Technology!",
  },
  {
    question: "What database engine powers Nuha's Task Management System?",
    options: ["MongoDB", "PostgreSQL (Normalized 3NF)", "SQLite"],
    correct: 1,
    explanation: "The Task Management System uses PostgreSQL with 3NF relational schemas!",
  },
  {
    question: "Which competitions was Nuha a Top 10 Finalist in?",
    options: ["IdeaSprint & Trinova Youth Innovation", "Imagine Cup & IEEEXtreme", "HackaDev & Yarl Geek"],
    correct: 0,
    explanation: "Nuha was selected as a Top 10 Finalist in both IdeaSprint & Trinova!",
  },
];

const SECTION_TIPS: Record<string, string> = {
  hero: "Welcome to Nuha's portfolio! 👋 Click me to explore!",
  about: "Bridging Management insight with Data Analysis! 📊",
  skills: "Explore Java, C++, React, and PostgreSQL skills! ⚡",
  projects: "Check out the Task Management System & SQL schema! 🚀",
  education: "University of Kelaniya · Dept of Industrial Management 🎓",
  achievements: "Top 10 Finalist in IdeaSprint & Trinova! 🏆",
  contact: "Need to get in touch? I can copy Nuha's email! ✉️",
};

export function RoboPet() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DialogTab>("commands");
  const [emotion, setEmotion] = useState<EyeEmotion>("normal");
  const [accessory, setAccessory] = useState<Accessory>("none");
  const [visorColor, setVisorColor] = useState<VisorColor>("amber");
  const [petCount, setPetCount] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [tourEnabled, setTourEnabled] = useState(true);

  // Trick animations
  const [trick, setTrick] = useState<"idle" | "roll" | "boost" | "dance">("idle");
  const trickBusy = trick !== "idle";

  // Trivia state
  const [triviaStep, setTriviaStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const danceBeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { id: currentSection } = useActiveSection();

  // Reset idle timer
  const resetIdle = () => {
    setIsSleeping(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
      setEmotion("sleep");
    }, 45000);
  };

  // Track cursor position for droid pupils
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      resetIdle();
      const right = window.innerWidth - 60;
      const bottom = window.innerHeight - 60;
      const dx = e.clientX - right;
      const dy = e.clientY - bottom;
      const dist = Math.hypot(dx, dy);

      const maxOffset = 3.5;
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(dist / 300, 1);
      setMouseOffset({
        x: Math.cos(angle) * maxOffset * intensity,
        y: Math.sin(angle) * maxOffset * intensity,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    resetIdle();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (danceBeatRef.current) clearInterval(danceBeatRef.current);
    };
  }, []);

  // Periodic blinking
  useEffect(() => {
    if (isSleeping || trick === "dance") return;
    const interval = setInterval(() => {
      if (emotion === "normal") {
        setEmotion("blink");
        setTimeout(() => setEmotion("normal"), 180);
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [emotion, isSleeping, trick]);

  // Auto-Tour Guide commentary on section scroll
  useEffect(() => {
    if (!tourEnabled || isSleeping || isOpen) return;
    const tip = SECTION_TIPS[currentSection];
    if (tip) {
      setSpeech(tip);
      playDroidChirp("surprise");
      setEmotion("curious");

      const timer = setTimeout(() => {
        setSpeech(null);
        setEmotion("normal");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentSection, tourEnabled, isSleeping, isOpen]);

  // Pet action
  const handlePet = () => {
    resetIdle();
    const nextCount = petCount + 1;
    setPetCount(nextCount);
    setEmotion("love");
    playDroidChirp("love");

    const hearts = ["❤️", "✨", "🥰", "⚡", "💖"];
    const chosen = hearts[nextCount % hearts.length];
    setSpeech(`*Beep boop!* ${chosen} (Loved ${nextCount}x)`);

    setTimeout(() => {
      setEmotion("happy");
      setTimeout(() => setEmotion("normal"), 1500);
    }, 1200);
  };

  const handleBarrelRoll = () => {
    if (trickBusy) return;
    resetIdle();
    playDroidChirp("trick");
    setTrick("roll");
    setEmotion("happy");
    setSpeech("Barrel roll — recovering attitude.");
    setTimeout(() => {
      setTrick("idle");
      setEmotion("normal");
    }, 1100);
  };

  const handleJetBoost = () => {
    if (trickBusy) return;
    resetIdle();
    playDroidChirp("boost");
    setTrick("boost");
    setEmotion("curious");
    setSpeech("Thrusters charged. Climbing.");
    setTimeout(() => setEmotion("happy"), 320);
    setTimeout(() => {
      setTrick("idle");
      setEmotion("normal");
    }, 1600);
  };

  const handleDance = () => {
    if (trickBusy) return;
    resetIdle();
    playDroidChirp("dance");
    setTrick("dance");
    setEmotion("party");
    setSpeech("Dance protocol. Four counts, then spin.");
    if (danceBeatRef.current) clearInterval(danceBeatRef.current);
    danceBeatRef.current = setInterval(() => playDroidChirp("dance_beat"), 480);
    setTimeout(() => {
      if (danceBeatRef.current) clearInterval(danceBeatRef.current);
      danceBeatRef.current = null;
      setTrick("idle");
      setEmotion("happy");
      setTimeout(() => setEmotion("normal"), 700);
    }, 4400);
  };

  // Trivia answer submission
  const handleAnswerTrivia = (index: number) => {
    setSelectedAnswer(index);
    const q = TRIVIA_QUESTIONS[triviaStep];
    const isCorrect = index === q.correct;

    if (isCorrect) {
      setScore((s) => s + 100);
      playDroidChirp("happy");
      setEmotion("happy");
    } else {
      playSelect(1);
      setEmotion("curious");
    }

    setTimeout(() => {
      if (triviaStep + 1 < TRIVIA_QUESTIONS.length) {
        setTriviaStep((s) => s + 1);
        setSelectedAnswer(null);
      } else {
        setTriviaFinished(true);
        playDroidChirp("trivia_win");
        setEmotion("love");
      }
    }, 1400);
  };

  const handleResetTrivia = () => {
    setTriviaStep(0);
    setScore(0);
    setSelectedAnswer(null);
    setTriviaFinished(false);
    playSelect(2);
  };

  // Color mapping
  const visorColorClass =
    visorColor === "cyan"
      ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
      : visorColor === "magenta"
      ? "bg-fuchsia-400 shadow-[0_0_8px_#e879f9]"
      : visorColor === "emerald"
      ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
      : visorColor === "rainbow"
      ? "bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 shadow-[0_0_8px_#38bdf8]"
      : "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]";

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-40 select-none font-sans"
    >
      {/* Speech & Interactive Master Console */}
      <AnimatePresence>
        {(isOpen || speech) && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="absolute bottom-20 right-0 w-[330px] max-w-[90vw] overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-white/15"
          >
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  Byte · AI Droid
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSpeech(null);
                }}
                className="btn-glass flex h-6 w-6 items-center justify-center rounded-full text-[var(--fg-mute)] hover:text-[var(--fg)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            {isOpen && (
              <div className="flex items-center justify-between gap-1 border-b border-[var(--rule-soft)] py-2">
                <button
                  type="button"
                  onClick={() => {
                    playSelect(1);
                    setActiveTab("commands");
                  }}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors ${
                    activeTab === "commands"
                      ? "bg-[var(--surface-2)] text-[var(--accent)]"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
                  }`}
                >
                  Actions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSelect(2);
                    setActiveTab("tricks");
                  }}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors ${
                    activeTab === "tricks"
                      ? "bg-[var(--surface-2)] text-[var(--accent)]"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
                  }`}
                >
                  Tricks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSelect(3);
                    setActiveTab("trivia");
                  }}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors ${
                    activeTab === "trivia"
                      ? "bg-[var(--surface-2)] text-[var(--accent)]"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
                  }`}
                >
                  Trivia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSelect(4);
                    setActiveTab("wardrobe");
                  }}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors ${
                    activeTab === "wardrobe"
                      ? "bg-[var(--surface-2)] text-[var(--accent)]"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
                  }`}
                >
                  Style
                </button>
              </div>
            )}

            {/* Droid Speech Text Bubble */}
            <div className="my-3 text-[13px] leading-[1.6] text-[var(--fg)]">
              {speech || "Hi there! I'm Byte, Nuha's robotic assistant. Choose a tab or drag me around!"}
            </div>

            {/* TAB 1: COMMANDS & SHORTCUTS */}
            {activeTab === "commands" && isOpen && (
              <div className="space-y-1.5 border-t border-[var(--rule-soft)] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("projects");
                    el?.scrollIntoView({ behavior: "smooth" });
                    setSpeech("Navigating to Task Management System! 🚀");
                    playDroidChirp("happy");
                  }}
                  data-cursor="view"
                  className="flex w-full items-center justify-between rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>View Flagship Project</span>
                  </span>
                  <span className="text-[10px] text-[var(--fg-faint)]">#projects</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("achievements");
                    el?.scrollIntoView({ behavior: "smooth" });
                    setSpeech("Showing IdeaSprint & Trinova Awards! 🏆");
                    playDroidChirp("happy");
                  }}
                  data-cursor="view"
                  className="flex w-full items-center justify-between rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>Competition Awards</span>
                  </span>
                  <span className="text-[10px] text-[var(--fg-faint)]">Top 10</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    copyEmailToClipboard(profile.email);
                    setSpeech("Copied Nuha's email to your clipboard! ✉️");
                    playDroidChirp("happy");
                  }}
                  data-cursor="view"
                  className="flex w-full items-center justify-between rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>Copy Nuha&apos;s Email</span>
                  </span>
                  <span className="text-[10px] text-[var(--fg-faint)]">1-Click</span>
                </button>
              </div>
            )}

            {/* TAB 2: TRICKS & ACTIONS */}
            {activeTab === "tricks" && isOpen && (
              <div className="space-y-2 border-t border-[var(--rule-soft)] pt-3">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                  <span>Maneuvers</span>
                  <span className={trickBusy ? "text-[var(--accent)]" : ""}>
                    {trick === "roll"
                      ? "Rolling"
                      : trick === "boost"
                      ? "Boosting"
                      : trick === "dance"
                      ? "On the beat"
                      : "Ready"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBarrelRoll}
                  disabled={trickBusy}
                  data-cursor="view"
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
                    trick === "roll"
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--rule-soft)] bg-[var(--surface-2)]/60 hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-[var(--accent)]">
                    <RotateCw className={`h-3.5 w-3.5 ${trick === "roll" ? "animate-spin" : ""}`} />
                  </span>
                  <span>
                    <span className="block font-mono text-[11.5px] text-[var(--fg)]">Barrel roll</span>
                    <span className="block font-mono text-[10px] text-[var(--fg-mute)]">360° corkscrew with trail</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleJetBoost}
                  disabled={trickBusy}
                  data-cursor="view"
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
                    trick === "boost"
                      ? "border-amber-400/70 bg-amber-400/10"
                      : "border-[var(--rule-soft)] bg-[var(--surface-2)]/60 hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-amber-400">
                    <Flame className={`h-3.5 w-3.5 ${trick === "boost" ? "animate-pulse" : ""}`} />
                  </span>
                  <span>
                    <span className="block font-mono text-[11.5px] text-[var(--fg)]">Jet boost</span>
                    <span className="block font-mono text-[10px] text-[var(--fg-mute)]">Crouch, launch, shockwave</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDance}
                  disabled={trickBusy}
                  data-cursor="view"
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
                    trick === "dance"
                      ? "border-pink-400/70 bg-pink-400/10"
                      : "border-[var(--rule-soft)] bg-[var(--surface-2)]/60 hover:border-[var(--accent)]/40"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--surface)] text-pink-400">
                    <Music className={`h-3.5 w-3.5 ${trick === "dance" ? "animate-bounce" : ""}`} />
                  </span>
                  <span>
                    <span className="block font-mono text-[11.5px] text-[var(--fg)]">Dance protocol</span>
                    <span className="block font-mono text-[10px] text-[var(--fg-mute)]">Shuffle, hop, finish spin</span>
                  </span>
                </button>
              </div>
            )}

            {/* TAB 3: TRIVIA QUIZ */}
            {activeTab === "trivia" && isOpen && (
              <div className="border-t border-[var(--rule-soft)] pt-3">
                {!triviaFinished ? (
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)] uppercase mb-2">
                      <span>Question {triviaStep + 1} / {TRIVIA_QUESTIONS.length}</span>
                      <span className="text-[var(--accent)] font-bold">{score} XP</span>
                    </div>

                    <div className="font-medium text-[13px] text-[var(--fg)] mb-3">
                      {TRIVIA_QUESTIONS[triviaStep].question}
                    </div>

                    <div className="space-y-1.5">
                      {TRIVIA_QUESTIONS[triviaStep].options.map((opt, idx) => {
                        const isChosen = selectedAnswer === idx;
                        const isCorrect = idx === TRIVIA_QUESTIONS[triviaStep].correct;

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={selectedAnswer !== null}
                            onClick={() => handleAnswerTrivia(idx)}
                            data-cursor="view"
                            className={`flex w-full items-center justify-between rounded-lg border p-2 text-left font-mono text-[11px] transition-all ${
                              isChosen
                                ? isCorrect
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                                  : "border-rose-500 bg-rose-500/15 text-rose-300"
                                : "border-[var(--rule-soft)] bg-[var(--surface-2)]/50 text-[var(--fg-soft)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
                            }`}
                          >
                            <span>{opt}</span>
                            {isChosen && isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                            {isChosen && !isCorrect && <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="font-serif text-[16px] text-[var(--fg)] font-semibold">
                      🎉 Trivia Completed!
                    </div>
                    <p className="font-mono text-[11.5px] text-[var(--accent)] mt-1">
                      Final Score: {score} XP / 300 XP
                    </p>
                    <button
                      type="button"
                      onClick={handleResetTrivia}
                      className="btn-glass btn-glass--accent mt-3 px-4 py-1.5 font-mono text-[11px] rounded-lg"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: WARDROBE / STYLE */}
            {activeTab === "wardrobe" && isOpen && (
              <div className="space-y-3 border-t border-[var(--rule-soft)] pt-3 font-mono text-[11px]">
                <div>
                  <div className="text-[10px] uppercase text-[var(--fg-faint)] tracking-wider mb-1.5">
                    // Hat & Accessories
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        playSelect(1);
                        setAccessory("none");
                      }}
                      className={`btn-glass py-1.5 rounded-lg text-center ${accessory === "none" ? "border-[var(--accent)] text-[var(--accent)]" : "text-[var(--fg-mute)]"}`}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSelect(2);
                        setAccessory("cap");
                      }}
                      className={`btn-glass flex items-center justify-center py-1.5 rounded-lg ${accessory === "cap" ? "border-[var(--accent)] text-[var(--accent)]" : "text-[var(--fg-mute)]"}`}
                      title="Graduation Cap"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSelect(3);
                        setAccessory("sunglasses");
                      }}
                      className={`btn-glass flex items-center justify-center py-1.5 rounded-lg ${accessory === "sunglasses" ? "border-[var(--accent)] text-[var(--accent)]" : "text-[var(--fg-mute)]"}`}
                      title="Cool Shades"
                    >
                      <Glasses className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSelect(4);
                        setAccessory("crown");
                      }}
                      className={`btn-glass flex items-center justify-center py-1.5 rounded-lg ${accessory === "crown" ? "border-[var(--accent)] text-[var(--accent)]" : "text-[var(--fg-mute)]"}`}
                      title="Innovation Crown"
                    >
                      <Crown className="h-3.5 w-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-[var(--fg-faint)] tracking-wider mb-1.5">
                    // Visor Neon Glow
                  </div>
                  <div className="flex items-center gap-2">
                    {(["amber", "cyan", "magenta", "emerald", "rainbow"] as VisorColor[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          playSelect(1);
                          setVisorColor(c);
                        }}
                        className={`h-5 w-5 rounded-full border border-black/30 transition-transform ${visorColor === c ? "scale-125 ring-2 ring-white/50" : "opacity-70 hover:opacity-100"}`}
                        style={{
                          background:
                            c === "cyan"
                              ? "#22d3ee"
                              : c === "magenta"
                              ? "#e879f9"
                              : c === "emerald"
                              ? "#34d399"
                              : c === "rainbow"
                              ? "linear-gradient(45deg, #f43f5e, #eab308, #06b6d4)"
                              : "var(--accent)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Auto Tour Commentary Toggle */}
                <div className="flex items-center justify-between border-t border-[var(--rule-soft)] pt-2.5">
                  <span className="text-[10.5px] text-[var(--fg-mute)]">Auto Tour Tips</span>
                  <button
                    type="button"
                    onClick={() => {
                      playSwitch();
                      setTourEnabled(!tourEnabled);
                    }}
                    className={`rounded-full px-2 py-0.5 text-[9.5px] uppercase ${tourEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`}
                  >
                    {tourEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Quick Pet Counter */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--rule-soft)] pt-2.5">
              <span className="font-mono text-[10px] text-[var(--fg-faint)]">
                Drag Byte anywhere ✦
              </span>
              <button
                type="button"
                onClick={handlePet}
                data-cursor="view"
                className="btn-glass inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10.5px] text-pink-400 hover:text-pink-300"
              >
                <Heart className="h-3 w-3 fill-pink-400/40 text-pink-400" />
                <span>Pet ({petCount})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Body with Physics */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        {trick === "roll" &&
          [0.07, 0.14].map((delay) => (
            <motion.div
              key={delay}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[var(--accent)]/35 bg-[var(--accent)]/10"
              initial={{ rotate: 0, y: 0, x: 0, opacity: 0.45 }}
              animate={{
                rotate: [0, 180, 360],
                y: [0, -48, 0],
                x: [0, 22, 0],
                opacity: [0.4, 0.18, 0],
              }}
              transition={{ duration: 1, delay, ease: [0.45, 0.02, 0.2, 1] }}
              style={{ transformOrigin: "center bottom" }}
            />
          ))}

        {trick === "boost" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-amber-300/80"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0, 0.9, 0], scale: [0.3, 0.3, 2.6, 3.4] }}
            transition={{ duration: 1.5, times: [0, 0.68, 0.82, 1], ease: "easeOut" }}
          />
        )}

      <motion.div
        animate={
          trick === "roll"
            ? { rotate: [0, 180, 360], y: [0, -48, 0], x: [0, 22, 0], scale: [1, 1.08, 1] }
            : trick === "boost"
            ? {
                y: [0, 10, -132, -114, 14, -7, 0],
                scaleY: [1, 0.76, 1.2, 1.04, 0.86, 1.06, 1],
                scaleX: [1, 1.18, 0.86, 0.98, 1.14, 0.97, 1],
                rotate: [0, -5, 7, -3, 3, -1, 0],
              }
            : trick === "dance"
            ? {
                y: [0, -14, 0, -18, 0, -12, 0, -22, -8, 0],
                x: [0, 10, -10, 12, -10, 8, -8, 4, 0, 0],
                rotate: [0, -18, 18, -20, 16, -10, 12, 90, 270, 360],
                scale: [1, 1.1, 0.95, 1.12, 0.98, 1.08, 0.96, 1.14, 1.04, 1],
              }
            : { y: isHovered ? -8 : [-4, 4, -4], rotate: 0, scale: 1, x: 0, scaleX: 1, scaleY: 1 }
        }
        transition={
          trick === "roll"
            ? { duration: 1, ease: [0.45, 0.02, 0.2, 1] }
            : trick === "boost"
            ? { duration: 1.5, times: [0, 0.14, 0.36, 0.52, 0.76, 0.88, 1], ease: "easeInOut" }
            : trick === "dance"
            ? { duration: 4.3, ease: "easeInOut" }
            : { y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0 }, scale: { duration: 0.2 }, x: { duration: 0.2 } }
        }
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ transformOrigin: "center bottom" }}
        onMouseEnter={() => {
          setIsHovered(true);
          resetIdle();
          if (!isSleeping && emotion === "normal") setEmotion("curious");
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (emotion === "curious") setEmotion("normal");
        }}
        onClick={() => {
          resetIdle();
          setIsOpen(!isOpen);
          playDroidChirp("happy");
        }}
        data-cursor="view"
        title="Byte: Drag me around or click for tricks & trivia!"
      >
        {/* Ambient Pulsing Aura */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full bg-[var(--accent)]/20 blur-lg transition-opacity duration-300"
          style={{ opacity: isHovered || trick !== "idle" ? 0.9 : 0.4 }}
        />

        {/* Outer Droid Chassis */}
        <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--rule)] bg-[var(--surface-2)]/90 shadow-2xl backdrop-blur-xl ring-2 ring-white/10 transition-transform duration-200 ${trick === "idle" ? "hover:scale-110 active:scale-95" : ""}`}>
          {/* Accessory: Graduation Cap */}
          {accessory === "cap" && (
            <div className="absolute -top-5 z-20 flex flex-col items-center">
              <div className="h-2 w-8 bg-zinc-900 border border-zinc-700 rounded-xs shadow-md transform rotate-[-6deg]" />
              <div className="h-1.5 w-3.5 bg-zinc-950 -mt-0.5 rounded-b-xs" />
              <span className="h-2 w-0.5 bg-[var(--accent)] absolute -right-0.5 top-2" />
            </div>
          )}

          {/* Accessory: Crown */}
          {accessory === "crown" && (
            <div className="absolute -top-4 z-20 flex items-center justify-center text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Crown className="h-4 w-4 fill-amber-400" />
            </div>
          )}

          {/* Top Antenna Node */}
          {accessory !== "cap" && accessory !== "crown" && (
            <div className="absolute -top-3 flex flex-col items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              <span className="h-2 w-[1.5px] bg-[var(--rule)]" />
            </div>
          )}

          {/* OLED Visor Screen */}
          <div className="relative flex h-8 w-11 items-center justify-center overflow-hidden rounded-xl border border-black/40 bg-zinc-950/95 shadow-inner px-1.5">
            {/* Scanline pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_3px] opacity-60" />
            {trick === "dance" && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                animate={{
                  backgroundColor: ["#f472b655", "#fbbf2455", "#22d3ee55", "#c084fc55", "#f472b655"],
                }}
                transition={{ duration: 0.48, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Accessory: Sunglasses */}
            {accessory === "sunglasses" ? (
              <div className="flex items-center gap-1 z-10">
                <div className="h-2.5 w-4 rounded-xs bg-zinc-900 border border-white/30 shadow-xs" />
                <div className="h-[1px] w-1 bg-zinc-400" />
                <div className="h-2.5 w-4 rounded-xs bg-zinc-900 border border-white/30 shadow-xs" />
              </div>
            ) : emotion === "sleep" ? (
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent)] font-bold">
                <span>z</span>
                <span className="text-[12px]">Z</span>
                <span className="text-[14px]">z</span>
              </div>
            ) : emotion === "love" ? (
              <div className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400 animate-pulse" />
                <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400 animate-pulse" />
              </div>
            ) : emotion === "happy" ? (
              <div className="flex items-center gap-2 font-mono text-[12px] font-bold text-[var(--accent)]">
                <span>^</span>
                <span>^</span>
              </div>
            ) : emotion === "party" ? (
              <div className="flex items-center gap-2 font-mono text-[13px] font-bold text-pink-400 animate-bounce">
                <span>★</span>
                <span>★</span>
              </div>
            ) : emotion === "blink" ? (
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-2.5 rounded-full bg-[var(--accent)]" />
                <span className="h-[2px] w-2.5 rounded-full bg-[var(--accent)]" />
              </div>
            ) : (
              /* Normal & Curious Dynamic Tracking Eyes */
              <div className="flex items-center gap-2">
                <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)]/20">
                  <motion.span
                    animate={{ x: mouseOffset.x, y: mouseOffset.y }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`h-2 w-2 rounded-full ${visorColorClass}`}
                  />
                </div>
                <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)]/20">
                  <motion.span
                    animate={{ x: mouseOffset.x, y: mouseOffset.y }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`h-2 w-2 rounded-full ${visorColorClass}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tiny Cheeks Blush */}
          {(isHovered || emotion === "happy" || emotion === "love") && (
            <>
              <span className="absolute bottom-2 left-2.5 h-1 w-1.5 rounded-full bg-pink-400/80 shadow-[0_0_4px_#f472b6]" />
              <span className="absolute bottom-2 right-2.5 h-1 w-1.5 rounded-full bg-pink-400/80 shadow-[0_0_4px_#f472b6]" />
            </>
          )}

          {/* Bottom Jet Thruster Flame */}
          <div className="absolute -bottom-1.5 flex items-center justify-center">
            <span
              className={`rounded-full blur-[1px] transition-all ${
                trick === "boost"
                  ? "h-5 w-2 bg-amber-300 shadow-[0_0_14px_#fbbf24]"
                  : trick === "dance" || trick === "roll"
                  ? "h-2 w-3.5 bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                  : "h-1.5 w-3 bg-[var(--accent)]/70"
              }`}
            />
          </div>
        </div>

        {trick === "boost" && (
          <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.95, y: 0, x: (i - 2) * 3, scale: 1 }}
                animate={{ opacity: 0, y: 22 + i * 6, x: (i - 2) * 7, scale: 0.25 }}
                transition={{ duration: 0.38, delay: i * 0.04, repeat: 4, ease: "easeOut" }}
                className={`absolute h-1.5 w-1.5 rounded-full ${
                  i % 2 === 0 ? "bg-amber-300" : "bg-orange-400"
                }`}
              />
            ))}
          </div>
        )}

        {trick === "dance" && (
          <div className="pointer-events-none absolute -top-1 left-1/2">
            {[-14, -4, 8, 16].map((x, i) => (
              <motion.span
                key={x}
                initial={{ opacity: 0, y: 0, x, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -28 - i * 4,
                  x: x + (i % 2 === 0 ? 8 : -8),
                  rotate: [0, i % 2 === 0 ? 20 : -20],
                }}
                transition={{ duration: 0.85, delay: i * 0.16, repeat: 4 }}
                className={`absolute ${i % 2 === 0 ? "text-pink-400" : "text-amber-300"}`}
              >
                <Music className="h-3 w-3" />
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </motion.div>
  );
}

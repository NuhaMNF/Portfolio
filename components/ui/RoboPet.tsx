"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  Sparkles,
  Heart,
  X,
  Compass,
  Trophy,
  Copy,
  Zap,
  RotateCw,
  Flame,
  Music,
  GraduationCap,
  Glasses,
  Crown,
  CheckCircle2,
  XCircle,
  Crosshair,
  Volume2,
  Radio,
  Send,
} from "lucide-react";
import { profile } from "@/lib/data";
import {
  playDroidChirp,
  playLaserZap,
  playSpaceWarble,
  playPowerUp,
  playR2Trill,
  playCyberBass,
  playEightBitChime,
  playSelect,
  playSwitch,
} from "@/lib/sound";
import { BYTE_GREETING, BYTE_STARTER_CHIPS, replyToByte, type ByteAction } from "@/lib/byteChat";
import { copyEmailToClipboard } from "./ToastNotification";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

type EyeEmotion = "normal" | "happy" | "blink" | "curious" | "sleep" | "love" | "party" | "target";
type Accessory = "none" | "cap" | "sunglasses" | "crown";
type VisorColor = "amber" | "cyan" | "magenta" | "emerald" | "rainbow";
type DialogTab = "chat" | "commands" | "soundboard" | "tricks" | "trivia" | "wardrobe";

type ChatMsg = {
  id: string;
  from: "user" | "byte";
  text: string;
  chips?: string[];
};

interface ThrusterParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

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
  const [activeTab, setActiveTab] = useState<DialogTab>("chat");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "boot", from: "byte", text: BYTE_GREETING, chips: BYTE_STARTER_CHIPS },
  ]);
  const [draft, setDraft] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [emotion, setEmotion] = useState<EyeEmotion>("normal");
  const [accessory, setAccessory] = useState<Accessory>("none");
  const [visorColor, setVisorColor] = useState<VisorColor>("amber");
  const [petCount, setPetCount] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [tourEnabled, setTourEnabled] = useState(true);

  // Thruster Kinetic Particles
  const [particles, setParticles] = useState<ThrusterParticle[]>([]);
  const particleIdRef = useRef(0);

  // Laser Pointer State
  const [laserLock, setLaserLock] = useState<{
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);

  // Trick animations
  const [trickRotate, setTrickRotate] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isDancing, setIsDancing] = useState(false);

  // Trivia state
  const [triviaStep, setTriviaStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const droidRef = useRef<HTMLDivElement | null>(null);
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
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    };
  }, []);

  // Periodic blinking
  useEffect(() => {
    if (isSleeping || isDancing || emotion === "target") return;
    const interval = setInterval(() => {
      if (emotion === "normal") {
        setEmotion("blink");
        setTimeout(() => setEmotion("normal"), 180);
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [emotion, isSleeping, isDancing]);

  // Section exploration Tour tips
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

  useEffect(() => {
    if (!laserLock) return;
    let frame = 0;
    const sync = () => {
      const el = document.getElementById(laserLock.id);
      const droid = droidRef.current;
      if (el && droid) {
        const target = el.getBoundingClientRect();
        const origin = droid.getBoundingClientRect();
        setLaserLock((prev) =>
          prev
            ? {
                ...prev,
                from: { x: origin.left + origin.width / 2, y: origin.top + 8 },
                to: { x: target.left + target.width / 2, y: target.top + Math.min(48, target.height / 3) },
              }
            : prev,
        );
      }
      frame = requestAnimationFrame(sync);
    };
    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [laserLock?.id]);

  // Spawn kinetic particles when dragging Byte
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    resetIdle();
    const speed = Math.hypot(info.velocity.x, info.velocity.y);
    if (speed < 90) return;

    const angle = Math.atan2(info.velocity.y, info.velocity.x) + Math.PI;
    const count = speed > 900 ? 3 : 2;
    const colors = ["#f59e0b", "#fbbf24", "#fb923c", "#38bdf8", "#f472b6"];
    const spawned: ThrusterParticle[] = Array.from({ length: count }, (_, i) => {
      const spread = (Math.random() - 0.5) * 0.8;
      const mag = 12 + Math.random() * 18;
      return {
        id: particleIdRef.current++,
        x: Math.cos(angle + spread) * 4,
        y: 16 + Math.sin(angle + spread) * 4,
        vx: Math.cos(angle + spread) * mag,
        vy: Math.sin(angle + spread) * mag + 10,
        size: i === 0 ? 5 + Math.random() * 3 : 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]!,
      };
    });

    setParticles((prev) => [...prev.slice(-16), ...spawned]);
    spawned.forEach((p) => {
      window.setTimeout(() => {
        setParticles((prev) => prev.filter((item) => item.id !== p.id));
      }, 520);
    });
  };

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

  // Perform Trick: Barrel Roll
  const handleBarrelRoll = () => {
    playDroidChirp("trick");
    setEmotion("happy");
    setTrickRotate((prev) => prev + 360);
    setSpeech("Whoosh! 360° Barrel Roll! 🌀");
    setTimeout(() => setEmotion("normal"), 1200);
  };

  // Perform Trick: Jet Boost
  const handleJetBoost = () => {
    playDroidChirp("boost");
    setIsJumping(true);
    setEmotion("happy");
    setSpeech("Jet thrusters engaged! 🚀⚡");
    setTimeout(() => {
      setIsJumping(false);
      setEmotion("normal");
    }, 900);
  };

  // Perform Trick: Dance Party Mode
  const handleDance = () => {
    playDroidChirp("dance");
    setIsDancing(true);
    setEmotion("party");
    setSpeech("Let's dance! 💃🎵 *beep boop*");
    setTimeout(() => {
      setIsDancing(false);
      setEmotion("normal");
    }, 3200);
  };

  // Laser Pointer & Target Guide
  const handleLaserGuide = (targetId: string, label: string) => {
    const el = document.getElementById(targetId);
    const droid = droidRef.current;
    if (!el) return;

    if (targetId === "project-schema") {
      window.dispatchEvent(new Event("byte:aim-schema"));
    }

    playLaserZap();
    setEmotion("target");
    setSpeech(`Laser targeting: ${label}`);
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const rect = el.getBoundingClientRect();
    const origin = droid?.getBoundingClientRect();
    setLaserLock({
      id: targetId,
      from: origin
        ? { x: origin.left + origin.width / 2, y: origin.top + 8 }
        : { x: window.innerWidth - 40, y: window.innerHeight - 80 },
      to: { x: rect.left + rect.width / 2, y: rect.top + 36 },
    });

    window.setTimeout(() => {
      setLaserLock(null);
      setEmotion("happy");
      window.setTimeout(() => setEmotion("normal"), 1200);
    }, 2600);
  };

  const applyByteAction = (action?: ByteAction) => {
    if (!action) return;
    if (action.type === "scroll") {
      document.getElementById(action.id)?.scrollIntoView({ behavior: "smooth" });
    } else if (action.type === "copyEmail") {
      void copyEmailToClipboard(profile.email);
    } else if (action.type === "open") {
      window.open(action.url, "_blank", "noopener,noreferrer");
    } else if (action.type === "trick") {
      if (action.name === "roll") handleBarrelRoll();
      else if (action.name === "boost") handleJetBoost();
      else handleDance();
    } else if (action.type === "pet") {
      handlePet();
    } else if (action.type === "tour") {
      setTourEnabled(action.enabled);
    } else if (action.type === "laser") {
      handleLaserGuide(action.id, action.label);
    }
  };

  const speakByte = (reply: ReturnType<typeof replyToByte>) => {
    const id = `b-${Date.now()}`;
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setEmotion(reply.emotion === "curious" ? "curious" : reply.emotion);
    playDroidChirp(
      reply.emotion === "love" ? "love" : reply.emotion === "party" ? "dance" : "happy",
    );

    if (reduceMotion) {
      setMessages((m) => [...m, { id, from: "byte", text: reply.text, chips: reply.chips }]);
      applyByteAction(reply.action);
      setChatBusy(false);
      return;
    }

    setMessages((m) => [...m, { id, from: "byte", text: "", chips: reply.chips }]);
    let i = 0;
    const tick = () => {
      i += 1;
      setMessages((m) =>
        m.map((msg) => (msg.id === id ? { ...msg, text: reply.text.slice(0, i) } : msg)),
      );
      if (i < reply.text.length) {
        typeTimerRef.current = setTimeout(tick, 11);
      } else {
        applyByteAction(reply.action);
        setChatBusy(false);
      }
    };
    typeTimerRef.current = setTimeout(tick, 220);
  };

  const sendChat = (raw: string) => {
    const text = raw.trim();
    if (!text || chatBusy) return;
    resetIdle();
    setDraft("");
    setChatBusy(true);
    setActiveTab("chat");
    setIsOpen(true);
    setMessages((m) => [...m, { id: `u-${Date.now()}`, from: "user", text }]);
    speakByte(replyToByte(text));
  };

  useEffect(() => {
    const el = chatLogRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, chatBusy]);

  // Trivia answer submission
  const handleAnswerTrivia = (index: number) => {
    setSelectedAnswer(index);
    const q = TRIVIA_QUESTIONS[triviaStep];
    const isCorrect = index === q.correct;

    if (isCorrect) {
      setScore((s) => s + 1);
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

  // Visor color CSS classes
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

  const latestChips = chatBusy
    ? undefined
    : [...messages].reverse().find((m) => m.from === "byte" && m.chips?.length)?.chips;

  return (
    <>
      {/* Target Laser Beam Overlay */}
      {laserLock && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="byte-laser-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                <stop offset="55%" stopColor="#f87171" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <line
              x1={laserLock.from.x}
              y1={laserLock.from.y}
              x2={laserLock.to.x}
              y2={laserLock.to.y}
              stroke="url(#byte-laser-beam)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            style={{ left: laserLock.to.x - 24, top: laserLock.to.y - 24 }}
            className="absolute h-12 w-12 rounded-full border-2 border-red-400 bg-red-500/15 shadow-[0_0_22px_#ef4444]"
          >
            <div className="absolute inset-0 flex items-center justify-center text-red-400">
              <Crosshair className="h-6 w-6" />
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        ref={droidRef}
        drag
        dragMomentum={false}
        onDrag={handleDrag}
        className="fixed bottom-6 right-6 z-40 select-none font-sans"
      >
        {/* Kinetic Thruster Particle Trails */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.95, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.15, x: p.vx, y: p.vy }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(100% + ${p.y}px)`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
            className="pointer-events-none absolute rounded-full"
          />
        ))}

        {/* Speech & Interactive Master Console */}
        <AnimatePresence>
          {(isOpen || speech) && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="absolute bottom-20 right-0 w-[330px] max-w-[92vw] overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-white/15"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    Byte · Chat
                  </span>
                  <span className="rounded-full border border-[var(--rule-soft)] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                    local
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
                <div className="grid grid-cols-3 gap-1 border-b border-[var(--rule-soft)] py-2">
                  {(
                    [
                      ["chat", "Chat"],
                      ["commands", "Aim"],
                      ["soundboard", "Synth"],
                      ["tricks", "Tricks"],
                      ["trivia", "Trivia"],
                      ["wardrobe", "Style"],
                    ] as const
                  ).map(([id, label], i) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        playSelect(i + 1);
                        setActiveTab(id);
                      }}
                      className={`rounded-lg px-2 py-1.5 font-mono text-[10px] font-medium transition-colors ${
                        activeTab === id
                          ? "bg-[var(--surface-2)] text-[var(--accent)]"
                          : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {isOpen && activeTab !== "chat" && (
                <div className="my-3 text-[13px] leading-[1.6] text-[var(--fg)]">
                  {speech || "Ask Byte in Chat, or pick Aim / Synth / Tricks."}
                </div>
              )}
              {!isOpen && speech && (
                <div className="my-3 text-[13px] leading-[1.6] text-[var(--fg)]">{speech}</div>
              )}

              {activeTab === "chat" && isOpen && (
                <div className="mt-3 flex flex-col gap-2">
                  <div
                    ref={chatLogRef}
                    role="log"
                    aria-live="polite"
                    aria-label="Byte conversation"
                    className="flex max-h-[220px] flex-col gap-2 overflow-y-auto pr-0.5"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[92%] rounded-2xl px-3 py-2 text-[12.5px] leading-[1.55] ${
                          msg.from === "user"
                            ? "ml-auto rounded-br-md bg-[var(--accent)]/15 text-[var(--fg)]"
                            : "rounded-bl-md border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 text-[var(--fg)]"
                        }`}
                      >
                        {msg.text || (chatBusy && msg.from === "byte" ? "…" : "")}
                      </div>
                    ))}
                  </div>

                  {!chatBusy && latestChips && latestChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {latestChips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => sendChat(chip)}
                          data-cursor="view"
                          className="rounded-full border border-[var(--rule-soft)] bg-[var(--surface-2)]/50 px-2.5 py-1 font-mono text-[10px] text-[var(--fg-mute)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <form
                    className="flex items-center gap-1.5 border-t border-[var(--rule-soft)] pt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendChat(draft);
                    }}
                  >
                    <label htmlFor="byte-chat-input" className="sr-only">
                      Message Byte
                    </label>
                    <input
                      id="byte-chat-input"
                      type="text"
                      value={draft}
                      disabled={chatBusy}
                      autoComplete="off"
                      placeholder={chatBusy ? "Byte is typing…" : "Ask about Nuha…"}
                      onChange={(e) => setDraft(e.target.value)}
                      className="h-9 min-w-0 flex-1 rounded-xl border border-[var(--rule-soft)] bg-[var(--surface-2)]/60 px-3 font-sans text-[16px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)]/50 md:text-[13px]"
                    />
                    <button
                      type="submit"
                      disabled={chatBusy || !draft.trim()}
                      aria-label="Send message"
                      data-cursor="view"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--rule-soft)] bg-[var(--accent)]/15 text-[var(--accent)] transition-opacity disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 1: COMMANDS & LASER TARGETING */}
              {activeTab === "commands" && isOpen && (
                <div className="space-y-1.5 border-t border-[var(--rule-soft)] pt-3">
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)]">
                      // Laser Spotlight Targets
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLaserGuide("projects", "Task Management System")}
                      data-cursor="view"
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-[10.5px] text-[var(--fg-soft)] hover:text-[var(--fg)]"
                    >
                      <Crosshair className="h-3 w-3 text-red-400" />
                      <span>Aim Flagship</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaserGuide("project-schema", "PostgreSQL schema")}
                      data-cursor="view"
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-[10.5px] text-[var(--fg-soft)] hover:text-[var(--fg)]"
                    >
                      <Crosshair className="h-3 w-3 text-red-400" />
                      <span>Aim Schema</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaserGuide("contact", "Contact form")}
                      data-cursor="view"
                      className="btn-glass col-span-2 flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-[10.5px] text-[var(--fg-soft)] hover:text-[var(--fg)]"
                    >
                      <Crosshair className="h-3 w-3 text-red-400" />
                      <span>Aim Contact</span>
                    </button>
                  </div>

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

              {/* TAB 2: SCI-FI SOUNDBOARD & SYNTHESIZER */}
              {activeTab === "soundboard" && isOpen && (
                <div className="border-t border-[var(--rule-soft)] pt-3">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                    // Web Audio Sci-Fi Synthesizer
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        playLaserZap();
                        setEmotion("curious");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-red-400 hover:text-red-300"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Laser Zap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playSpaceWarble();
                        setEmotion("curious");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-purple-400 hover:text-purple-300"
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>Space Warble</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPowerUp();
                        setEmotion("happy");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-emerald-400 hover:text-emerald-300"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Power Up</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playR2Trill();
                        setEmotion("love");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sky-400 hover:text-sky-300"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>R2 Trill</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playEightBitChime();
                        setEmotion("happy");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-amber-300 hover:text-amber-200"
                    >
                      <Music className="h-3.5 w-3.5" />
                      <span>8-bit Chime</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playCyberBass();
                        setEmotion("party");
                      }}
                      className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-amber-400 hover:text-amber-300"
                    >
                      <Flame className="h-3.5 w-3.5" />
                      <span>Cyber Bass</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: TRICKS & ACTIONS */}
              {activeTab === "tricks" && isOpen && (
                <div className="grid grid-cols-2 gap-2 border-t border-[var(--rule-soft)] pt-3 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={handleBarrelRoll}
                    data-cursor="view"
                    className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[var(--fg-soft)] hover:text-[var(--fg)]"
                  >
                    <RotateCw className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>Barrel Roll</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleJetBoost}
                    data-cursor="view"
                    className="btn-glass flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[var(--fg-soft)] hover:text-[var(--fg)]"
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span>Jet Boost</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDance}
                    data-cursor="view"
                    className="btn-glass col-span-2 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[var(--fg-soft)] hover:text-[var(--fg)]"
                  >
                    <Music className="h-3.5 w-3.5 text-pink-400" />
                    <span>Dance Party Mode 🎵</span>
                  </button>
                </div>
              )}

              {/* TAB 4: TRIVIA QUIZ */}
              {activeTab === "trivia" && isOpen && (
                <div className="border-t border-[var(--rule-soft)] pt-3">
                  {!triviaFinished ? (
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)] uppercase mb-2">
                        <span>Question {triviaStep + 1} / {TRIVIA_QUESTIONS.length}</span>
                        <span className="text-[var(--accent)] font-bold">Score: {score}</span>
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
                        You answered {score} of {TRIVIA_QUESTIONS.length} correctly!
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

              {/* TAB 5: WARDROBE / STYLE */}
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
        <motion.div
          animate={{
            y: isJumping ? -35 : isHovered ? -8 : [-4, 4, -4],
            rotate: isDancing ? [-12, 12, -8, 8, 0] : trickRotate,
            scale: isDancing ? [1, 1.15, 0.95, 1.1, 1] : 1,
          }}
          transition={{
            y: isJumping ? { duration: 0.6, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: isDancing ? { duration: 0.6, repeat: 4 } : { duration: 0.8, ease: "easeInOut" },
            scale: isDancing ? { duration: 0.6, repeat: 4 } : { duration: 0.2 },
          }}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
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
            setIsOpen((open) => {
              if (!open) setActiveTab("chat");
              return !open;
            });
            playDroidChirp("happy");
          }}
          data-cursor="view"
          title="Byte: click to chat, or drag for thruster sparks"
        >
          {/* Ambient Pulsing Aura */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-full bg-[var(--accent)]/20 blur-lg transition-opacity duration-300"
            style={{ opacity: isHovered || isDancing ? 0.85 : 0.4 }}
          />

          {/* Outer Droid Chassis */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--rule)] bg-[var(--surface-2)]/90 shadow-2xl backdrop-blur-xl ring-2 ring-white/10 transition-transform duration-200 hover:scale-110 active:scale-95">
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

              {/* Accessory: Sunglasses */}
              {accessory === "sunglasses" ? (
                <div className="flex items-center gap-1 z-10">
                  <div className="h-2.5 w-4 rounded-xs bg-zinc-900 border border-white/30 shadow-xs" />
                  <div className="h-[1px] w-1 bg-zinc-400" />
                  <div className="h-2.5 w-4 rounded-xs bg-zinc-900 border border-white/30 shadow-xs" />
                </div>
              ) : emotion === "target" ? (
                <div className="flex items-center gap-1 text-red-500 font-mono text-[12px] font-bold animate-pulse">
                  <span>◎</span>
                  <span>◎</span>
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
                className={`h-1.5 w-3 rounded-full blur-xs transition-all ${
                  isJumping || isDancing
                    ? "bg-amber-400 scale-150 shadow-[0_0_8px_#f59e0b]"
                    : "bg-[var(--accent)]/70"
                }`}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

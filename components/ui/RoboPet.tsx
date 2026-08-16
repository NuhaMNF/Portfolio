"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Trophy, Copy, HelpCircle, X } from "lucide-react";
import { profile } from "@/lib/data";
import { playByteChirp } from "@/lib/sound";
import { copyEmailToClipboard } from "./ToastNotification";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type EyeEmotion = "normal" | "happy" | "blink" | "curious" | "sleep";
type CaptionKind = "greet" | "glance";
type Proximity = "far" | "near";

const GREET_KEY = "nuha-byte-met";
const GREET_LINE = "I can show you the work.";
const NEAR_PX = 140;

const LINES: Record<string, string> = {
  hero: "Nuha Nizar — Management & IT at Kelaniya. I can walk you through the work.",
  about: "The through-line is data, software, and how decisions get made.",
  skills: "Java, C++, React, Node, PostgreSQL. The tools she actually uses.",
  projects: "Flagship build: assign work, comment, and see what changed — React, Node, PostgreSQL.",
  education: "BSc (Hons) MIT, Department of Industrial Management, 2025–2028.",
  achievements: "Top 10 at Trinova — the 3D foot-scan pitch — and IdeaSprint.",
  contact: `Email is ${profile.email}. I can copy it for you.`,
};

const GLANCES: Record<string, string> = {
  projects: "Task system",
  achievements: "Top 10 at Trinova",
};

const FACTS = [
  "Studying Management & IT at the University of Kelaniya.",
  "Top 10 at Trinova (CINEC Campus) and IdeaSprint.",
  "The task system stores work in PostgreSQL, with a Node API in front.",
  "Press T to switch theme. Press B to switch grid and stars.",
  "Command palette: press ⌘K or Ctrl+K.",
];

export function RoboPet() {
  const reduced = useReducedMotion();
  const { id: sectionId } = useActiveSection();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState<CaptionKind | null>(null);
  const [emotion, setEmotion] = useState<EyeEmotion>("normal");
  const [full, setFull] = useState("");
  const [typed, setTyped] = useState("");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });
  const [idleLook, setIdleLook] = useState({ x: 0, y: 0 });
  const [proximity, setProximity] = useState<Proximity>("far");
  const [hovered, setHovered] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  const [waking, setWaking] = useState(false);
  const [glancesOn, setGlancesOn] = useState(false);
  const [compact, setCompact] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emotionRef = useRef(emotion);
  const lastGlance = useRef<string | null>(null);
  const charCount = useRef(0);
  const wakingLock = useRef(false);
  emotionRef.current = emotion;

  const closeAll = useCallback(() => {
    setOpen(false);
    setCaption(null);
  }, []);

  const pokeIdle = useCallback(() => {
    setSleeping(false);
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => {
      setSleeping(true);
      setEmotion("sleep");
      setOpen(false);
      setCaption(null);
    }, 50000);
  }, []);

  const speak = useCallback(
    (text: string, next: EyeEmotion = "happy") => {
      pokeIdle();
      setEmotion(next);
      setFull(text);
      charCount.current = 0;
      if (typeRef.current) clearTimeout(typeRef.current);
      if (reduced) {
        setTyped(text);
        return;
      }
      setTyped("");
      setTimeout(() => {
        if (emotionRef.current === next) setEmotion("normal");
      }, Math.min(2200, 700 + text.length * 18));
    },
    [pokeIdle, reduced]
  );

  const openPanel = useCallback(() => {
    setCaption(null);
    setOpen(true);
    playByteChirp("wake");
    speak(LINES[sectionId] || LINES.hero);
  }, [sectionId, speak]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (typed.length >= full.length) return;
    typeRef.current = setTimeout(() => {
      const next = full.slice(0, typed.length + 1);
      setTyped(next);
      const ch = full[typed.length];
      if (ch && ch !== " ") {
        charCount.current += 1;
        if (charCount.current % 4 === 0) playByteChirp("talk");
      }
    }, 22);
    return () => {
      if (typeRef.current) clearTimeout(typeRef.current);
    };
  }, [typed, full]);

  useEffect(() => {
    if (open || !caption || typed.length < full.length || !full) return;
    const hold = caption === "greet" ? 2400 : 2000;
    const t = window.setTimeout(() => setCaption(null), hold);
    return () => window.clearTimeout(t);
  }, [caption, typed, full, open]);

  useEffect(() => {
    pokeIdle();
    const onMove = (e: MouseEvent) => {
      const originX = window.innerWidth - 52;
      const originY = window.innerHeight - 72;
      const dx = e.clientX - originX;
      const dy = e.clientY - originY;
      const dist = Math.hypot(dx, dy);
      const near = dist < NEAR_PX;
      setProximity(near ? "near" : "far");
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(dist / 280, 1);
      const gain = near ? 1 : 0.38;
      setMouseOffset({
        x: Math.cos(angle) * 3.2 * intensity * gain,
        y: Math.sin(angle) * 3.2 * intensity * gain,
      });
      setHeadTilt({
        y: Math.max(-12, Math.min(12, dx / (near ? 30 : 72))),
        x: Math.max(-9, Math.min(9, -dy / (near ? 38 : 80))),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [pokeIdle]);

  useEffect(() => {
    if (sleeping || reduced || proximity === "near" || hovered || waking) return;
    const glance = () => {
      setIdleLook({
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 3.4,
      });
    };
    glance();
    const id = window.setInterval(glance, 4200);
    return () => window.clearInterval(id);
  }, [sleeping, reduced, proximity, hovered, waking]);

  useEffect(() => {
    if (sleeping || reduced) return;
    const interval = setInterval(() => {
      if (emotionRef.current !== "normal" && emotionRef.current !== "curious") return;
      setEmotion("blink");
      setTimeout(() => {
        if (emotionRef.current === "blink") setEmotion("normal");
      }, 140);
    }, 3800);
    return () => clearInterval(interval);
  }, [sleeping, reduced]);

  useEffect(() => {
    if (compact) {
      setGlancesOn(false);
      return;
    }
    let greetTimer = 0;
    let readyTimer = 0;
    try {
      const met = sessionStorage.getItem(GREET_KEY);
      if (!met) {
        greetTimer = window.setTimeout(() => {
          setCaption("greet");
          playByteChirp("wake");
          speak(GREET_LINE, "curious");
          sessionStorage.setItem(GREET_KEY, "1");
        }, 1100);
        readyTimer = window.setTimeout(() => setGlancesOn(true), 5600);
      } else {
        readyTimer = window.setTimeout(() => setGlancesOn(true), 500);
      }
    } catch {
      readyTimer = window.setTimeout(() => setGlancesOn(true), 500);
    }
    return () => {
      window.clearTimeout(greetTimer);
      window.clearTimeout(readyTimer);
    };
  }, [speak, compact]);

  useEffect(() => {
    if (compact || !glancesOn || open || sleeping || caption === "greet") return;
    const label = GLANCES[sectionId];
    if (!label) {
      lastGlance.current = sectionId;
      return;
    }
    if (lastGlance.current === sectionId) return;
    lastGlance.current = sectionId;
    setCaption("glance");
    playByteChirp("wake");
    speak(label, "curious");
  }, [sectionId, glancesOn, open, sleeping, caption, speak, compact]);

  useEffect(() => {
    if (!open && !caption) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, caption, closeAll]);

  useEffect(() => {
    return () => {
      if (wakeRef.current) clearTimeout(wakeRef.current);
    };
  }, []);

  const goTo = (id: string, message: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    playByteChirp("wake");
    speak(message);
  };

  const onByteClick = () => {
    pokeIdle();
    if (wakingLock.current) return;

    if (sleeping) {
      wakingLock.current = true;
      setWaking(true);
      setSleeping(false);
      setEmotion("blink");
      playByteChirp("wake");
      wakeRef.current = setTimeout(() => {
        setEmotion("curious");
        setWaking(false);
        wakingLock.current = false;
        openPanel();
      }, reduced ? 80 : 640);
      return;
    }

    if (open) {
      closeAll();
      return;
    }
    openPanel();
  };

  const tracking = proximity === "near" || hovered;
  const pupil = tracking ? mouseOffset : idleLook;
  const tilt = tracking
    ? headTilt
    : { x: idleLook.y * 1.5, y: idleLook.x * 1.8 };

  const visor = () => {
    if (emotion === "sleep" || (sleeping && !waking)) {
      return (
        <div className="flex items-center gap-2.5">
          <span className="h-[2px] w-3 rounded-full bg-[var(--accent)]/70" />
          <span className="h-[2px] w-3 rounded-full bg-[var(--accent)]/70" />
        </div>
      );
    }
    if (emotion === "happy") {
      return (
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2.5 rounded-t-full border-t-2 border-[var(--accent)] bg-transparent" />
          <span className="h-2 w-2.5 rounded-t-full border-t-2 border-[var(--accent)] bg-transparent" />
        </div>
      );
    }
    if (emotion === "blink") {
      return (
        <div className="flex items-center gap-2.5">
          <span className="h-[1.5px] w-3 rounded-full bg-[var(--accent)]" />
          <span className="h-[1.5px] w-3 rounded-full bg-[var(--accent)]" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]/30 ${
              emotion === "curious" ? "h-4 w-4" : ""
            }`}
          >
            <motion.span
              animate={{ x: pupil.x, y: pupil.y }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_7px_var(--accent)]"
            />
          </div>
        ))}
      </div>
    );
  };

  const showBubble = open || (Boolean(caption) && !compact);
  const greetingPose = caption === "greet" && !open;

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-3 z-40 select-none sm:right-6 md:bottom-7 lg:bottom-11"
    >
      <AnimatePresence>
        {showBubble && (
          <motion.div
            role={open ? "dialog" : "status"}
            aria-label="Byte companion"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`absolute right-0 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/95 shadow-2xl backdrop-blur-xl ${
              open
                ? "bottom-[72px] w-[min(280px,calc(100vw-1.5rem))] p-3.5 md:bottom-[92px]"
                : "bottom-[92px] max-w-[220px] px-3 py-2.5"
            }`}
          >
            {open ? (
              <>
                <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      Byte
                    </span>
                    <span className="font-mono text-[10px] text-[var(--fg-faint)]">companion</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Close Byte"
                    onClick={closeAll}
                    className="btn-glass flex h-6 w-6 items-center justify-center rounded-full text-[var(--fg-mute)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="my-3 min-h-[3.2em] text-[13px] leading-[1.6] text-[var(--fg-soft)]">
                  {typed}
                  {typed.length < full.length && (
                    <span className="ml-px inline-block h-3 w-[1.5px] translate-y-px bg-[var(--accent)]" />
                  )}
                </p>

                <div className="grid grid-cols-2 gap-1.5 border-t border-[var(--rule-soft)] pt-3">
                  <button
                    type="button"
                    onClick={() => goTo("projects", LINES.projects)}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 px-2.5 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    <Compass className="h-3.5 w-3.5 text-[var(--accent)]" />
                    Work
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("achievements", LINES.achievements)}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 px-2.5 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    <Trophy className="h-3.5 w-3.5 text-[var(--accent)]" />
                    Awards
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      copyEmailToClipboard(profile.email);
                      playByteChirp("copy");
                      speak(`Copied ${profile.email}.`);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 px-2.5 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    <Copy className="h-3.5 w-3.5 text-[var(--accent)]" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (factIndex + 1) % FACTS.length;
                      setFactIndex(next);
                      playByteChirp("wake");
                      speak(FACTS[next], "curious");
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--rule-soft)] bg-[var(--surface-2)]/70 px-2.5 py-2 text-left font-mono text-[11px] text-[var(--fg-soft)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-[var(--accent)]" />
                    Note
                  </button>
                </div>
              </>
            ) : (
              <p className="font-mono text-[12px] leading-[1.45] text-[var(--fg-soft)]">
                {typed}
                {typed.length < full.length && (
                  <span className="ml-px inline-block h-3 w-[1.5px] translate-y-px bg-[var(--accent)]" />
                )}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close Byte" : sleeping ? "Wake Byte" : "Open Byte, robotic companion"}
        aria-expanded={open}
        title="Byte"
        data-cursor="view"
        onMouseEnter={() => {
          setHovered(true);
          pokeIdle();
          if (!sleeping && emotion === "normal") setEmotion("curious");
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (emotion === "curious") setEmotion("normal");
        }}
        onClick={onByteClick}
        animate={
          reduced
            ? { y: 0, scaleY: 1 }
            : {
                y: waking ? -14 : greetingPose ? -8 : proximity === "near" ? -5 : sleeping ? 5 : 0,
                scaleY: waking ? 1.1 : 1,
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 280, damping: 22 }
        }
        className="relative flex origin-bottom items-end justify-center bg-transparent md:h-[88px] md:w-[72px] h-12 w-12"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1 hidden h-3 w-10 rounded-full bg-[var(--accent)]/25 blur-md md:block"
          style={{ opacity: sleeping ? 0.15 : hovered || greetingPose || proximity === "near" ? 0.7 : 0.35 }}
        />

        <div className="relative flex flex-col items-center">
          <motion.div
            animate={
              reduced || (sleeping && !waking)
                ? { rotateX: 0, rotateY: 0 }
                : { rotateX: tilt.x, rotateY: tilt.y }
            }
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            style={{ transformPerspective: 420 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="mb-0.5 hidden flex-col items-center md:flex">
              <span
                className={`rounded-full ${
                  sleeping && !waking
                    ? "h-1.5 w-1.5 bg-[var(--fg-faint)]"
                    : "h-1.5 w-1.5 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                }`}
              />
              <span className={`w-px bg-[var(--fg-mute)]/50 ${waking ? "h-4" : "h-2.5"}`} />
            </div>

            <div className="relative flex h-9 w-10 items-center justify-center rounded-[16px] border border-[var(--rule)] bg-[var(--surface-2)] shadow-lg ring-1 ring-white/10 md:h-11 md:w-[52px] md:rounded-[18px]">
              <span className="absolute left-1 top-2 hidden h-1.5 w-1 rounded-full bg-[var(--accent)]/35 md:block" />
              <span className="absolute right-1 top-2 hidden h-1.5 w-1 rounded-full bg-[var(--accent)]/35 md:block" />
              <div className="relative flex h-[22px] w-[32px] items-center justify-center overflow-hidden rounded-lg border border-black/50 bg-[#07080a] shadow-inner md:h-[26px] md:w-[38px]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "100% 3px",
                  }}
                />
                {visor()}
              </div>
            </div>
          </motion.div>

          <div className="-mt-0.5 hidden h-1.5 w-3 rounded-b-sm bg-[var(--surface-3)] ring-1 ring-[var(--rule)] md:block" />

          <div className="relative hidden h-8 w-[46px] items-center justify-center rounded-[14px] border border-[var(--rule)] bg-[var(--surface)] shadow-md ring-1 ring-white/10 md:flex">
            <span className="absolute left-0.5 top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-[var(--surface-3)]" />
            <span className="absolute right-0.5 top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-[var(--surface-3)]" />
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                sleeping && !waking ? "bg-[var(--fg-faint)]" : "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
              }`}
              style={{ animation: sleeping || reduced || waking ? undefined : "pulse 2.4s ease-in-out infinite" }}
            />
          </div>

          <span
            className={`mt-1 hidden h-1 w-4 rounded-full blur-[1px] md:block ${
              sleeping && !waking ? "bg-[var(--fg-ghost)]" : "bg-[var(--accent)]/80"
            }`}
          />
        </div>
      </motion.button>
    </div>
  );
}

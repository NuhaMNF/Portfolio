"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "nuha-sound-muted";
const EVENT_KEY = "nuha:sound-toggle";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: muted }));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_KEY, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_KEY, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useSound() {
  const [mounted, setMounted] = useState(false);
  const muted = useSyncExternalStore(subscribe, isSoundMuted, () => false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMuted = mounted ? muted : false;

  return {
    isMuted,
    toggleSound: () => {
      const next = !isMuted;
      setSoundMuted(next);
      if (!next) {
        // Play an affirmative chime when unmuted
        playTone(523.25, "sine", 0.08, 0.12);
        setTimeout(() => playTone(659.25, "sine", 0.08, 0.14), 60);
      }
    },
    playClick,
    playSwitch,
    playSelect,
    playNavigate,
    playModalOpen,
    playModalClose,
  };
}

/**
 * Procedural Audio Synthesizer (Web Audio API)
 */
function playTone(
  freq: number,
  type: OscillatorType = "sine",
  duration: number = 0.05,
  volume: number = 0.08,
  pitchDecay: boolean = false
) {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    if (pitchDecay) {
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

/**
 * Soft tactile mechanical click for buttons
 */
export function playClick() {
  playTone(800, "triangle", 0.035, 0.06, true);
}

/**
 * Harmonious dual-frequency glass chime for Theme / Background toggles
 */
export function playSwitch() {
  if (isSoundMuted()) return;
  playTone(440, "sine", 0.07, 0.08);
  setTimeout(() => playTone(880, "sine", 0.09, 0.06), 40);
}

/**
 * Chromatic crystal blip for Color Picker
 */
export function playSelect(hueMultiplier: number = 1) {
  if (isSoundMuted()) return;
  const baseFreq = 580 * (0.85 + (hueMultiplier % 5) * 0.15);
  playTone(baseFreq, "sine", 0.06, 0.08);
}

/**
 * Subterranean navigational thud / sweep
 */
export function playNavigate() {
  playTone(320, "sine", 0.05, 0.05, true);
}

/**
 * Resonant ascending glass chord on modal open
 */
export function playModalOpen() {
  if (isSoundMuted()) return;
  playTone(440, "sine", 0.12, 0.06);
  setTimeout(() => playTone(554.37, "sine", 0.12, 0.06), 35);
  setTimeout(() => playTone(659.25, "sine", 0.16, 0.07), 70);
}

/**
 * Soft descending reverse tone on modal close
 */
export function playModalClose() {
  if (isSoundMuted()) return;
  playTone(659.25, "sine", 0.08, 0.05);
  setTimeout(() => playTone(440, "sine", 0.1, 0.04), 40);
}

/** Short two-note chirps for Byte. Quiet on purpose. */
export function playByteChirp(kind: "wake" | "talk" | "copy") {
  if (isSoundMuted()) return;
  if (kind === "wake") {
    playTone(720, "sine", 0.05, 0.045);
    setTimeout(() => playTone(960, "sine", 0.07, 0.038), 42);
    return;
  }
  if (kind === "copy") {
    playTone(680, "sine", 0.05, 0.04);
    setTimeout(() => playTone(910, "sine", 0.08, 0.035), 48);
    return;
  }
  playTone(610 + Math.random() * 90, "triangle", 0.028, 0.028);
}

/** Expressive R2-D2 style Droid Chirps & Squeaks */
export function playDroidChirp(
  type: "happy" | "trick" | "boost" | "trivia_win" | "surprise" | "love" | "dance" | "dance_beat",
) {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (type === "happy") {
      playTone(587.33, "sine", 0.05, 0.06);
      setTimeout(() => playTone(783.99, "sine", 0.06, 0.07), 40);
      setTimeout(() => playTone(1046.5, "sine", 0.09, 0.08), 80);
    } else if (type === "trick") {
      playTone(280, "sine", 0.08, 0.04, true);
      setTimeout(() => playTone(523.25, "triangle", 0.06, 0.06), 60);
      setTimeout(() => playTone(784, "sine", 0.1, 0.07), 140);
      setTimeout(() => playTone(1046, "sine", 0.12, 0.05), 240);
    } else if (type === "boost") {
      playTone(110, "sine", 0.22, 0.06, true);
      setTimeout(() => playTone(196, "triangle", 0.14, 0.05, true), 80);
      setTimeout(() => playTone(392, "sine", 0.1, 0.06), 180);
      setTimeout(() => playTone(659, "sine", 0.12, 0.07), 280);
      setTimeout(() => playTone(880, "sine", 0.16, 0.06), 400);
    } else if (type === "trivia_win") {
      playTone(523.25, "triangle", 0.08, 0.08);
      setTimeout(() => playTone(659.25, "triangle", 0.08, 0.08), 70);
      setTimeout(() => playTone(783.99, "triangle", 0.08, 0.09), 140);
      setTimeout(() => playTone(1046.5, "sine", 0.22, 0.1), 210);
    } else if (type === "surprise") {
      playTone(900, "sine", 0.04, 0.06);
      setTimeout(() => playTone(1200, "sine", 0.05, 0.06), 30);
    } else if (type === "love") {
      playTone(659.25, "sine", 0.09, 0.07);
      setTimeout(() => playTone(880, "sine", 0.14, 0.08), 60);
    } else if (type === "dance") {
      playTone(440, "triangle", 0.04, 0.08);
      setTimeout(() => playTone(554.37, "triangle", 0.04, 0.08), 60);
      setTimeout(() => playTone(659.25, "triangle", 0.04, 0.08), 120);
      setTimeout(() => playTone(880, "sine", 0.08, 0.09), 180);
    } else if (type === "dance_beat") {
      playTone(330, "triangle", 0.035, 0.055);
      setTimeout(() => playTone(494, "sine", 0.04, 0.05), 70);
    }
  } catch {}
}

/** Sci-Fi Soundboard: Laser Zap */
export function playLaserZap() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch {}
}

/** Sci-Fi Soundboard: Space Warble */
export function playSpaceWarble() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 650;

    lfo.type = "sine";
    lfo.frequency.value = 18; // 18Hz vibrato

    lfoGain.gain.value = 180;
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start();
    osc.start();
    lfo.stop(ctx.currentTime + 0.28);
    osc.stop(ctx.currentTime + 0.28);
  } catch {}
}

/** Sci-Fi Soundboard: 8-Bit Power Up */
export function playPowerUp() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const notes = [220, 330, 440, 660, 880, 1320];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, "triangle", 0.05, 0.07);
      }, idx * 35);
    });
  } catch {}
}

/** Sci-Fi Soundboard: R2 Trill */
export function playR2Trill() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const pitches = [750, 1100, 950, 1350, 850, 1200, 1450];
    pitches.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, "sine", 0.04, 0.06);
      }, idx * 28);
    });
  } catch {}
}

/** Sci-Fi Soundboard: Cyber Bass Drop */
export function playCyberBass() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

/** Sci-Fi Soundboard: 8-bit chime */
export function playEightBitChime() {
  if (isSoundMuted()) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, "square", 0.07, 0.045), idx * 70);
  });
}

/** Celebratory Level Up Fanfare */
export function playLevelUpFanfare() {
  if (isSoundMuted()) return;
  const chords = [
    { freq: 523.25, time: 0 },
    { freq: 659.25, time: 80 },
    { freq: 783.99, time: 160 },
    { freq: 1046.5, time: 260 },
    { freq: 1318.5, time: 380 },
  ];
  chords.forEach(({ freq, time }) => {
    setTimeout(() => {
      playTone(freq, "triangle", 0.22, 0.09);
    }, time);
  });
}

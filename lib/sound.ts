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

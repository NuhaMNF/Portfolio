"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { isSoundMuted } from "./sound";

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  description: string;
  icon: string;
  bpm: number;
}

export const STATIONS: RadioStation[] = [
  {
    id: "neon-rain",
    name: "Neon Rain & Glass",
    genre: "Ambient Lo-Fi",
    description: "Soft generative raindrops with warm harmonic glass pads",
    icon: "🌧️",
    bpm: 65,
  },
  {
    id: "space-orbit",
    name: "Deep Space Orbit",
    genre: "Cosmic Drone",
    description: "Subterranean resonant synth drone with crystal celestial arpeggios",
    icon: "🌌",
    bpm: 54,
  },
  {
    id: "midnight-code",
    name: "Midnight Terminal",
    genre: "Synthwave Pulse",
    description: "Mellow analog bassline with rhythmic cyber pulses for deep focus",
    icon: "⚡",
    bpm: 78,
  },
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;
let activeIntervals: NodeJS.Timeout[] = [];
let noiseNodes: AudioNode[] = [];
let currentStationIndex = 0;
let isPlaying = false;
let radioVolume = 0.45;

const LISTENERS = new Set<() => void>();

function emitChange() {
  LISTENERS.forEach((l) => l());
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(radioVolume, audioCtx.currentTime);
      masterGain.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function clearActiveNodes() {
  activeIntervals.forEach((i) => clearInterval(i));
  activeIntervals = [];

  noiseNodes.forEach((node) => {
    try {
      if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
        (node as AudioScheduledSourceNode).stop();
      }
      node.disconnect();
    } catch {}
  });
  noiseNodes = [];
}

/** Synthesizes procedural rain noise with pink/brown filter */
function generateRainNoise(ctx: AudioContext, destination: AudioNode) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Brown noise integration
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(650, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.045, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start();
  noiseNodes.push(noise, filter, gain);
}

/** Plays a soft warm pad chord */
function playSynthChord(ctx: AudioContext, frequencies: number[], duration: number, destination: AudioNode) {
  frequencies.forEach((freq) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  });
}

/** Start playing selected procedural station */
function startStationPlayback(stationId: string) {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  clearActiveNodes();

  if (stationId === "neon-rain") {
    // 1. Procedural rain stream
    generateRainNoise(ctx, masterGain);

    // 2. Generative pentatonic chords: C maj7, A min7, F maj7, G sus4
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],   // Amin7
      [174.61, 261.63, 329.63, 392.0],  // Fmaj7
      [196.0, 261.63, 392.0, 440.0],    // Gsus4
    ];

    let chordIdx = 0;
    const playNext = () => {
      if (!isPlaying) return;
      playSynthChord(ctx, chords[chordIdx % chords.length], 4.8, masterGain!);
      chordIdx++;
    };

    playNext();
    const interval = setInterval(playNext, 4600);
    activeIntervals.push(interval);
  } else if (stationId === "space-orbit") {
    // Deep Space Orbit: Continuous resonant sub-drone
    try {
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "sine";
      droneOsc.frequency.setValueAtTime(65.41, ctx.currentTime); // Low C2

      droneGain.gain.setValueAtTime(0.065, ctx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();
      noiseNodes.push(droneOsc, droneGain);
    } catch {}

    // Celestial crystal arpeggios
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    const playArp = () => {
      if (!isPlaying) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      try {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        osc.connect(g);
        g.connect(masterGain!);
        osc.start();
        osc.stop(ctx.currentTime + 2.2);
      } catch {}
    };

    const interval = setInterval(playArp, 1200);
    activeIntervals.push(interval);
  } else if (stationId === "midnight-code") {
    // Synthwave pulse bassline
    const bassline = [110.0, 110.0, 130.81, 146.83, 98.0, 98.0, 110.0, 123.47];
    let noteIdx = 0;

    const playBassNote = () => {
      if (!isPlaying) return;
      const freq = bassline[noteIdx % bassline.length];
      noteIdx++;

      try {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain!);

        osc.start();
        osc.stop(ctx.currentTime + 0.48);
      } catch {}
    };

    const interval = setInterval(playBassNote, 420);
    activeIntervals.push(interval);
  }
}

export function toggleRadioPlayback() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (isPlaying) {
    clearActiveNodes();
    isPlaying = false;
  } else {
    isPlaying = true;
    startStationPlayback(STATIONS[currentStationIndex].id);
  }
  emitChange();
}

export function setRadioStation(index: number) {
  currentStationIndex = index % STATIONS.length;
  if (isPlaying) {
    startStationPlayback(STATIONS[currentStationIndex].id);
  }
  emitChange();
}

export function nextRadioStation() {
  setRadioStation(currentStationIndex + 1);
}

export function getAudioVisualizerData(): Uint8Array {
  if (!analyserNode || !isPlaying) {
    return new Uint8Array(16);
  }
  const data = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(data);
  return data;
}

function subscribe(callback: () => void) {
  LISTENERS.add(callback);
  return () => {
    LISTENERS.delete(callback);
  };
}

export function useCyberRadio() {
  const [snapshot, setSnapshot] = useState({
    isPlaying,
    currentStationIndex,
    station: STATIONS[currentStationIndex],
  });

  useEffect(() => {
    const unsub = subscribe(() => {
      setSnapshot({
        isPlaying,
        currentStationIndex,
        station: STATIONS[currentStationIndex],
      });
    });
    return unsub;
  }, []);

  return {
    ...snapshot,
    stations: STATIONS,
    togglePlay: toggleRadioPlayback,
    setStation: setRadioStation,
    nextStation: nextRadioStation,
  };
}

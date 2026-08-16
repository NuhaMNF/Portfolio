"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Radio, Volume2, Sparkles, X } from "lucide-react";
import { useCyberRadio, getAudioVisualizerData } from "@/lib/radioAudio";
import { playSelect } from "@/lib/sound";
import { showToast } from "./ToastNotification";

export function CyberRadio() {
  const { isPlaying, station, stations, currentStationIndex, togglePlay, nextStation, setStation } =
    useCyberRadio();
  const [isOpen, setIsOpen] = useState(false);
  const [bars, setBars] = useState<number[]>([4, 8, 12, 6, 14, 8, 10, 4]);

  // Real-time audio spectrum animation loop
  useEffect(() => {
    let animId: number;

    const updateVisualizer = () => {
      if (isPlaying) {
        const data = getAudioVisualizerData();
        // Sample 8 frequency bands
        const newBars = [
          Math.max(4, Math.min(22, (data[2] || 0) / 10)),
          Math.max(4, Math.min(26, (data[4] || 0) / 9)),
          Math.max(4, Math.min(28, (data[6] || 0) / 8)),
          Math.max(4, Math.min(30, (data[8] || 0) / 8)),
          Math.max(4, Math.min(28, (data[10] || 0) / 8)),
          Math.max(4, Math.min(24, (data[12] || 0) / 9)),
          Math.max(4, Math.min(20, (data[14] || 0) / 10)),
          Math.max(4, Math.min(16, (data[16] || 0) / 12)),
        ];
        setBars(newBars);
      } else {
        setBars([4, 6, 5, 4, 6, 5, 4, 3]);
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleToggle = () => {
    togglePlay();
    playSelect(2);
    if (!isPlaying) {
      showToast("Cyber Radio Started 📻", `${station.name} (${station.genre})`, "sparkle");
    }
  };

  return (
    <div className="relative font-sans">
      {/* Mini Radio Button in Header / Dock */}
      <button
        type="button"
        onClick={() => {
          playSelect(1);
          setIsOpen(!isOpen);
        }}
        data-cursor="view"
        className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-[11.5px] transition-all shadow-xs ${
          isPlaying
            ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--fg)] ring-1 ring-[var(--accent)]/30"
            : "border-[var(--rule)] bg-[var(--surface)] text-[var(--fg-mute)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
        }`}
        title="Cyber-Radio: Procedural Ambient Focus Engine"
      >
        <Radio className={`h-3.5 w-3.5 ${isPlaying ? "text-[var(--accent)] animate-pulse" : "text-[var(--fg-faint)]"}`} />
        <span className="hidden sm:inline font-medium">Cyber Radio</span>

        {/* Real-time Equalizer Waveform */}
        <div className="flex h-3.5 items-end gap-[1.5px] px-0.5">
          {bars.slice(0, 4).map((h, i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full transition-all duration-75 ${
                isPlaying ? "bg-[var(--accent)]" : "bg-[var(--fg-faint)]"
              }`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </button>

      {/* Expandable Radio Deck Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 z-[120] w-[280px] overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[14px]">{station.icon}</span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                    Procedural Radio
                  </div>
                  <div className="font-medium text-[13px] text-[var(--fg)] truncate max-w-[170px]">
                    {station.name}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-glass flex h-6 w-6 items-center justify-center rounded-full text-[var(--fg-mute)] hover:text-[var(--fg)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Visualizer Spectrum Display */}
            <div className="my-3 flex h-12 items-end justify-center gap-1.5 rounded-xl border border-[var(--rule-soft)] bg-black/60 px-4 py-2">
              {bars.map((h, idx) => (
                <span
                  key={idx}
                  className="w-2 rounded-t-xs bg-gradient-to-t from-[var(--accent)]/50 to-[var(--accent)] shadow-[0_0_8px_var(--accent)] transition-all duration-75"
                  style={{ height: `${h * 1.3}px` }}
                />
              ))}
            </div>

            <p className="text-[11.5px] leading-[1.5] text-[var(--fg-soft)] mb-3">
              {station.description}
            </p>

            {/* Player Controls */}
            <div className="flex items-center justify-between border-t border-[var(--rule-soft)] pt-3">
              <button
                type="button"
                onClick={handleToggle}
                data-cursor="run"
                className="btn-glass btn-glass--accent inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-2 font-mono text-[12px] shadow-xs mr-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Play Ambient</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playSelect(3);
                  nextStation();
                }}
                data-cursor="view"
                title="Next Station"
                className="btn-glass flex h-9 w-9 items-center justify-center rounded-xl text-[var(--fg-mute)] hover:text-[var(--fg)]"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Station Selector Pills */}
            <div className="mt-3 space-y-1 border-t border-[var(--rule-soft)] pt-2.5">
              <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--fg-faint)] mb-1">
                // Stations (100% Code Synthesized)
              </div>
              {stations.map((st, idx) => {
                const isSel = currentStationIndex === idx;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      playSelect(idx + 1);
                      setStation(idx);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-left transition-colors ${
                      isSel
                        ? "bg-[var(--surface-2)] text-[var(--accent)] font-semibold"
                        : "text-[var(--fg-mute)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{st.icon}</span>
                      <span>{st.name}</span>
                    </span>
                    <span className="text-[9.5px] text-[var(--fg-faint)]">{st.genre}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

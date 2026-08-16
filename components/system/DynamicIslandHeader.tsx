"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Boxes,
  Sparkles,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Play,
  Pause,
  SkipForward,
  X,
  Check,
} from "lucide-react";
import { useCyberRadio, getAudioVisualizerData } from "@/lib/radioAudio";
import { useBackgroundMode } from "@/lib/backgroundMode";
import { useKeyGradient } from "@/lib/keyGradients";
import { useSound, isSoundMuted, setSoundMuted, playSelect, playSwitch } from "@/lib/sound";
import { useTheme } from "@/lib/hooks/useTheme";
import { toggleStoredTheme } from "@/lib/theme";
import { showToast } from "@/components/ui/ToastNotification";

export function DynamicIslandHeader() {
  const { isPlaying, station, stations, currentStationIndex, togglePlay, nextStation, setStation } =
    useCyberRadio();
  const { mode, setMode } = useBackgroundMode();
  const { currentId, setGradient, presets, preset: activePreset } = useKeyGradient();
  const { isMuted, toggleSound } = useSound();
  const theme = useTheme();
  const isLight = theme === "light";

  const [expandedRadio, setExpandedRadio] = useState(false);
  const [bars, setBars] = useState<number[]>([4, 6, 8, 5]);

  // Audio spectrum visualizer loop
  useEffect(() => {
    let animId: number;
    const update = () => {
      if (isPlaying) {
        const data = getAudioVisualizerData();
        setBars([
          Math.max(3, Math.min(14, (data[2] || 0) / 16)),
          Math.max(3, Math.min(18, (data[5] || 0) / 13)),
          Math.max(3, Math.min(16, (data[8] || 0) / 14)),
          Math.max(3, Math.min(12, (data[11] || 0) / 18)),
        ]);
      } else {
        setBars([3, 4, 3, 2]);
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 lg:left-[calc(50%+148px)] z-50 select-none max-w-[95vw]">
      {/* Outer Liquid Glass Translucent Capsule */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className={`relative flex items-center gap-1.5 sm:gap-2.5 rounded-full px-3 py-1.5 transition-all duration-300 backdrop-blur-2xl backdrop-saturate-150 ${
          isLight
            ? "bg-white/45 text-zinc-800 border border-white/70 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95)] ring-1 ring-black/5"
            : "bg-black/40 text-zinc-200 border border-white/15 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.2)] ring-1 ring-white/10"
        }`}
      >
        {/* Ambient Top Specular Sheen */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/${
            isLight ? "80" : "40"
          } to-transparent`}
        />

        {/* ========================================================= */}
        {/* 1. CYBER RADIO MODULE (Live Equalizer & Station Popover)  */}
        {/* ========================================================= */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => {
              playSelect(1);
              setExpandedRadio(!expandedRadio);
            }}
            data-cursor="view"
            className={`flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors ${
              isLight
                ? "text-zinc-800 hover:text-black"
                : "text-zinc-300 hover:text-white"
            }`}
            title="Cyber-Radio: Ambient Lo-Fi Player (R)"
          >
            <Radio
              className={`h-3.5 w-3.5 transition-colors ${
                isPlaying ? "text-[var(--accent)] animate-pulse" : isLight ? "text-zinc-500" : "text-zinc-400"
              }`}
            />
            <span className="hidden xl:inline font-mono text-[11px] font-medium tracking-wide">
              {isPlaying ? station.name : "Radio"}
            </span>

            {/* Live Frequency Waveform */}
            <div className="flex h-3.5 items-end gap-[1.5px] px-0.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] rounded-full transition-all duration-75 ${
                    isPlaying ? "bg-[var(--accent)]" : isLight ? "bg-zinc-400" : "bg-zinc-500"
                  }`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </button>

          {/* Expandable Radio Liquid Glass Control Deck */}
          <AnimatePresence>
            {expandedRadio && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={`absolute right-0 top-12 z-50 w-[270px] overflow-hidden rounded-2xl p-4 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl transition-all ${
                  isLight
                    ? "bg-white/70 border border-white/80 text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)]"
                    : "bg-black/75 border border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-white/10"
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-2.5 ${isLight ? "border-zinc-200/70" : "border-white/10"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">{station.icon}</span>
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                        Procedural Ambient
                      </div>
                      <div className="text-[13px] font-medium truncate max-w-[160px]">
                        {station.name}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedRadio(false)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      isLight ? "text-zinc-500 hover:text-zinc-900" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="my-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      togglePlay();
                      playSelect(2);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2 font-mono text-[12px] font-bold text-zinc-950 shadow-sm transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    <span>{isPlaying ? "Pause Ambient" : "Play Ambient"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSelect(3);
                      nextStation();
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      isLight
                        ? "border-white/80 bg-white/60 text-zinc-700 hover:text-zinc-950 shadow-xs"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                    }`}
                    title="Next Station"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                {/* Stations List */}
                <div className={`space-y-1 border-t pt-2.5 font-mono text-[11px] ${isLight ? "border-zinc-200/70" : "border-white/10"}`}>
                  {stations.map((st, idx) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        playSelect(idx + 1);
                        setStation(idx);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                        currentStationIndex === idx
                          ? isLight
                            ? "bg-white/80 text-[var(--accent)] font-semibold shadow-xs"
                            : "bg-white/10 text-[var(--accent)] font-semibold"
                          : isLight
                          ? "text-zinc-700 hover:bg-white/50 hover:text-black"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{st.icon}</span>
                        <span>{st.name}</span>
                      </span>
                      <span className={`text-[9.5px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{st.genre}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator Line */}
        <span className={`h-3.5 w-[1px] ${isLight ? "bg-black/10" : "bg-white/15"}`} aria-hidden />

        {/* ========================================================= */}
        {/* 2. 3D BACKGROUND TOGGLE (Grid vs Stars)                   */}
        {/* ========================================================= */}
        <div className={`hidden sm:flex items-center gap-1 rounded-full p-0.5 border font-mono text-[10.5px] backdrop-blur-md ${
          isLight
            ? "bg-white/40 border-white/60 shadow-inner"
            : "bg-white/5 border-white/10 shadow-inner"
        }`}>
          <button
            type="button"
            onClick={() => {
              if (mode !== "boxes") playSwitch();
              setMode("boxes");
            }}
            data-cursor="view"
            className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
              mode === "boxes"
                ? isLight ? "text-zinc-950" : "text-white"
                : isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {mode === "boxes" && (
              <motion.div
                layoutId="island-bg-mode"
                className={`absolute inset-0 rounded-full border shadow-xs ${
                  isLight
                    ? "bg-white/90 border-white shadow-xs"
                    : "bg-white/15 border-white/20"
                }`}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <Boxes className="relative z-10 h-3 w-3 text-[var(--accent)]" />
            <span className="relative z-10 uppercase tracking-wider">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (mode !== "stars") playSwitch();
              setMode("stars");
            }}
            data-cursor="view"
            className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors ${
              mode === "stars"
                ? isLight ? "text-zinc-950" : "text-white"
                : isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {mode === "stars" && (
              <motion.div
                layoutId="island-bg-mode"
                className={`absolute inset-0 rounded-full border shadow-xs ${
                  isLight
                    ? "bg-white/90 border-white shadow-xs"
                    : "bg-white/15 border-white/20"
                }`}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <Sparkles className="relative z-10 h-3 w-3 text-[var(--accent)]" />
            <span className="relative z-10 uppercase tracking-wider">Stars</span>
          </button>
        </div>

        {/* Separator Line */}
        <span className={`hidden sm:inline h-3.5 w-[1px] ${isLight ? "bg-black/10" : "bg-white/15"}`} aria-hidden />

        {/* ========================================================= */}
        {/* 3. KEY GLOW SPECTRUM PRESETS (5 Color Swatches)           */}
        {/* ========================================================= */}
        <div className="hidden md:flex items-center gap-1.5 px-1">
          <span className={`font-mono text-[9px] uppercase tracking-wider mr-0.5 ${
            isLight ? "text-zinc-600" : "text-zinc-400"
          }`}>
            Glow
          </span>
          <div className="flex items-center gap-1.5">
            {presets.map((p, idx) => {
              const isSelected = p.id === currentId;
              return (
                <button
                  key={p.id}
                  type="button"
                  data-cursor="run"
                  onClick={() => {
                    playSelect(idx);
                    setGradient(p.id);
                  }}
                  title={`${p.name} · ${p.tag}`}
                  className="group relative flex h-4 w-4 items-center justify-center rounded-full transition-transform hover:scale-125 focus:outline-hidden"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="island-active-glow"
                      className="absolute -inset-0.5 rounded-full border border-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span
                    style={{ background: p.preview }}
                    className={`relative block h-full w-full rounded-full border border-black/20 transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                    }`}
                  />
                  {isSelected && (
                    <Check className="absolute h-2 w-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator Line */}
        <span className={`hidden md:inline h-3.5 w-[1px] ${isLight ? "bg-black/10" : "bg-white/15"}`} aria-hidden />

        {/* ========================================================= */}
        {/* 4. AUDIO MUTE TOGGLE (Tactile Sound Feedback)             */}
        {/* ========================================================= */}
        <button
          type="button"
          onClick={() => {
            toggleSound();
            showToast(isMuted ? "Sound Unmuted 🔊" : "Sound Muted 🔇", "Micro-audio effects toggle", "sparkle");
          }}
          data-cursor="view"
          title={isMuted ? "Unmute sound effects (M)" : "Mute sound effects (M)"}
          className={`flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10.5px] transition-colors ${
            isMuted
              ? isLight ? "text-zinc-500 hover:text-zinc-800" : "text-zinc-500 hover:text-zinc-300"
              : isLight ? "text-zinc-800 hover:text-black" : "text-zinc-200 hover:text-white"
          }`}
        >
          {isMuted ? (
            <VolumeX className={`h-3.5 w-3.5 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-[var(--accent)]" />
          )}
          <span className="hidden lg:inline uppercase tracking-wider">
            {isMuted ? "Muted" : "Audio"}
          </span>
        </button>

        {/* Separator Line */}
        <span className={`h-3.5 w-[1px] ${isLight ? "bg-black/10" : "bg-white/15"}`} aria-hidden />

        {/* ========================================================= */}
        {/* 5. THEME TOGGLE (Dark / Light Switch)                     */}
        {/* ========================================================= */}
        <button
          type="button"
          onClick={() => {
            playSwitch();
            toggleStoredTheme();
          }}
          data-cursor="view"
          title={`Switch to ${isLight ? "dark" : "light"} mode (T)`}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border font-mono text-[10.5px] transition-all backdrop-blur-md ${
            isLight
              ? "bg-white/60 border-white/80 text-zinc-900 hover:bg-white/90 shadow-xs"
              : "bg-white/10 border-white/15 text-zinc-200 hover:bg-white/20"
          }`}
        >
          {isLight ? (
            <>
              <Sun className="h-3 w-3 text-amber-500" />
              <span className="uppercase tracking-wider font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-3 w-3 text-amber-400" />
              <span className="uppercase tracking-wider font-medium">Dark</span>
            </>
          )}
          <span className={`text-[9px] ml-0.5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>[T]</span>
        </button>
      </motion.div>
    </header>
  );
}

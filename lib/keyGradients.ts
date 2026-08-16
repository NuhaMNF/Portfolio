"use client";

import { useEffect, useState } from "react";

export interface KeyGradientPreset {
  id: string;
  name: string;
  tag: string;
  description: string;
  preview: string;
  dark: {
    left: string;
    mid: string;
    right: string;
    glowCore: string;
    glowMid: string;
    glowEdge: string;
    sphere: string;
  };
  light: {
    left: string;
    mid: string;
    right: string;
    glowCore: string;
    glowMid: string;
    glowEdge: string;
    sphere: string;
  };
}

export const KEY_GRADIENTS: KeyGradientPreset[] = [
  {
    id: "aurora",
    name: "Cosmic Aurora",
    tag: "violet · rose",
    description: "Electric sapphire, fuchsia, and radiant rose",
    preview: "linear-gradient(135deg, #4f7dff, #c026d3, #fb7185)",
    dark: {
      left: "#4f7dff",
      mid: "#c026d3",
      right: "#fb7185",
      glowCore: "rgba(240, 171, 252, 0.95)",
      glowMid: "rgba(232, 121, 249, 0.4)",
      glowEdge: "rgba(168, 85, 247, 0)",
      sphere: "#f5d0fe",
    },
    light: {
      left: "#3d6ae8",
      mid: "#7c4db8",
      right: "#c45a6a",
      glowCore: "rgba(90, 130, 230, 0.85)",
      glowMid: "rgba(124, 77, 184, 0.35)",
      glowEdge: "rgba(196, 90, 106, 0)",
      sphere: "#5b7ce8",
    },
  },
  {
    id: "amber",
    name: "Solar Amber",
    tag: "gold · ember",
    description: "Computational amber, warm flame, and terracotta",
    preview: "linear-gradient(135deg, #f59e0b, #ea580c, #e11d48)",
    dark: {
      left: "#f59e0b",
      mid: "#ea580c",
      right: "#e11d48",
      glowCore: "rgba(254, 215, 170, 0.95)",
      glowMid: "rgba(249, 115, 22, 0.45)",
      glowEdge: "rgba(225, 29, 72, 0)",
      sphere: "#fef08a",
    },
    light: {
      left: "#d97706",
      mid: "#c2410c",
      right: "#b91c1c",
      glowCore: "rgba(217, 119, 6, 0.85)",
      glowMid: "rgba(194, 65, 12, 0.35)",
      glowEdge: "rgba(185, 28, 28, 0)",
      sphere: "#d97706",
    },
  },
  {
    id: "emerald",
    name: "Cyber Matrix",
    tag: "cyan · emerald",
    description: "Bioluminescent cyan, matrix emerald, and laser lime",
    preview: "linear-gradient(135deg, #06b6d4, #10b981, #84cc16)",
    dark: {
      left: "#06b6d4",
      mid: "#10b981",
      right: "#84cc16",
      glowCore: "rgba(167, 243, 208, 0.95)",
      glowMid: "rgba(16, 185, 129, 0.45)",
      glowEdge: "rgba(132, 204, 22, 0)",
      sphere: "#a7f3d0",
    },
    light: {
      left: "#0891b2",
      mid: "#059669",
      right: "#65a30d",
      glowCore: "rgba(8, 145, 178, 0.85)",
      glowMid: "rgba(5, 150, 105, 0.35)",
      glowEdge: "rgba(101, 163, 13, 0)",
      sphere: "#0891b2",
    },
  },
  {
    id: "synthwave",
    name: "Electric Violet",
    tag: "indigo · magenta",
    description: "Deep laser indigo, ultraviolet, and hot magenta",
    preview: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
    dark: {
      left: "#6366f1",
      mid: "#8b5cf6",
      right: "#ec4899",
      glowCore: "rgba(233, 213, 255, 0.95)",
      glowMid: "rgba(168, 85, 247, 0.45)",
      glowEdge: "rgba(236, 72, 153, 0)",
      sphere: "#e9d5ff",
    },
    light: {
      left: "#4f46e5",
      mid: "#7c3aed",
      right: "#db2777",
      glowCore: "rgba(79, 70, 229, 0.85)",
      glowMid: "rgba(124, 58, 237, 0.35)",
      glowEdge: "rgba(219, 39, 119, 0)",
      sphere: "#4f46e5",
    },
  },
  {
    id: "quantum",
    name: "Quantum Silver",
    tag: "ice · obsidian",
    description: "Cryo cyan, platinum slate, and pure luminescence",
    preview: "linear-gradient(135deg, #38bdf8, #94a3b8, #f8fafc)",
    dark: {
      left: "#38bdf8",
      mid: "#94a3b8",
      right: "#f8fafc",
      glowCore: "rgba(241, 245, 249, 0.95)",
      glowMid: "rgba(148, 163, 184, 0.45)",
      glowEdge: "rgba(56, 189, 248, 0)",
      sphere: "#ffffff",
    },
    light: {
      left: "#0284c7",
      mid: "#475569",
      right: "#0f172a",
      glowCore: "rgba(2, 132, 199, 0.85)",
      glowMid: "rgba(71, 85, 105, 0.35)",
      glowEdge: "rgba(15, 23, 42, 0)",
      sphere: "#0284c7",
    },
  },
];

export const KEY_GRADIENT_KEY = "nuha-key-gradient";

export function getStoredKeyGradient(): string {
  if (typeof window === "undefined") return KEY_GRADIENTS[0].id;
  return window.localStorage.getItem(KEY_GRADIENT_KEY) || KEY_GRADIENTS[0].id;
}

export function setKeyGradient(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_GRADIENT_KEY, id);
  window.dispatchEvent(new CustomEvent("nuha:key-gradient", { detail: id }));
}

export function useKeyGradient(): {
  currentId: string;
  preset: KeyGradientPreset;
  setGradient: (id: string) => void;
  presets: KeyGradientPreset[];
} {
  const [currentId, setCurrentId] = useState<string>(KEY_GRADIENTS[0].id);

  useEffect(() => {
    setCurrentId(getStoredKeyGradient());

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCurrentId(detail);
      else setCurrentId(getStoredKeyGradient());
    };

    window.addEventListener("nuha:key-gradient", onCustom);
    window.addEventListener("storage", (e) => {
      if (e.key === KEY_GRADIENT_KEY) setCurrentId(getStoredKeyGradient());
    });

    return () => {
      window.removeEventListener("nuha:key-gradient", onCustom);
    };
  }, []);

  const preset =
    KEY_GRADIENTS.find((p) => p.id === currentId) || KEY_GRADIENTS[0];

  return {
    currentId,
    preset,
    setGradient: setKeyGradient,
    presets: KEY_GRADIENTS,
  };
}

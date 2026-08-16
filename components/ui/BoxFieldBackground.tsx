"use client";

import dynamic from "next/dynamic";
import { useBackgroundMode } from "@/lib/backgroundMode";

const BoxFieldCanvas = dynamic(
  () => import("@/components/ui/BoxField3D").then((m) => m.BoxFieldCanvas),
  { ssr: false, loading: () => null }
);

const StarFieldCanvas = dynamic(
  () => import("@/components/ui/StarField3D").then((m) => m.StarFieldCanvas),
  { ssr: false, loading: () => null }
);

export function BoxFieldBackground() {
  const { mode } = useBackgroundMode();

  return mode === "stars" ? <StarFieldCanvas /> : <BoxFieldCanvas />;
}
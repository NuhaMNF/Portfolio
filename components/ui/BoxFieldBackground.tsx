"use client";

import dynamic from "next/dynamic";

export const BoxFieldBackground = dynamic(
  () => import("@/components/ui/BoxField3D").then((m) => m.BoxFieldCanvas),
  { ssr: false, loading: () => null }
);
"use client";

import dynamic from "next/dynamic";

export const BootTerminalClient = dynamic(
  () => import("@/components/notebook/BootTerminal").then((m) => m.BootTerminal),
  { ssr: false }
);

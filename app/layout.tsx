import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NotebookExplorer } from "@/components/notebook/NotebookExplorer";
import { NotebookStatus } from "@/components/system/NotebookStatus";
import { CommandPalette } from "@/components/notebook/CommandPalette";
import { EasterEggOverlay } from "@/components/ui/EasterEggOverlay";
import { BootTerminalClient } from "@/components/system/BootTerminalClient";
import { StatusBar } from "@/components/system/StatusBar";
import { RunNuha } from "@/components/system/RunNuha";
import { BoxFieldBackground } from "@/components/ui/BoxFieldBackground";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Nuha Nizar — Research Notebook",
  description:
    "The personal computational notebook of Nuha Nizar — AI engineer, researcher, builder. A living record of experiments, projects and ideas.",
  keywords: [
    "Nuha Nizar",
    "AI Engineer",
    "Machine Learning",
    "Research Notebook",
    "Developer",
    "Portfolio",
  ],
  openGraph: {
    title: "Nuha Nizar — Research Notebook",
    description:
      "A living computational notebook by Nuha Nizar — AI engineer and researcher.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black font-sans text-[var(--fg)] selection:bg-amber-300/30 selection:text-amber-100">
        <BoxFieldBackground />
        <CoordRails />
        <BootTerminalClient />
        <CustomCursor />
        <NotebookExplorer />
        <NotebookStatus />
        <CommandPalette />
        <EasterEggOverlay />
        <RunNuha />
        <div className="relative z-[1] lg:pl-[260px] pb-[24px]">{children}</div>
        <StatusBar />
      </body>
    </html>
  );
}

/** Notebook coordinate rails — left & right edge ticks that run the full height. */
function CoordRails() {
  return (
    <>
      <div className="coord-marks-left hidden lg:block" aria-hidden />
      <div className="coord-marks-right hidden lg:block" aria-hidden />
    </>
  );
}
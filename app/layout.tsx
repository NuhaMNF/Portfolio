import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NotebookSidebar } from "@/components/notebook/NotebookSidebar";
import { NotebookProgressBar } from "@/components/notebook/NotebookProgressBar";
import { CommandPalette } from "@/components/notebook/CommandPalette";
import { EasterEggOverlay } from "@/components/ui/EasterEggOverlay";
import { BootTerminalClient } from "@/components/system/BootTerminalClient";

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

export const metadata: Metadata = {
  title: "Nuha Nizar — AI Engineer & Developer",
  description:
    "Personal notebook of Nuha Nizar — AI engineer, developer, builder. Projects, research, experience and a way to connect.",
  keywords: [
    "Nuha Nizar",
    "AI Engineer",
    "Machine Learning",
    "Developer",
    "Portfolio",
  ],
  openGraph: {
    title: "Nuha Nizar — AI Engineer & Developer",
    description:
      "Personal notebook of Nuha Nizar — AI engineer, developer, builder.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0b] font-sans text-zinc-200 selection:bg-amber-300/30 selection:text-amber-100">
        <BootTerminalClient />
        <CustomCursor />
        <NotebookSidebar />
        <NotebookProgressBar />
        <CommandPalette />
        <EasterEggOverlay />
        <div className="lg:pl-[220px]">{children}</div>
      </body>
    </html>
  );
}

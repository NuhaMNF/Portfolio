import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NotebookExplorer } from "@/components/notebook/NotebookExplorer";
import { NotebookStatus } from "@/components/system/NotebookStatus";
import { CommandPalette } from "@/components/notebook/CommandPalette";
import { EasterEggOverlay } from "@/components/ui/EasterEggOverlay";
import { StatusBar } from "@/components/system/StatusBar";
import { BoxFieldBackground } from "@/components/ui/BoxFieldBackground";
import { ThemeController } from "@/components/system/ThemeController";
import { ToastContainer } from "@/components/ui/ToastNotification";
import { RoboPet } from "@/components/ui/RoboPet";

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
  title: "Nuha Nizar — Portfolio | Management & IT Undergraduate",
  description:
    "Undergraduate in Management & Information Technology at the University of Kelaniya. Passionate about data analysis, innovation, and solving problems through technology.",
  keywords: [
    "Nuha Nizar",
    "Management & IT",
    "University of Kelaniya",
    "Department of Industrial Management",
    "Data Analysis",
    "Software Development",
    "Database Systems",
    "Portfolio",
  ],
  openGraph: {
    title: "Nuha Nizar — Portfolio",
    description:
      "Undergraduate in Management & IT at the University of Kelaniya. Combining management insight with data-driven decision making.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      className={`${inter.variable} ${mono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nuha-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)] selection:bg-[var(--accent)]/25 selection:text-[var(--fg)]"
        suppressHydrationWarning
      >
        <ThemeController />
        <BoxFieldBackground />
        <CoordRails />
        <CustomCursor />
        <NotebookExplorer />
        <NotebookStatus />
        <CommandPalette />
        <EasterEggOverlay />
        <ToastContainer />
        <RoboPet />
        <div className="relative z-[1] lg:pl-[296px] lg:pb-[24px]">{children}</div>
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
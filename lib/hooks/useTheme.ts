"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, type Theme } from "@/lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
    const sync = () => setTheme(getStoredTheme());
    window.addEventListener("nuha:theme", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nuha:theme", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return theme;
}

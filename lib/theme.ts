export type Theme = "dark" | "light";

export const THEME_KEY = "nuha-theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function toggleStoredTheme(): Theme {
  const next: Theme = getStoredTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  window.dispatchEvent(new Event("nuha:theme"));
  return next;
}

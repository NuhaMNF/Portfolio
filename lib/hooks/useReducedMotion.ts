"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  const reduced = useFramerReducedMotion();
  return Boolean(reduced);
}

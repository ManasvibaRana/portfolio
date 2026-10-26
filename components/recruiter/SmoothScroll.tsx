"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useMode } from "@/lib/mode";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Lenis smooth scrolling, only in Recruiter mode and without reduced motion. */
export default function SmoothScroll() {
  const mode = useMode();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (mode !== "recruiter" || reduced) return;
    // Higher lerp = closer to native scrolling; the default (0.1) feels floaty on a mouse wheel.
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.2 });
    return () => lenis.destroy();
  }, [mode, reduced]);

  return null;
}

import { useSyncExternalStore } from "react";
import { MODE_KEY } from "./storageKeys";
import { studio } from "./store";

export type Mode = "3d" | "recruiter";

const listeners = new Set<() => void>();

function readMode(): Mode {
  return document.documentElement.dataset.mode === "3d" ? "3d" : "recruiter";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Switch between the 3D studio and the 2D Recruiter page. The initial mode is
 * chosen before first paint by the inline script in lib/bootScript.ts.
 * `persist: false` is used for automatic fallbacks so they aren't remembered.
 */
export function setMode(mode: Mode, { persist = true }: { persist?: boolean } = {}) {
  document.documentElement.dataset.mode = mode;
  if (persist) {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // storage unavailable — the choice just won't be remembered
    }
  }
  if (mode === "recruiter") {
    studio.setState({ active: null, hovered: null });
    window.scrollTo(0, 0);
  }
  listeners.forEach((listener) => listener());
}

/** Current mode, or null during server render / hydration. */
export function useMode(): Mode | null {
  return useSyncExternalStore(subscribe, readMode, () => null);
}

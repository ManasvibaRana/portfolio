import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./storageKeys";
import { studio } from "./store";

const listeners = new Set<() => void>();

function readDark() {
  return document.documentElement.classList.contains("dark");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Dark mode for the 2D UI doubles as night mode in the 3D room. */
export function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // storage unavailable
  }
  studio.setState({ night: dark });
  listeners.forEach((listener) => listener());
}

export function useDark(): boolean {
  return useSyncExternalStore(subscribe, readDark, () => false);
}

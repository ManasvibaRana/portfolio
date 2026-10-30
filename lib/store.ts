import { useSyncExternalStore } from "react";
import type { ObjectId } from "@/data/sceneObjects";

export interface StudioState {
  hovered: ObjectId | null;
  active: ObjectId | null;
  night: boolean;
  /** The 3D scene has rendered its first frames. */
  sceneReady: boolean;
  /** The boot screen has finished and the room is visible. */
  booted: boolean;
  /** Briefly show every object's label right after the room appears. */
  introLabels: boolean;
  /** Lo-fi music playing (see lib/lofi.ts). */
  music: boolean;
  /** Desk lamp on (follows night mode, but can be clicked on/off). */
  lampOn: boolean;
  /** Bumped when the character is clicked, to make her wave. */
  waveRequest: number;
  /** Objects the visitor has opened; the rest get a pulsing hotspot. */
  visited: ObjectId[];
}

const initialState: StudioState = {
  hovered: null,
  active: null,
  night: false,
  sceneReady: false,
  booted: false,
  introLabels: false,
  music: false,
  lampOn: false,
  waveRequest: 0,
  visited: [],
};

let state = initialState;
const listeners = new Set<() => void>();

/** Tiny global store shared by the 3D scene and the DOM UI. */
export const studio = {
  getState: () => state,
  setState(partial: Partial<StudioState>) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Select a primitive slice of the store and re-render when it changes. */
export function useStudio<T>(selector: (s: StudioState) => T): T {
  return useSyncExternalStore(
    studio.subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

/**
 * Per-frame animated values written by <Lights /> and read inside useFrame
 * callbacks. Kept out of React state so they never trigger re-renders.
 */
export const fx = {
  /** 0 = day, 1 = night, eased. */
  night: 0,
  /** 0 = silent, 1 = music playing, eased. */
  music: 0,
  /** 0 = desk lamp off, 1 = on, eased. */
  lamp: 0,
};

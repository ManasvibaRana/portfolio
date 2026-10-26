import * as THREE from "three";

// The room's daytime look follows the visitor's real local time:
// pink dawn, clear blue midday, golden afternoon, orange sunset.
const KEYS: Array<{ hour: number; sky: string; sun: string }> = [
  { hour: 6.5, sky: "#ffd6e0", sun: "#ffd9c8" },
  { hour: 9, sky: "#cfe6ff", sun: "#fff0e0" },
  { hour: 13, sky: "#b9e0ff", sun: "#fff6ea" },
  { hour: 16.5, sky: "#ffe2b8", sun: "#ffd6a0" },
  { hour: 18.5, sky: "#ffb48a", sun: "#ffb27a" },
  { hour: 19.8, sky: "#c99ac9", sun: "#f3a08a" },
];
const colors = KEYS.map((k) => ({ hour: k.hour, sky: new THREE.Color(k.sky), sun: new THREE.Color(k.sun) }));

/** Local time as a fractional hour, e.g. 14.5 = 2:30 pm. */
export function localHour(date = new Date()) {
  return date.getHours() + date.getMinutes() / 60;
}

/** Writes the sky and sunlight colors for `hour` into the given colors. */
export function sampleDaylight(hour: number, sky: THREE.Color, sun: THREE.Color) {
  const h = THREE.MathUtils.clamp(hour, colors[0].hour, colors[colors.length - 1].hour);
  let i = 0;
  while (i < colors.length - 2 && h > colors[i + 1].hour) i++;
  const a = colors[i];
  const b = colors[i + 1];
  const t = (h - a.hour) / (b.hour - a.hour);
  sky.lerpColors(a.sky, b.sky, t);
  sun.lerpColors(a.sun, b.sun, t);
}

/** 0 at sunrise to 1 at sunset, for moving the sun across the window. */
export function sunProgress(hour: number) {
  return THREE.MathUtils.clamp((hour - 6.5) / (19.8 - 6.5), 0, 1);
}

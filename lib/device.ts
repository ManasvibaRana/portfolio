/** Touch-first or small-screen device: gets the simplified scene. */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

/** A phone/tablet with enough CPU and memory for the high-quality mobile scene. */
export function isCapableMobile() {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory isn't available on iOS; treat unknown memory as fine
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return cores >= 4 && (memory === undefined || memory >= 4);
}

/** True when a WebGL context can actually be created. */
export function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

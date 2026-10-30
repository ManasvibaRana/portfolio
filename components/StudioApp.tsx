"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { site } from "@/data/site";
import { DocIcon, MoonIcon, MusicIcon, SparkleIcon, SunIcon } from "@/components/icons";
import BootScreen from "@/components/overlay/BootScreen";
import { objectOrder } from "@/data/sceneObjects";
import { startLofi, stopLofi } from "@/lib/lofi";
import { setMode, useMode } from "@/lib/mode";
import { VISITED_KEY } from "@/lib/storageKeys";
import { studio, useStudio } from "@/lib/store";
import { setDark, useDark } from "@/lib/theme";

function toggleMusic() {
  const on = !studio.getState().music;
  studio.setState({ music: on });
  if (on) void startLofi();
  else stopLofi();
}

// Heavy 3D + animation code only loads in 3D mode.
const Experience = dynamic(() => import("@/components/three/Experience"), { ssr: false });
const Panel = dynamic(() => import("@/components/overlay/Panel"), { ssr: false });
const Dock = dynamic(() => import("@/components/overlay/Dock"), { ssr: false });

/**
 * The full-screen 3D layer. It's server-rendered as just the boot screen and
 * hidden by CSS unless <html data-mode="3d">, so Recruiter mode never pays for it.
 */
export default function StudioApp() {
  const mode = useMode();
  const dark = useDark();
  const active = useStudio((s) => s.active);
  const booted = useStudio((s) => s.booted);
  const music = useStudio((s) => s.music);
  const explored = useStudio((s) => s.visited.length);

  // Remember which objects this visitor has opened, so the "where to look"
  // hotspots only point at what's left (kept in their browser only).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]") as unknown;
      if (Array.isArray(saved)) {
        studio.setState({ visited: objectOrder.filter((id) => saved.includes(id)) });
      }
    } catch {
      // storage unavailable or corrupt: start fresh
    }
  }, []);
  useEffect(() => {
    if (!active) return;
    const { visited } = studio.getState();
    if (visited.includes(active)) return;
    const next = [...visited, active];
    studio.setState({ visited: next });
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable: progress just won't be remembered
    }
  }, [active]);

  // The desk lamp follows night mode (it can still be clicked on/off in the room).
  useEffect(() => {
    studio.setState({ night: dark, lampOn: dark });
  }, [dark]);

  // Right after the room appears, pop up every object's name so first-time
  // visitors know where to look.
  // (Skipped on narrow screens, where the six labels would pile on top of each
  // other; the small "where to look" dots guide phone visitors instead.)
  useEffect(() => {
    if (!booted || window.innerWidth < 640) return;
    studio.setState({ introLabels: true });
    const timer = window.setTimeout(() => studio.setState({ introLabels: false }), 3400);
    return () => window.clearTimeout(timer);
  }, [booted]);

  // Keyboard shortcuts: 1-6 open a section, N day/night, M music (Esc is handled by the panel).
  useEffect(() => {
    if (mode !== "3d" || !booted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < objectOrder.length) {
        studio.setState({ active: objectOrder[index], hovered: null });
      } else if (e.key.toLowerCase() === "n") {
        setDark(!document.documentElement.classList.contains("dark"));
      } else if (e.key.toLowerCase() === "m") {
        toggleMusic();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, booted]);

  // Music stops when leaving the 3D studio.
  useEffect(() => {
    if (mode === "3d") return;
    stopLofi();
    studio.setState({ music: false });
  }, [mode]);

  // Keep the Recruiter page out of the tab order / a11y tree while it's covered.
  useEffect(() => {
    const page = document.getElementById("recruiter");
    if (!page) return;
    if (mode === "3d") page.setAttribute("inert", "");
    else page.removeAttribute("inert");
  }, [mode]);

  if (mode === "recruiter") return <div className="studio-layer" />;

  return (
    <div className="studio-layer" aria-label={`${site.studioName}, interactive 3D portfolio`} role="region">
      {mode === "3d" && (
        <>
          <div className="absolute inset-0">
            <Experience />
          </div>

          {/* Top bar. Phones: two tidy rows (title | Recruiter, tip | music + theme),
              every control 40px tall. Desktop: one row (title + tagline | three buttons). */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
            <header className={`min-w-0 transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}>
              <h1 className="font-display text-[17px] leading-10 font-semibold whitespace-nowrap text-plum sm:text-3xl sm:leading-tight dark:text-cream">
                {site.studioName}
              </h1>
              <p className="mt-1 hidden text-base text-plum-soft sm:block dark:text-lavender">{site.tagline}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs leading-10 font-medium whitespace-nowrap text-plum-soft sm:leading-normal dark:text-lavender">
                <SparkleIcon width={12} height={12} className="shrink-0 text-peach-deep" />
                {explored === 0 ? (
                  <>
                    <span className="sm:hidden">Tap a glowing dot to explore</span>
                    <span className="hidden sm:inline">Click a glowing dot to explore</span>
                    <span className="hidden lg:inline">
                      or press <kbd className="kbd">1</kbd>-<kbd className="kbd">6</kbd>
                    </span>
                  </>
                ) : explored < objectOrder.length ? (
                  <span>
                    {explored} of {objectOrder.length} explored
                  </span>
                ) : (
                  <span>All explored, nice work!</span>
                )}
              </p>
            </header>

            <div className="pointer-events-auto flex shrink-0 flex-col-reverse items-end gap-2 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleMusic}
                  aria-pressed={music}
                  aria-label={music ? "Pause lo-fi music (M)" : "Play lo-fi music (M)"}
                  title={music ? "Pause lo-fi music (M)" : "Play lo-fi music (M)"}
                  className="icon-btn glass-strong size-10 sm:size-11"
                >
                  {music ? (
                    <span aria-hidden className="eq-bars">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    <MusicIcon width={18} height={18} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDark(!dark)}
                  aria-pressed={dark}
                  aria-label={dark ? "Switch to day" : "Switch to night"}
                  title={dark ? "Day mode (N)" : "Night mode (N)"}
                  className="icon-btn glass-strong size-10 sm:size-11"
                >
                  {dark ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMode("recruiter")}
                aria-label="Recruiter mode"
                className="btn glass-strong h-10 px-3.5 text-sm text-plum sm:h-11 sm:px-4 sm:text-base dark:text-cream"
              >
                <DocIcon width={16} height={16} />
                <span className="sm:hidden">Recruiter</span>
                <span className="hidden sm:inline">Recruiter mode</span>
              </button>
            </div>
          </div>

          <Dock />
          <Panel />
        </>
      )}
      <BootScreen />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { site } from "@/data/site";
import { DocIcon, MoonIcon, MusicIcon, SparkleIcon, SunIcon } from "@/components/icons";
import BootScreen from "@/components/overlay/BootScreen";
import { objectOrder } from "@/data/sceneObjects";
import { startLofi, stopLofi } from "@/lib/lofi";
import { setMode, useMode } from "@/lib/mode";
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

  // The desk lamp follows night mode (it can still be clicked on/off in the room).
  useEffect(() => {
    studio.setState({ night: dark, lampOn: dark });
  }, [dark]);

  // Right after the room appears, pop up every object's name so first-time
  // visitors know where to look.
  useEffect(() => {
    if (!booted) return;
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

          <header
            className={`pointer-events-none absolute top-4 left-4 z-10 max-w-[min(24rem,calc(100vw-16.5rem))] transition-opacity duration-300 sm:top-6 sm:left-6 ${
              active ? "opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="font-display text-lg leading-tight font-semibold text-plum sm:text-3xl dark:text-cream">
              {site.studioName}
            </h1>
            <p className="mt-1 hidden text-sm text-plum-soft sm:block sm:text-base dark:text-lavender">{site.tagline}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-plum-soft dark:text-lavender">
              <SparkleIcon width={12} height={12} className="text-peach-deep" />
              Click an object to explore
              <span className="hidden lg:inline">
                or press <kbd className="kbd">1</kbd>-<kbd className="kbd">6</kbd>
              </span>
            </p>          </header>

          <div className="absolute top-4 right-4 z-20 flex gap-2 sm:top-6 sm:right-6">
            <button
              type="button"
              onClick={toggleMusic}
              aria-pressed={music}
              aria-label={music ? "Pause lo-fi music (M)" : "Play lo-fi music (M)"}
              title={music ? "Pause lo-fi music (M)" : "Play lo-fi music (M)"}
              className="icon-btn glass-strong"
            >
              {music ? (
                <span aria-hidden className="eq-bars">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <MusicIcon />
              )}
            </button>
            <button
              type="button"
              onClick={() => setDark(!dark)}
              aria-pressed={dark}
              aria-label={dark ? "Switch to day" : "Switch to night"}
              title={dark ? "Day mode (N)" : "Night mode (N)"}
              className="icon-btn glass-strong"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              type="button"
              onClick={() => setMode("recruiter")}
              className="btn glass-strong px-3 text-sm text-plum sm:px-4 sm:text-base dark:text-cream"
            >
              <DocIcon width={16} height={16} />
              Recruiter mode
            </button>
          </div>

          <Dock />
          <Panel />
        </>
      )}
      <BootScreen />
    </div>
  );
}

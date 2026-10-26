"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { setMode } from "@/lib/mode";
import { studio, useStudio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STEPS = [
  { at: 0, text: "unpacking the studio" },
  { at: 22, text: "placing the bookshelf" },
  { at: 45, text: "hanging fairy lights" },
  { at: 68, text: "brewing coffee" },
  { at: 88, text: "waking up " + site.firstName },
];

function PeekingChibi() {
  return (
    <svg viewBox="0 0 120 70" className="boot-chibi" aria-hidden>
      <circle cx="30" cy="22" r="13" fill="#5b3a55" />
      <circle cx="90" cy="22" r="13" fill="#5b3a55" />
      <circle cx="60" cy="52" r="38" fill="#5b3a55" />
      <ellipse cx="60" cy="58" rx="31" ry="30" fill="#ffe1d0" />
      <path d="M29 52c4-22 17-30 31-30s27 8 31 30c-8-8-16-12-22-12-4 6-12 9-19 8-8-1-15 0-21 4z" fill="#5b3a55" />
      <g className="boot-eyes">
        <ellipse cx="48" cy="60" rx="4.5" ry="5.5" fill="#2d1b3a" />
        <ellipse cx="72" cy="60" rx="4.5" ry="5.5" fill="#2d1b3a" />
        <circle cx="49.5" cy="58" r="1.6" fill="#fff" />
        <circle cx="73.5" cy="58" r="1.6" fill="#fff" />
      </g>
      <ellipse cx="40" cy="68" rx="5" ry="3" fill="#ffb3c7" />
      <ellipse cx="80" cy="68" rx="5" ry="3" fill="#ffb3c7" />
    </svg>
  );
}

/** The character's laptop booting up while the 3D scene loads. */
export default function BootScreen() {
  const ready = useStudio((s) => s.sceneReady);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(3);
  const [phase, setPhase] = useState<"loading" | "hiding" | "gone">("loading");

  // Ease toward 92% while loading; the rest waits for the first rendered frame.
  useEffect(() => {
    if (ready) return;
    setPhase("loading");
    const id = window.setInterval(() => setProgress((p) => p + (92 - p) * 0.05), 80);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setProgress(100);
    const hide = window.setTimeout(() => setPhase("hiding"), reduced ? 0 : 550);
    const done = window.setTimeout(
      () => {
        setPhase("gone");
        studio.setState({ booted: true });
      },
      reduced ? 50 : 1100,
    );
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(done);
    };
  }, [ready, reduced]);

  if (phase === "gone") return null;

  const pct = Math.round(progress);
  const visible = STEPS.filter((step) => pct >= step.at);

  return (
    <div
      className={`boot-screen absolute inset-0 z-40 grid place-items-center overflow-hidden px-4 transition-[opacity,transform] duration-500 ${
        phase === "hiding" ? "pointer-events-none scale-105 opacity-0" : "opacity-100"
      }`}
    >
      {/* floating pastel shapes */}
      <div aria-hidden className="boot-shapes">
        <span className="boot-shape left-[12%] top-[18%] size-16 bg-peach" />
        <span className="boot-shape right-[14%] top-[24%] size-10 rounded-xl bg-mint [animation-delay:-2s]" />
        <span className="boot-shape bottom-[18%] left-[20%] size-12 rounded-2xl bg-lavender [animation-delay:-4s]" />
        <span className="boot-shape bottom-[24%] right-[18%] size-20 bg-[#ffb3c7] [animation-delay:-1s]" />
        <span className="boot-shape left-[46%] top-[10%] size-6 bg-[#fff0a8] [animation-delay:-3s]" />
      </div>

      <div className="relative flex flex-col items-center">
        <PeekingChibi />
        <div className="boot-lid">
          <div className="boot-display">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2 rounded-full bg-[#ff8fa3]" />
                <span className="size-2 rounded-full bg-[#f2cf6b]" />
                <span className="size-2 rounded-full bg-[#86d3b0]" />
              </span>
              <span className="font-mono text-[10px] text-lavender/80">studio-os</span>
            </div>
            <ul className="mt-3 min-h-[6.5rem] space-y-1 font-mono text-[11px] leading-relaxed sm:text-xs" aria-hidden>
              {visible.map((step, i) => {
                const done = i < visible.length - 1 || pct >= 100;
                return (
                  <li key={step.text} className="boot-line flex items-center gap-2">
                    <span className={done ? "text-mint" : "text-peach"}>{done ? "✓" : ">"}</span>
                    <span className={done ? "text-cream/70" : "text-cream"}>
                      {step.text}
                      {!done && <span className="boot-caret">_</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-white/12"
                role="progressbar"
                aria-label="Loading the 3D studio"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className="boot-bar h-full rounded-full transition-[width] duration-200" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-9 text-right font-mono text-xs text-cream tabular-nums">{pct}%</span>
            </div>
          </div>
        </div>
        <div className="boot-base" />

        <p className="mt-8 font-display text-2xl font-semibold text-plum sm:text-3xl dark:text-cream">{site.studioName}</p>
        <p className="mt-1 text-sm text-plum-soft dark:text-lavender">{pct < 100 ? "Setting up the room for you…" : "Come on in!"}</p>
        <button
          type="button"
          onClick={() => setMode("recruiter")}
          className="mt-5 text-sm font-medium text-plum-soft underline underline-offset-4 hover:text-plum dark:text-lavender dark:hover:text-cream"
        >
          In a hurry? Open Recruiter mode
        </button>
      </div>
    </div>
  );
}

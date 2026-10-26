"use client";

import { useEffect, useRef, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { sceneObjects, type ObjectId } from "@/data/sceneObjects";
import { site } from "@/data/site";
import { BackIcon } from "@/components/icons";
import { studio, useStudio } from "@/lib/store";

const loading = () => <p className="animate-pulse text-plum-soft dark:text-lavender">Loading…</p>;

// Each section is its own chunk, fetched the first time its object is opened.
const SECTIONS: Record<ObjectId, ComponentType> = {
  laptop: dynamic(() => import("@/components/sections/ProjectsPanel"), { loading }),
  whiteboard: dynamic(() => import("@/components/sections/ExperienceTimeline"), { loading }),
  bookshelf: dynamic(() => import("@/components/sections/SkillsList"), { loading }),
  trophies: dynamic(() => import("@/components/sections/AchievementsList"), { loading }),
  mailbox: dynamic(() => import("@/components/sections/ContactSection"), { loading }),
  speaker: dynamic(() => import("@/components/sections/AboutSection"), { loading }),
};

const close = () => studio.setState({ active: null });

/** Glass overlay panel for the opened room object. Right drawer on desktop, bottom sheet on mobile. */
export default function Panel() {
  const active = useStudio((s) => s.active);
  const backButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    backButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [active]);

  const Section = active ? SECTIONS[active] : null;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {active && (
          // Soft scrim so the panel stays readable over the busy scene.
          <motion.div
            key="scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="panel-scrim pointer-events-none fixed inset-0 z-20"
          />
        )}
        {active && Section && (
          <motion.section
            key={active}
            role="dialog"
            aria-modal="false"
            aria-labelledby="panel-title"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.25 } }}
            className="panel fixed inset-x-2 bottom-2 z-30 flex max-h-[64dvh] flex-col rounded-3xl text-plum md:inset-x-auto md:top-20 md:right-5 md:bottom-5 md:max-h-none md:w-[min(34rem,46vw)] dark:text-cream"
          >
            <header className="flex items-start justify-between gap-3 border-b border-lavender/40 px-6 pt-5 pb-4 dark:border-lavender/20">
              <div>
                <p className="text-xs font-semibold tracking-wide text-plum-soft uppercase dark:text-lavender">
                  {site.studioName}
                </p>
                <h2 id="panel-title" className="font-display text-3xl font-semibold">
                  {sceneObjects[active].section}
                </h2>
              </div>
              <button ref={backButton} type="button" onClick={close} className="btn btn-soft shrink-0">
                <BackIcon width={16} height={16} />
                Back to room
              </button>
            </header>
            <div className="overflow-y-auto overscroll-contain px-6 py-6 text-[15px] sm:text-base">
              <Section />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

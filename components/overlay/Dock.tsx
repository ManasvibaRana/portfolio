"use client";

import type { ComponentType, SVGProps } from "react";
import { BoardIcon, BooksIcon, LaptopIcon, MailIcon, SpeakerIcon, TrophyIcon } from "@/components/icons";
import { objectOrder, sceneObjects, type ObjectId } from "@/data/sceneObjects";
import { studio, useStudio } from "@/lib/store";

const ICONS: Record<ObjectId, ComponentType<SVGProps<SVGSVGElement>>> = {
  laptop: LaptopIcon,
  whiteboard: BoardIcon,
  bookshelf: BooksIcon,
  trophies: TrophyIcon,
  mailbox: MailIcon,
  speaker: SpeakerIcon,
};

/**
 * Keyboard / tap shortcut to every room object. Focusing or hovering a button
 * highlights the matching object in 3D; activating it flies the camera there.
 */
export default function Dock() {
  const active = useStudio((s) => s.active);
  const hovered = useStudio((s) => s.hovered);
  const visited = useStudio((s) => s.visited);
  if (active) return null;

  const highlight = (id: ObjectId | null) => studio.setState({ hovered: id });

  return (
    <nav aria-label="Room objects" className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6">
      <ul className="glass-strong flex gap-1 rounded-full p-1.5">
        {objectOrder.map((id, i) => {
          const Icon = ICONS[id];
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => studio.setState({ active: id, hovered: null })}
                onFocus={() => highlight(id)}
                onBlur={() => highlight(null)}
                onMouseEnter={() => highlight(id)}
                onMouseLeave={() => highlight(null)}
                aria-label={`Open ${sceneObjects[id].section}${visited.includes(id) ? "" : " (not explored yet)"}`}
                aria-keyshortcuts={String(i + 1)}
                title={`${sceneObjects[id].label} (${i + 1})`}
                className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 font-display text-sm font-medium text-plum transition-colors hover:bg-lavender/40 dark:text-cream dark:hover:bg-white/10 ${
                  hovered === id ? "bg-lavender/40 dark:bg-white/10" : ""
                }`}
              >
                {/* matches the room's "not explored yet" hotspots */}
                {!visited.includes(id) && <span aria-hidden className="dock-dot" />}
                <Icon width={18} height={18} />
                <span className="hidden lg:inline">{sceneObjects[id].label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

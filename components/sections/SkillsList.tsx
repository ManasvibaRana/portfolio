import type { CSSProperties } from "react";
import { coreStack, skills, type SkillIcon } from "@/data/skills";

const ICON_PATHS: Record<SkillIcon, string> = {
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14",
  server: "M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01",
  layout: "M4 4h16v16H4zM4 9h16M9 9v11",
  database: "M12 4c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  brain:
    "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6z",
  cpu: "M7 7h10v10H7zM10 10h4v4h-4zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
};

function CategoryIcon({ icon }: { icon: SkillIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICON_PATHS[icon]} />
    </svg>
  );
}

export default function SkillsList() {
  return (
    <div className="@container space-y-8">
      {/* daily drivers */}
      <div className="daily-drivers">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-plum-soft uppercase dark:text-lavender">
          <span aria-hidden className="pulse-dot" />
          Daily drivers
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {coreStack.map((skill) => (
            <li key={skill} className="core-pill">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* the bookshelf */}
      <ul className="grid gap-x-5 gap-y-9 @xl:grid-cols-2 @4xl:grid-cols-3">
        {skills.map((category) => (
          <li
            key={category.id}
            // the biggest categories take two slots so the shelf fills evenly
            className={`book group ${category.skills.length >= 6 ? "@4xl:col-span-2" : ""}`}
            style={{ "--spine": category.color } as CSSProperties}
          >
            <div className="book-spine" aria-hidden>
              <span className="book-band" />
              <span className="book-spine-title">{category.name}</span>
              <span className="book-band" />
            </div>
            <div className="book-cover">
              <div className="flex items-start gap-3">
                <span className="book-icon">
                  <CategoryIcon icon={category.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-tight font-semibold">{category.name}</h3>
                  <p className="mt-0.5 text-sm text-plum-soft dark:text-lavender">{category.blurb}</p>
                </div>
                <span className="ml-auto shrink-0 font-mono text-xs text-plum-soft/80 dark:text-lavender/80">
                  {String(category.skills.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li key={skill} className="label-tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

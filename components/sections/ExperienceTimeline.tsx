import { experience } from "@/data/experience";

export default function ExperienceTimeline() {
  return (
    <ul className="space-y-6">
      {experience.map((item) => (
        <li key={item.role} className="exp-card">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span aria-hidden className="pulse-dot" />
            <h3 className="font-display text-xl leading-tight font-semibold">{item.role}</h3>
            <span className="tag-badge">{item.type}</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5 leading-relaxed">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-peach-deep" />
                {bullet}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

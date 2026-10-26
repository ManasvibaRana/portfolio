import { now } from "@/data/now";
import { site } from "@/data/site";

export default function AboutSection() {
  const facts = [
    { label: "Studying", value: site.education.degree, sub: site.education.years },
    { label: "CGPA", value: site.education.cgpa, sub: "Final year" },
    { label: "Working as", value: site.role, sub: "Full-time" },
  ];
  return (
    <div className="@container space-y-6">
      <p className="flex items-center gap-2 text-sm font-medium text-plum-soft dark:text-lavender">
        <span aria-hidden className="pulse-dot" />
        Studying and working full-time
      </p>
      <p className="text-lg leading-relaxed">{site.about}</p>
      <p className="now-strip">
        <span className="font-semibold">Currently exploring:</span> {now.exploring}
      </p>
      <ul className="grid gap-3 @lg:grid-cols-3">
        {facts.map((fact) => (
          <li key={fact.label} className="fact-tile">
            <p className="text-xs font-semibold tracking-wider text-plum-soft uppercase dark:text-lavender">{fact.label}</p>
            <p className="mt-1 font-display text-lg leading-tight font-semibold">{fact.value}</p>
            <p className="mt-0.5 text-sm text-plum-soft dark:text-lavender">{fact.sub}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

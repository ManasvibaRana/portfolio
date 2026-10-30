import type { CSSProperties } from "react";
import { projects, type Project } from "@/data/projects";
import { ArrowIcon, GitHubIcon } from "@/components/icons";
import ProjectArt from "./ProjectArt";

function WindowBar({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-2 border-b border-plum/8 bg-white/60 px-4 py-2.5 dark:border-white/8 dark:bg-white/5">
      <span aria-hidden className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff8fa3]" />
        <span className="size-2.5 rounded-full bg-[#f2cf6b]" />
        <span className="size-2.5 rounded-full bg-[#86d3b0]" />
      </span>
      <span className="truncate font-mono text-xs text-plum-soft dark:text-lavender">~/projects/{project.slug}</span>
      {project.badge && <span className="tag-badge ml-auto shrink-0">{project.badge}</span>}
    </div>
  );
}

/** Short feature labels as tinted pills: quick to scan instead of sentences. */
function Highlights({ project }: { project: Project }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key features">
      {project.highlights.map((item) => (
        <li key={item} className="feature-pill" style={{ "--accent": project.accent } as CSSProperties}>
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
            <path d="m2.5 6 2.3 2.3L9.5 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

const MAX_STICKERS = 5;

function Stickers({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  const shown = tags.slice(0, MAX_STICKERS);
  const hidden = tags.slice(MAX_STICKERS);
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
      {shown.map((tag) => (
        <li key={tag} className="sticker">
          {tag}
        </li>
      ))}
      {hidden.length > 0 && (
        <li className="sticker sticker-more" title={hidden.join(", ")}>
          +{hidden.length}
          <span className="sr-only">: {hidden.join(", ")}</span>
        </li>
      )}
    </ul>
  );
}

function CodeLink({ project }: { project: Project }) {
  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary group/link mt-6 self-start"
      aria-label={`View code for ${project.title} on GitHub (opens in a new tab)`}
    >
      <GitHubIcon width={16} height={16} />
      View code
      <ArrowIcon width={15} height={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </a>
  );
}

function Heading({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="project-index" style={{ "--accent": project.accent } as CSSProperties}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xs font-semibold tracking-wider text-plum-soft uppercase dark:text-lavender">
          {project.category}
        </span>
      </div>
      <h3 className="mt-2 font-display text-2xl leading-tight font-semibold">{project.title}</h3>
      <p className="mt-1 font-display text-base font-medium text-plum-soft dark:text-lavender">{project.tagline}</p>
    </>
  );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className="project-card group">
      <WindowBar project={project} />
      <div className="grid @3xl:grid-cols-[1.05fr_1fr]">
        <div
          className="art-fill aspect-[16/9] overflow-hidden @3xl:order-2 @3xl:aspect-auto"
          style={{ backgroundColor: project.accent }}
        >
          <div className="flex h-full w-full items-center transition-transform duration-500 group-hover:scale-[1.03]">
            <ProjectArt art={project.art} accent={project.accent} />
          </div>
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-7">
          <Heading project={project} index={index} />
          <p className="mt-3 text-[1.02rem] leading-relaxed">{project.description}</p>
          <Highlights project={project} />
          <Stickers tags={project.tags} />
          <CodeLink project={project} />
        </div>
      </div>
    </li>
  );
}

function CompactCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className="project-card group flex flex-col">
      <WindowBar project={project} />
      <div className="aspect-[16/8] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ProjectArt art={project.art} accent={project.accent} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading project={project} index={index} />
        <p className="mt-2.5 text-[0.95rem] leading-relaxed">{project.description}</p>
        <Highlights project={project} />
        <Stickers tags={project.tags} />
        <div className="mt-auto" />
        <CodeLink project={project} />
      </div>
    </li>
  );
}

export default function ProjectsGrid() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <div className="@container space-y-5">
      <ul className="space-y-5">
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} index={projects.indexOf(project)} />
        ))}
      </ul>
      {rest.length > 0 && (
        <ul className="grid gap-5 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {rest.map((project) => (
            <CompactCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </ul>
      )}
    </div>
  );
}

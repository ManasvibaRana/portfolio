import type { ReactNode } from "react";
import { site } from "@/data/site";
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import AboutSection from "@/components/sections/AboutSection";
import AchievementsList from "@/components/sections/AchievementsList";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import GitHubActivity from "@/components/sections/GitHubActivity";
import { getGitHubActivity } from "@/lib/github";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import SkillsList from "@/components/sections/SkillsList";
import HeroAvatar from "./HeroAvatar";
import { StudioButton, ThemeToggle } from "./RecruiterControls";
import SmoothScroll from "./SmoothScroll";

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

// Headline numbers, all taken from the content in /data.
const STATS = [
  { value: "9.0", unit: "/10", label: "CGPA, final year" },
  { value: "10+", unit: "", label: "live client projects delivered" },
  { value: "Top 250", unit: "", label: "of 18,000+ hackathon teams" },
  { value: "5+", unit: "", label: "clients' CRM workflows automated" },
];

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 py-14 sm:py-20">
      <p className="section-eyebrow" aria-hidden>
        <span>{String(index).padStart(2, "0")}</span>
        <span className="h-px w-10 bg-current opacity-40" />
        {NAV[index - 1]?.label}
      </p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-semibold sm:text-5xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Fast, clean single-page version of the portfolio. This is what search engines index. */
export default async function RecruiterPage() {
  const github = await getGitHubActivity();
  return (
    <div id="recruiter" className="recruiter min-h-dvh">
      <SmoothScroll />
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="sticky top-0 z-10 border-b border-white/60 bg-cream/95 dark:border-lavender/15 dark:bg-night/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="font-display text-xl font-semibold" aria-label={`${site.name}, back to top`}>
            {site.firstName}
            <span className="text-peach-deep">.</span>
          </a>
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex gap-5 text-sm font-medium">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <StudioButton />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* hero */}
        <div id="top" className="relative isolate grid items-center gap-10 pt-12 pb-10 sm:pt-20 md:grid-cols-[1.25fr_1fr]">
          <div aria-hidden className="hero-blobs" />
          <div>
            <p className="status-pill">
              <span aria-hidden className="pulse-dot" />
              Working full-time as a {site.role}
            </p>
            <p className="mt-6 font-display text-lg font-medium text-plum-soft dark:text-lavender">Hi, I&apos;m</p>
            <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">
              {site.name}
              <span className="text-peach-deep">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-plum-soft sm:text-2xl dark:text-lavender">
              {site.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="btn btn-primary">
                See my work
                <ArrowIcon width={15} height={15} className="rotate-90" />
              </a>
              <a href={`mailto:${site.email}`} className="btn btn-soft">
                <MailIcon width={16} height={16} />
                Email me
              </a>
            </div>
            <ul className="mt-6 flex gap-2" aria-label="Social links">
              <li>
                <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub profile (opens in a new tab)">
                  <GitHubIcon />
                </a>
              </li>
              <li>
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn profile (opens in a new tab)">
                  <LinkedInIcon />
                </a>
              </li>
            </ul>
          </div>
          <HeroAvatar />
        </div>

        {/* stats strip */}
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((stat) => (
            <li key={stat.label} className="stat-tile">
              <p className="font-display text-3xl font-bold sm:text-4xl">
                {stat.value}
                <span className="text-lg text-plum-soft dark:text-lavender">{stat.unit}</span>
              </p>
              <p className="mt-1 text-sm leading-snug text-plum-soft dark:text-lavender">{stat.label}</p>
            </li>
          ))}
        </ul>

        <Section id="about" index={1} title="A little about me">
          <AboutSection />
        </Section>
        <Section id="experience" index={2} title="What I do">
          <ExperienceTimeline />
        </Section>
        <Section id="projects" index={3} title="Things I've built">
          <ProjectsGrid />
          {github && (
            <div className="mt-12">
              <h3 className="mb-4 font-display text-2xl font-semibold">On GitHub</h3>
              <GitHubActivity data={github} />
            </div>
          )}
        </Section>
        <Section id="skills" index={4} title="My toolkit">
          <SkillsList />
        </Section>
        <Section id="achievements" index={5} title="Wins, roles & certificates">
          <AchievementsList />
        </Section>
        <Section id="contact" index={6} title="Let's talk">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-lg leading-relaxed">
                Hiring, collaborating, or just want to say hi? My inbox is always open and I reply quickly.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex items-center gap-2 font-display text-xl font-semibold break-all text-[#6a4fc0] underline-offset-4 hover:underline dark:text-lavender"
              >
                <MailIcon />
                {site.email}
              </a>
            </div>
            <ContactSection showIntro={false} />
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/60 dark:border-lavender/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-plum-soft sm:flex-row sm:px-6 dark:text-lavender">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>Designed and built by me with Next.js and React Three Fiber</p>
        </div>
      </footer>
    </div>
  );
}

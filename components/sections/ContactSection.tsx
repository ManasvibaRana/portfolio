import { site } from "@/data/site";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import ContactForm from "./ContactForm";

export default function ContactSection({ showIntro = true }: { showIntro?: boolean }) {
  return (
    <div className="space-y-6">
      {showIntro && (
        <div>
          <p className="leading-relaxed">Open to roles, collaborations and good conversations about tech. Say hi!</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 inline-flex items-center gap-2 font-display text-lg font-semibold break-all text-[#6a4fc0] underline-offset-4 hover:underline dark:text-lavender"
          >
            <MailIcon />
            {site.email}
          </a>
        </div>
      )}

      <ContactForm />

      <ul className="flex gap-3" aria-label="Social links">
        <li>
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <GitHubIcon />
          </a>
        </li>
        <li>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <LinkedInIcon />
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className="icon-btn" aria-label={`Email ${site.email}`}>
            <MailIcon />
          </a>
        </li>
      </ul>
    </div>
  );
}

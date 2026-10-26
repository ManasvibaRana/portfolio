import RecruiterPage from "@/components/recruiter/RecruiterPage";
import StudioApp from "@/components/StudioApp";
import { site } from "@/data/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.about,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.socials.github, site.socials.linkedin],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <RecruiterPage />
      <StudioApp />
    </>
  );
}

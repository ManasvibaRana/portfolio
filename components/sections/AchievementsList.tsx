import { achievements, type Achievement } from "@/data/achievements";
import { certifications, type Certification } from "@/data/certifications";
import { ArrowIcon, CertificateIcon, TrophyIcon, UsersIcon } from "@/components/icons";

function CertificateCard({ cert }: { cert: Certification }) {
  return (
    <li className="cert-card">
      <span aria-hidden className="cert-seal">
        <CertificateIcon width={20} height={20} />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="font-display leading-snug font-semibold">{cert.title}</h4>
        <p className="mt-1 text-sm text-plum-soft dark:text-lavender">
          {cert.issuer}
          {cert.platform && ` · ${cert.platform}`} · {cert.issued}
        </p>
        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#6a4fc0] underline-offset-4 hover:underline dark:text-lavender"
            aria-label={`Verify ${cert.title} certificate (opens in a new tab)`}
          >
            Verify
            <ArrowIcon width={13} height={13} />
          </a>
        )}
      </div>
    </li>
  );
}

function AwardCard({ item }: { item: Achievement }) {
  return (
    <li className="award-card">
      <span aria-hidden className="award-medal">
        <TrophyIcon width={22} height={22} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-[#8a5a00] uppercase dark:text-[#f5c96b]">{item.label}</p>
        <h4 className="mt-0.5 font-display text-lg leading-tight font-semibold">{item.title}</h4>
        <p className="mt-1.5 leading-relaxed">{item.detail}</p>
      </div>
    </li>
  );
}

function LeadershipCard({ item }: { item: Achievement }) {
  return (
    <li className="role-card">
      <span aria-hidden className="role-icon">
        <UsersIcon width={20} height={20} />
      </span>
      <p className="mt-3 text-xs font-semibold tracking-wider text-plum-soft uppercase dark:text-lavender">{item.label}</p>
      <h4 className="mt-0.5 font-display text-lg leading-tight font-semibold">{item.title}</h4>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed">{item.detail}</p>
    </li>
  );
}

export default function AchievementsList() {
  const awards = achievements.filter((a) => a.kind === "award");
  const roles = achievements.filter((a) => a.kind === "leadership");
  return (
    <div className="@container space-y-8">
      <div>
        <h3 className="group-heading">Awards &amp; milestones</h3>
        <ul className="mt-3 grid gap-4 @2xl:grid-cols-2">
          {awards.map((item) => (
            <AwardCard key={item.title} item={item} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="group-heading">Leadership &amp; community</h3>
        <ul className="mt-3 grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
          {roles.map((item) => (
            <LeadershipCard key={item.title} item={item} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="group-heading">Certifications</h3>
        <ul className="mt-3 grid gap-3 @2xl:grid-cols-2">
          {certifications.map((cert) => (
            <CertificateCard key={cert.title} cert={cert} />
          ))}
        </ul>
      </div>
    </div>
  );
}

import type { GitHubActivity as Activity } from "@/lib/github";
import { ArrowIcon, GitHubIcon } from "@/components/icons";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#663399",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
};

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** GitHub profile card: recent repos, languages and the last 6 months of contributions. */
export default function GitHubActivity({ data }: { data: Activity }) {
  const profile = `https://github.com/${data.user}`;
  return (
    <div className="@container gh-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a href={profile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <span className="grid size-10 place-items-center rounded-full bg-plum text-cream dark:bg-lavender dark:text-plum">
            <GitHubIcon width={20} height={20} />
          </span>
          @{data.user}
        </a>
        <ul className="flex gap-2 text-sm">
          <li className="gh-stat">
            <strong>{data.publicRepos}</strong> public repos
          </li>
          <li className="gh-stat">
            <strong>{data.totalLastYear}</strong> contributions this year
          </li>
        </ul>
      </div>

      <div className="mt-5 grid gap-6 @3xl:grid-cols-[1.2fr_1fr]">
        <div>
          <h4 className="group-heading">Recently updated</h4>
          <ul className="mt-2.5 space-y-2">
            {data.repos.map((repo) => (
              <li key={repo.name}>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-repo group">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold group-hover:underline">{repo.name}</span>
                    {repo.description && (
                      <span className="block truncate text-sm text-plum-soft dark:text-lavender">{repo.description}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-right text-xs text-plum-soft dark:text-lavender">
                    {repo.language && (
                      <span className="flex items-center justify-end gap-1.5">
                        <span className="size-2.5 rounded-full" style={{ background: LANGUAGE_COLORS[repo.language] ?? "#a58fe0" }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="mt-0.5 block">Updated {monthYear(repo.pushedAt)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          {data.languages.length > 0 && (
            <div>
              <h4 className="group-heading">Languages I push most</h4>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {data.languages.map((lang) => (
                  <li key={lang.name} className="sticker flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full" style={{ background: LANGUAGE_COLORS[lang.name] ?? "#a58fe0" }} />
                    {lang.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="group-heading">Last 6 months</h4>
            <div className="mt-2.5 overflow-x-auto pb-1">
              <div className="gh-grid" role="img" aria-label={`${data.totalLastYear} contributions in the last year`}>
                {data.weeks.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <span
                        key={day.date}
                        className="gh-cell"
                        data-level={day.level}
                        title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href={profile} target="_blank" rel="noopener noreferrer" className="btn btn-soft mt-5">
        <GitHubIcon width={16} height={16} />
        See everything on GitHub
        <ArrowIcon width={14} height={14} />
      </a>
    </div>
  );
}

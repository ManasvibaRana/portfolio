import { site } from "@/data/site";

export const GITHUB_USER = new URL(site.socials.github).pathname.replace(/\//g, "");
const REVALIDATE = 60 * 60 * 24; // refresh once a day
const WEEKS = 26;

export interface ContributionDay {
  date: string;
  level: number; // 0-4, as on GitHub
  count: number;
}

export interface RepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  pushedAt: string;
}

export interface GitHubActivity {
  user: string;
  totalLastYear: number;
  weeks: ContributionDay[][];
  repos: RepoSummary[];
  publicRepos: number;
  languages: Array<{ name: string; count: number }>;
}

async function getContributions() {
  const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
    headers: { "User-Agent": "Mozilla/5.0 (portfolio)" },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`contributions ${res.status}`);
  const html = await res.text();

  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(m[1], Number(/^(\d+)/.exec(m[2].trim())?.[1] ?? 0));
  }
  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td[^>]*data-date="([\d-]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g)) {
    days.push({ date: m[1], level: Number(m[3]), count: counts.get(m[2]) ?? 0 });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));

  const totalLastYear = days.reduce((sum, d) => sum + d.count, 0);
  // last WEEKS columns, each starting on Sunday (like GitHub's graph)
  const last = days.length - 1;
  const lastWeekday = new Date(`${days[last].date}T00:00:00Z`).getUTCDay();
  const start = Math.max(0, last - lastWeekday - (WEEKS - 1) * 7);
  const weeks: ContributionDay[][] = [];
  for (let i = start; i <= last; i += 7) weeks.push(days.slice(i, i + 7));
  return { totalLastYear, weeks };
}

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio" },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`repos ${res.status}`);
  const all = (await res.json()) as Array<{
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
    pushed_at: string;
    fork: boolean;
  }>;
  const own = all.filter((r) => !r.fork);
  const languages = new Map<string, number>();
  for (const r of own) if (r.language) languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
  return {
    publicRepos: own.length,
    languages: [...languages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
    repos: own.slice(0, 4).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      url: r.html_url,
      pushedAt: r.pushed_at,
    })),
  };
}

/** Public GitHub activity, cached for a day. Returns null if GitHub can't be reached. */
export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  try {
    const [contributions, repos] = await Promise.all([getContributions(), getRepos()]);
    return { user: GITHUB_USER, ...contributions, ...repos };
  } catch (error) {
    console.warn("[github] activity unavailable:", error);
    return null;
  }
}

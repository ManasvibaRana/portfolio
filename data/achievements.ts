export interface Achievement {
  title: string;
  /** Small label above the title, e.g. the role. */
  label: string;
  detail: string;
  kind: "award" | "leadership";
}

export const achievements: Achievement[] = [
  {
    kind: "award",
    label: "Hackathon",
    title: "Odoo Biggest Hackathon 2025",
    detail: "Top 250 of 18,000+ teams, advanced to the offline national round.",
  },
  {
    kind: "award",
    label: "Client work",
    title: "10+ live client projects",
    detail: "Delivered 10+ live client projects with full end-to-end ownership.",
  },
  {
    kind: "leadership",
    label: "Core Member",
    title: "Sports Management Team",
    detail: "Core member of my college's sports management team.",
  },
  {
    kind: "leadership",
    label: "Core Member",
    title: "Cultural Events Team",
    detail: "Core member of the team behind my college's cultural events.",
  },
  {
    kind: "leadership",
    label: "Coordinator",
    title: "LEEN",
    detail: "Coordinator of LEEN (LJ Education and Empowerment Network), a club at my university.",
  },
];

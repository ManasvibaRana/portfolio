export interface ExperienceItem {
  role: string;
  /** Short label next to the role, e.g. "Full-time". No dates or company names on purpose. */
  type: string;
  bullets: string[];
}

// Role + bullets only: intentionally no company names and no dates.
export const experience: ExperienceItem[] = [
  {
    role: "Jr. Software Engineer",
    type: "Full-time",
    bullets: [
      "Working as a Python AI engineer on a platform for building and deploying real-time conversational AI agents, owning low-latency AI pipelines and backend services in an Agile team.",
      "Designing REST APIs and webhooks that connect LLMs, speech and third-party services into a scalable, fault-tolerant system.",
      "Building GoHighLevel and n8n automation workflows connecting the platform to CRM and business systems.",
      "Built and deployed CRM automation workflows for 5+ clients (lead management, follow-ups, notifications), integrating 3+ third-party tools via webhooks and APIs.",
      "Owned projects end to end: scoping, client communication and delivery.",
    ],
  },
];

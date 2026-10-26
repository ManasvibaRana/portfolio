export interface Certification {
  title: string;
  issuer: string;
  /** Platform it was taken on, if different from the issuer. */
  platform?: string;
  issued: string;
  credentialId?: string;
  /** Public verification link. */
  url?: string;
}

// Newest first.
export const certifications: Certification[] = [
  {
    title: "Building Generative AI-Powered Applications with Python",
    issuer: "IBM",
    platform: "Coursera",
    issued: "Jul 2026",
    credentialId: "H0134U2BZECB",
    url: "https://www.coursera.org/verify/H0134U2BZECB",
  },
  {
    title: "Exploratory Data Analysis for Machine Learning",
    issuer: "IBM",
    platform: "Coursera",
    issued: "May 2025",
    credentialId: "880ES18B29LM",
    url: "https://www.coursera.org/verify/880ES18B29LM",
  },
  {
    title: "Introduction to HTML, CSS, & JavaScript",
    issuer: "IBM",
    platform: "Coursera",
    issued: "Dec 2024",
    credentialId: "CMA0AFNAHR8U",
    url: "https://www.coursera.org/verify/CMA0AFNAHR8U",
  },
  {
    title: "Inheritance and Data Structures in Java",
    issuer: "University of Pennsylvania",
    platform: "Coursera",
    issued: "May 2024",
    credentialId: "7QTTYYY947RB",
    url: "https://www.coursera.org/verify/7QTTYYY947RB",
  },
  {
    title: "Introduction to Java",
    issuer: "LearnQuest",
    platform: "Coursera",
    issued: "Jan 2024",
    credentialId: "8335SL89UEBG",
    url: "https://www.coursera.org/verify/8335SL89UEBG",
  },
];

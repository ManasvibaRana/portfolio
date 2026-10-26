export const site = {
  name: "Manasviba Rana",
  firstName: "Manasviba",
  studioName: "Manasviba's Studio",
  role: "Jr. Software Engineer",
  tagline: "Jr. Software Engineer working on Python, AI and backend systems",
  about:
    "Final-year B.E. Computer Engineering student (2023-2027), CGPA 9.0/10, already working full-time as a Jr. Software Engineer. I build backend APIs, AI-powered features and automation workflows. Comfortable in Python and Java.",
  education: {
    degree: "B.E. Computer Engineering",
    years: "2023-2027",
    cgpa: "9.0/10",
  },
  email: "manasvibar@gmail.com",
  socials: {
    github: "https://github.com/ManasvibaRana",
    linkedin: "https://www.linkedin.com/in/manasviba-rana",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

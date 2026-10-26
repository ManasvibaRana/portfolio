export type SkillIcon = "code" | "server" | "layout" | "database" | "brain" | "bolt" | "cpu";

export interface SkillCategory {
  id: string;
  name: string;
  /** Short line shown on the book cover. */
  blurb: string;
  /** Book-spine color (also used on the 3D bookshelf). */
  color: string;
  icon: SkillIcon;
  skills: string[];
}

/** The tools used day to day, shown as a highlighted strip above the shelf. */
export const coreStack = ["Python", "Django", "REST APIs", "Webhooks", "PostgreSQL", "n8n", "GoHighLevel"];

// Each category is one book spine on the bookshelf.
export const skills: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    blurb: "What I think in",
    color: "#a58fe0",
    icon: "code",
    skills: ["Java", "Python", "JavaScript", "SQL"],
  },
  {
    id: "ai-ml",
    name: "AI/ML",
    blurb: "Teaching machines to see, hear and talk",
    color: "#8fb8f0",
    icon: "brain",
    skills: ["OpenCV", "YOLO", "MediaPipe", "dlib", "DeepFace", "NLP", "Gemini API", "voice-AI pipelines"],
  },
  {
    id: "backend",
    name: "Backend",
    blurb: "Where most of my work lives",
    color: "#f6a57f",
    icon: "server",
    skills: ["Node.js", "Express.js", "Django", "Flask", "REST APIs", "Webhooks"],
  },
  {
    id: "automation",
    name: "Automation & Tools",
    blurb: "Making systems talk to each other",
    color: "#f2cf6b",
    icon: "bolt",
    skills: ["GoHighLevel (GHL)", "n8n", "Git", "GitHub", "VS Code"],
  },
  {
    id: "databases",
    name: "Databases",
    blurb: "Keeping data safe and fast",
    color: "#ff9fb8",
    icon: "database",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
  },
  {
    id: "frontend",
    name: "Frontend",
    blurb: "Friendly faces for my backends",
    color: "#86d3b0",
    icon: "layout",
    skills: ["React.js", "Tailwind CSS", "HTML", "Bootstrap"],
  },
  {
    id: "fundamentals",
    name: "CS Fundamentals",
    blurb: "The foundations underneath",
    color: "#c58fc9",
    icon: "cpu",
    skills: ["DSA", "OOP", "Operating Systems", "DBMS", "Computer Networks"],
  },
];

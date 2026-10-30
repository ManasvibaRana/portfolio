export type ProjectArt = "voice-agent" | "vision-lab" | "kanban" | "mood-wave" | "face-mesh" | "hand-tracking" | "code";

export interface Project {
  slug: string;
  title: string;
  /** One punchy line shown under the title. */
  tagline: string;
  description: string;
  /** 2-4 very short feature labels (2-4 words each), shown as pills. */
  highlights: string[];
  tags: string[];
  /** Small label above the title, e.g. "AI · Full-stack". */
  category: string;
  /** Optional extra badge, e.g. "Team project". */
  badge?: string;
  /** Card accent color (pastel). */
  accent: string;
  /** Which illustration to draw on the card (see components/sections/ProjectArt.tsx). */
  art: ProjectArt;
  /** Featured projects get the large card. */
  featured?: boolean;
  github: string;
}

// Ordered by impact — the first entries are shown biggest. Add a project by
// appending an object; use art: "code" if none of the illustrations fit.
export const projects: Project[] = [
  {
    slug: "voice-virtual-assistant",
    title: "Voice-Enabled Virtual Assistant",
    tagline: "Ask your college anything, out loud",
    description:
      "Speak a question and an LLM picks the right tool, then answers out loud.",
    highlights: [
      "LLM tool routing",
      "Safe text-to-SQL",
      "Row-level security",
      "115 tests",
    ],
    tags: ["Python", "FastAPI", "faster-whisper", "Llama 3.1", "Chroma", "SQLite", "Docker", "pytest"],
    category: "Voice AI · Backend",
    accent: "#ffe3a3",
    art: "voice-agent",
    featured: true,
    github: "https://github.com/ManasvibaRana/Voice-Enabled-Virtual-Assistance",
  },
  {
    slug: "py-playground",
    title: "PY Playground",
    tagline: "An all-in-one AI lab in the browser",
    description:
      "Computer-vision and generative-AI tools side by side in one web app.",
    highlights: [
      "Object detection",
      "Face + emotion AI",
      "Gesture control",
      "Gemini tutor",
    ],
    tags: ["Python", "Django REST", "React", "YOLOv8", "OpenCV", "face_recognition", "Gemini API"],
    category: "AI · Full-stack",
    accent: "#c9b6f0",
    art: "vision-lab",
    featured: true,
    github: "https://github.com/ManasvibaRana/PyPlayground",
  },
  {
    slug: "assetflow",
    title: "AssetFlow",
    tagline: "Enterprise asset management, end to end",
    description:
      "Track, assign, book and audit every asset in an organisation.",
    highlights: [
      "Role-based access",
      "Room booking",
      "Kanban approvals",
      "KPI dashboard",
    ],
    tags: ["FastAPI", "Python", "PostgreSQL", "SQLAlchemy", "Next.js", "TypeScript", "Tailwind CSS"],
    category: "Backend · Full-stack",
    badge: "Hackathon build",
    accent: "#ffc9a8",
    art: "kanban",
    featured: true,
    github: "https://github.com/ManasvibaRana/AssetFlow-Enterprise-Asset-Resource-Management-System",
  },
  {
    slug: "neuroflow",
    title: "NeuroFlow",
    tagline: "A calm, focused wellness companion",
    description:
      "A 7-module wellness and productivity app with NLP mood insights.",
    highlights: [
      "Mood analytics",
      "Habit tracking",
      "Pomodoro timer",
    ],
    tags: ["Django", "DRF", "Preact", "Tailwind CSS", "Chart.js", "NLP"],
    category: "Full-stack · NLP",
    badge: "Team project",
    accent: "#b8ead2",
    art: "mood-wave",
    github: "https://github.com/ManasvibaRana/Neuroflow",
  },
  {
    slug: "face-recognition-attendance",
    title: "Face Recognition Attendance",
    tagline: "Attendance that marks itself",
    description:
      "Recognises your face, then waits for a blink so a photo can't cheat.",
    highlights: [
      "90%+ blink accuracy",
      "Live recognition",
      "Excel logs",
    ],
    tags: ["Python", "OpenCV", "dlib", "face_recognition", "pandas"],
    category: "Computer Vision",
    accent: "#ffb3c7",
    art: "face-mesh",
    github: "https://github.com/ManasvibaRana/Smart_Attendace_System",
  },
  {
    slug: "hand-gesture-controller",
    title: "Hand Gesture Controller",
    tagline: "Swipe the air, press the keys",
    description:
      "Swipe your hand at the webcam to press arrow keys, hands-free.",
    highlights: [
      "Hand tracking",
      "Swipe to arrow keys",
    ],
    tags: ["Python", "OpenCV", "cvzone", "MediaPipe", "PyAutoGUI"],
    category: "Computer Vision",
    accent: "#bfe3ff",
    art: "hand-tracking",
    github: "https://github.com/ManasvibaRana/hand-gesture-controller",
  },
];

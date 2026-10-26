export type ProjectArt = "voice-agent" | "vision-lab" | "kanban" | "mood-wave" | "face-mesh" | "hand-tracking" | "code";

export interface Project {
  slug: string;
  title: string;
  /** One punchy line shown under the title. */
  tagline: string;
  description: string;
  /** 2–4 concrete things the project does. */
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
      "A voice assistant for a college: speak or type a question and an LLM router picks the right tool (student records, policy documents, timetable or reminders), then answers in a short spoken reply.",
    highlights: [
      "Speech-to-text with faster-whisper, LLM tool routing and spoken replies",
      "Safe text-to-SQL: SELECT-only, read-only connection, row caps and a repair retry",
      "Row-level security so each student only sees their own records (JWT + bcrypt)",
      "RAG over college policies, per-stage latency timings and 115 offline tests",
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
      "Full-stack playground where computer-vision and generative-AI tools live side by side. Each capability is its own Django app behind a React UI.",
    highlights: [
      "YOLOv8 object detection and pose estimation",
      "Face recognition trained from your own photos, plus live emotion detection",
      "Hand-gesture control of the computer",
      "Gemini-powered Python tutor and collaborative projects with group chat",
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
      "ERP-style platform to register, allocate, book, maintain and audit an organisation's assets, with role-based access for four kinds of users.",
    highlights: [
      "Asset lifecycle registry with transfers and double-allocation blocking",
      "Room booking with overlap checks and Kanban maintenance approvals",
      "JWT auth, role-based access and SMTP notifications",
      "Audit cycles, KPI dashboard and CSV reports",
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
      "7-module wellness & productivity platform with NLP mood analytics, a Django REST backend and a Vite + Preact frontend.",
    highlights: [
      "Journaling with images, calendar history and NLP mood analytics",
      "Habit tracking, Pomodoro timer and Eisenhower-matrix boards",
      "Chart.js insights, community posts and SMTP notifications",
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
      "Real-time webcam attendance: recognises a face, then waits for a blink to prove it's a live person and not a photo.",
    highlights: [
      "90%+ blink-detection accuracy using dlib's 68 facial landmarks",
      "Live webcam face recognition against a folder of known faces",
      "Logs name, date and time to Excel, once per person per day",
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
      "Touch-free control: swipe your hand in front of the webcam and it presses the arrow keys, so you can play games or flip through slides without touching the keyboard.",
    highlights: [
      "Real-time hand tracking with cvzone (MediaPipe)",
      "Swipes left, right, up and down become arrow-key presses",
    ],
    tags: ["Python", "OpenCV", "cvzone", "MediaPipe", "PyAutoGUI"],
    category: "Computer Vision",
    accent: "#bfe3ff",
    art: "hand-tracking",
    github: "https://github.com/ManasvibaRana/hand-gesture-controller",
  },
];

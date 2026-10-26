export type ObjectId = "laptop" | "whiteboard" | "bookshelf" | "trophies" | "mailbox" | "speaker";

export type Vec3 = [number, number, number];

export interface CameraShot {
  position: Vec3;
  target: Vec3;
}

export interface SceneObject {
  id: ObjectId;
  /** Floating hover label. */
  label: string;
  /** Overlay section this object opens. */
  section: string;
  /** Camera shot used when the object is opened. */
  camera: CameraShot;
}

export const HOME_CAMERA: CameraShot = {
  position: [9.5, 7.8, 9.5],
  target: [0, 1.3, -0.4],
};

export const sceneObjects: Record<ObjectId, SceneObject> = {
  laptop: {
    id: "laptop",
    label: "Projects",
    section: "Projects",
    // high over her right shoulder, looking down at the screen
    camera: { position: [-0.9, 3.4, -3.3], target: [0.45, 1.05, -1.8] },
  },
  whiteboard: {
    id: "whiteboard",
    label: "Experience",
    section: "Experience",
    camera: { position: [-1.0, 2.4, 0.6], target: [-1.6, 2.2, -3.5] },
  },
  bookshelf: {
    id: "bookshelf",
    label: "Skills",
    section: "Skills",
    camera: { position: [1.4, 1.9, 0.3], target: [-3.3, 1.2, -0.3] },
  },
  trophies: {
    id: "trophies",
    label: "Achievements",
    section: "Achievements",
    camera: { position: [-0.6, 2.6, 2.4], target: [-3.3, 2.35, 1.7] },
  },
  mailbox: {
    id: "mailbox",
    label: "Contact",
    section: "Contact",
    camera: { position: [2.6, 2.1, 0.4], target: [1.25, 1.1, -1.45] },
  },
  speaker: {
    id: "speaker",
    label: "About me",
    section: "About",
    camera: { position: [0.9, 2.0, 0.3], target: [-0.45, 1.1, -1.35] },
  },
};

export const objectOrder: ObjectId[] = ["laptop", "whiteboard", "bookshelf", "trophies", "mailbox", "speaker"];

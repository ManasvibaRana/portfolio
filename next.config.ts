import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import path from "node:path";

// Detect the optional character model once at dev-server start / build time.
// Drop public/models/character.glb in and restart `npm run dev` to switch from
// the procedural placeholder to the real character — no code changes needed.
const hasCharacterModel = existsSync(path.join(process.cwd(), "public", "models", "character.glb"));
// Optional real meow recording for the cat (otherwise it's synthesized).
const hasMeowSound = existsSync(path.join(process.cwd(), "public", "sounds", "meow.mp3"));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Lets a production build run alongside `next dev` (e.g. NEXT_DIST_DIR=.next-build).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    NEXT_PUBLIC_HAS_CHARACTER_MODEL: hasCharacterModel ? "1" : "0",
    NEXT_PUBLIC_HAS_MEOW_SOUND: hasMeowSound ? "1" : "0",
  },
};

export default nextConfig;

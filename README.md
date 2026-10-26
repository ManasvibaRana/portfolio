# Manasviba's Studio

A cozy pastel 3D portfolio room built with Next.js (App Router), TypeScript, Tailwind CSS,
React Three Fiber + drei, GSAP (camera moves), Framer Motion (panels) and Lenis (smooth scroll).

- **3D studio** — click room objects (or use the dock / keyboard) to fly the camera there and open a section.
- **Recruiter mode** — a fast, server-rendered 2D page with the same content. This is what search engines
  index, and it's used automatically on weak devices, when WebGL is unavailable, and for crawlers.

## Local setup

Requires **Node.js 20.9+** (https://nodejs.org, LTS installer).

```bash
npm install
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000.

> **Windows tip:** if PowerShell says `running scripts is disabled on this system`, run once:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` (or use `npm.cmd` instead of `npm`).

Useful URLs while developing:

- `/?mode=3d` — force the 3D studio
- `/?mode=recruiter` — force Recruiter mode

Your last choice is remembered in the browser (localStorage key `studio-mode`).

## Editing content

All content lives in [`data/`](data/):

| File | What it holds |
| --- | --- |
| `data/site.ts` | Name, tagline, about, education, email, social links |
| `data/projects.ts` | Project cards — append an object to add a project |
| `data/experience.ts` | Experience timeline (role, dates, bullets) |
| `data/skills.ts` | Skill categories (each one is a book spine on the 3D bookshelf) |
| `data/achievements.ts` | Achievements (trophy shelf) |
| `data/sceneObjects.ts` | Room objects: labels and camera shots |

## Project structure

```
app/
  api/contact/route.ts   Contact form → Resend
  layout.tsx             Fonts, metadata, inline boot script (picks mode + theme before paint)
  page.tsx               Recruiter page (SSR) + 3D layer + JSON-LD
  opengraph-image.tsx    Generated Open Graph image
  sitemap.ts, robots.ts, icon.svg
components/
  Character.tsx          Loads public/models/character.glb, or the procedural placeholder
  StudioApp.tsx          3D layer: HUD, boot screen, dock, panel
  overlay/               BootScreen (laptop booting), Dock, Panel
  recruiter/             Recruiter page, theme / mode buttons, Lenis
  sections/              Content sections shared by both modes
  three/                 Canvas, scene, lights, camera rig, room and objects (all procedural)
data/                    All site content
lib/                     Store, mode/theme state, boot script, palette, helpers
public/models/           Drop character.glb here
```

## Adding your character (character.glb)

1. Make the character in VRoid Studio, rig and animate it with Mixamo, and combine the clips in Blender.
2. Name the animation clips exactly **`Idle`**, **`Typing`** and **`Wave`**.
   - `Wave` plays once after loading, then `Typing` loops.
   - `Idle` plays while a panel is open, and when the visitor prefers reduced motion.
3. Export as `.glb` (Draco or meshopt compression both work) to `public/models/character.glb`.
4. Restart `npm run dev` (the file is detected at startup). The placeholder is replaced automatically.
5. If she sits too high/low or faces the wrong way, tweak `MODEL_TRANSFORM` in `components/Character.tsx`.
   The model's origin should be at floor level under the chair seat, facing +Z (toward the desk).

If the GLB fails to load, the site falls back to the placeholder instead of breaking.

## Contact form (Resend)

1. Create a free account at https://resend.com and an API key.
2. Put it in `.env.local` as `RESEND_API_KEY=...`.
3. Without a verified domain, Resend's test sender `onboarding@resend.dev` only delivers to the email address
   your Resend account was created with — so sign up with `manasvibar@gmail.com`. To send from your own
   domain, verify it in Resend and set `CONTACT_FROM_EMAIL="Portfolio <hello@yourdomain.com>"`.

Without a key, the form shows a friendly error and the "Open in email app" (mailto) button still works.

## Deploying to Vercel (free Hobby plan)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new, import the repository (framework preset: **Next.js**, defaults are fine).
3. Under **Environment Variables** add:
   - `RESEND_API_KEY` — your Resend key
   - `NEXT_PUBLIC_SITE_URL` — your final URL, e.g. `https://manasviba.vercel.app`
   - `CONTACT_FROM_EMAIL` — optional, see above
4. Click **Deploy**. After the first deploy, update `NEXT_PUBLIC_SITE_URL` if the URL changed and redeploy
   (it's used for canonical URLs, the sitemap and Open Graph tags).

Every push to `main` redeploys automatically.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |

## Fun extras in the room

- **Lo-fi music** (music-note button, or press **M**): generated live with the Web Audio API in `lib/lofi.ts`,
  so there are no audio files or licences. Off by default; the speaker's sound rings pulse along while it plays.
- **Sleepy cat** on the beanbag (`components/three/Cat.tsx`): click it to wake it up for a purr.
- **Steam** rising from the coffee mug.
- **Keyboard shortcuts:** **1-6** open the sections, **N** day/night, **M** music, **Esc** back to the room.

## Accessibility & performance notes

- Every room object is reachable from the dock (Tab / Enter); focusing a dock button highlights the object in 3D.
  Panels close with Escape or "Back to room", and focus returns to where it was.
- `prefers-reduced-motion`: no wave, bob, parallax, dust drift or camera flights (instant cuts).
- Mobile: no shadows, fewer particles, capped pixel ratio; resolution drops further if frame rate falls,
  and a phone that still can't keep up switches to Recruiter mode.
- Recruiter mode never downloads three.js.

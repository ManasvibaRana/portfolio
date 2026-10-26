"use client";

import { useEffect, useState } from "react";
import { CubeIcon, MoonIcon, SunIcon } from "@/components/icons";
import { hasWebGL } from "@/lib/device";
import { setMode } from "@/lib/mode";
import { setDark, useDark } from "@/lib/theme";

export function ThemeToggle() {
  const dark = useDark();
  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-btn"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export function StudioButton() {
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(hasWebGL()), []);

  return (
    <button
      type="button"
      onClick={() => setMode("3d")}
      disabled={!supported}
      title={supported ? "Explore the interactive 3D studio" : "Your browser doesn't support WebGL"}
      className="btn btn-primary"
    >
      <CubeIcon width={16} height={16} />
      <span className="hidden sm:inline">Enter 3D studio</span>
      <span className="sm:hidden">3D</span>
    </button>
  );
}

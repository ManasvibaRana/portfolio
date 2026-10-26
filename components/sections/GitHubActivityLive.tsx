"use client";

import { useEffect, useState } from "react";
import type { GitHubActivity as Activity } from "@/lib/github";
import GitHubActivity from "./GitHubActivity";

/** Client version for the 3D panel: loads the cached data from /api/github. */
export default function GitHubActivityLive() {
  const [data, setData] = useState<Activity | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((json: Activity | null) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-display text-xl font-semibold">On GitHub</h3>
      <GitHubActivity data={data} />
    </div>
  );
}

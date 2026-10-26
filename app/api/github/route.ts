import { NextResponse } from "next/server";
import { getGitHubActivity } from "@/lib/github";

// Used by the 3D Projects panel; cached and refreshed once a day.
export const revalidate = 86400;

export async function GET() {
  const activity = await getGitHubActivity();
  return NextResponse.json(activity, { status: activity ? 200 : 503 });
}

import GitHubActivityLive from "./GitHubActivityLive";
import ProjectsGrid from "./ProjectsGrid";

/** Laptop panel in 3D mode: project cards followed by live GitHub activity. */
export default function ProjectsPanel() {
  return (
    <>
      <ProjectsGrid />
      <GitHubActivityLive />
    </>
  );
}

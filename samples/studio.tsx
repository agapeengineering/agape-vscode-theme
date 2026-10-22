// Visual fixture only: React dependencies are deliberately not installed.
type Project = { name: string; progress: number; active: boolean };

export function ProjectCard({ project }: { project: Project }) {
  const percent = Math.round(project.progress * 100);
  return (
    <article aria-label={project.name}>
      <h2>{project.name}</h2>
      <progress value={percent} max={100} />
      <p>{project.active ? 'In progress' : 'Paused'}</p>
    </article>
  );
}

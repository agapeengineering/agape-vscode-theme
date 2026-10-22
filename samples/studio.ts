// Comments should stay comfortable during a long editing session.
type Status = 'active' | 'paused';

interface Project {
  readonly name: string;
  progress: number;
  status: Status;
}

export class Studio {
  private projects: Project[] = [];

  add(project: Project): void {
    this.projects.push(project);
  }

  describe(): string[] {
    return this.projects
      .filter(({ status }) => status === 'active')
      .map(({ name, progress }) => `${name}: ${Math.round(progress * 100)}%`);
  }
}

const studio = new Studio();
studio.add({ name: 'A useful idea', progress: 0.75, status: 'active' });
console.log(studio.describe());

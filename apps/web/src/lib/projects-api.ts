import type { ProjectRecord } from '@lanceflow/operations';

export function serializeProject(project: ProjectRecord) {
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

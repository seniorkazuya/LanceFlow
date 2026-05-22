import type { ProjectRecord, ProjectStatus } from '../projects/types';

/** Statuses shown on the ops workflow dashboard. */
export const OPS_WORKFLOW_STATUSES: readonly ProjectStatus[] = [
  'pending_approval',
  'active',
] as const;

export function countProjectsByStatus(
  projects: ProjectRecord[]
): Partial<Record<ProjectStatus, number>> {
  const counts: Partial<Record<ProjectStatus, number>> = {};
  for (const p of projects) {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  }
  return counts;
}

export function filterWorkflowProjects(projects: ProjectRecord[]): ProjectRecord[] {
  const allowed = new Set<string>(OPS_WORKFLOW_STATUSES);
  return projects
    .filter((p) => allowed.has(p.status))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

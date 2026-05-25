import type { ProjectMilestoneRecord } from '@lanceflow/payments';

export function serializeProjectMilestone(m: ProjectMilestoneRecord) {
  return {
    id: m.id,
    projectId: m.projectId,
    label: m.label,
    percentPct: m.percentPct,
    sortOrder: m.sortOrder,
  };
}

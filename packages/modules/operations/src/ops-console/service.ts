import { prisma } from '@lanceflow/database';

import { utcReportDate } from '../daily-reports/date';
import { listMissingDailyReports } from '../daily-reports/service';
import { listProjects } from '../projects/service';
import { countProjectsByStatus, filterWorkflowProjects } from './summarize';
import type { OpsConsoleAssignment, OpsConsoleSnapshot } from './types';

export async function getOpsConsoleSnapshot(): Promise<OpsConsoleSnapshot> {
  const reportDate = utcReportDate();
  const dateLabel = reportDate.toISOString().slice(0, 10);

  const [projects, missingReports, assignmentRows] = await Promise.all([
    listProjects(),
    listMissingDailyReports(reportDate),
    prisma.assignment.findMany({
      where: {
        releasedAt: null,
        project: { status: { in: ['pending_approval', 'active'] } },
      },
      include: {
        user: { select: { displayName: true } },
        project: { include: { client: { select: { name: true } } } },
      },
      orderBy: [{ project: { title: 'asc' } }, { assignedAt: 'desc' }],
    }),
  ]);

  const activeAssignments: OpsConsoleAssignment[] = assignmentRows.map((row) => ({
    id: row.id,
    projectId: row.projectId,
    projectTitle: row.project.title,
    clientName: row.project.client.name,
    engineerName: row.user.displayName,
    skillScore: row.skillScore,
    assignedAt: row.assignedAt,
  }));

  return {
    reportDate: dateLabel,
    projectCounts: countProjectsByStatus(projects),
    workflowProjects: filterWorkflowProjects(projects),
    missingReports,
    activeAssignments,
  };
}

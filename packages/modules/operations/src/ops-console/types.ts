import type { MissingDailyReport } from '../daily-reports/types';
import type { ProjectRecord, ProjectStatus } from '../projects/types';

export type OpsConsoleAssignment = {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  engineerName: string;
  skillScore: number | null;
  assignedAt: Date;
};

export type OpsConsoleSnapshot = {
  reportDate: string;
  projectCounts: Partial<Record<ProjectStatus, number>>;
  workflowProjects: ProjectRecord[];
  missingReports: MissingDailyReport[];
  activeAssignments: OpsConsoleAssignment[];
};

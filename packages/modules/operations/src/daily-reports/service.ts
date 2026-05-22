import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { utcReportDate } from './date';
import type {
  DailyReportRecord,
  EngineerAssignmentOption,
  MissingDailyReport,
  SubmitDailyReportInput,
} from './types';
import { validateSubmitDailyReportInput } from './validate';

const ACTIVE_PROJECT_STATUSES = ['active'] as const;

function toRecord(row: {
  id: string;
  userId: string;
  projectId: string;
  reportDate: Date;
  hours: number;
  progressPct: number;
  issues: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { displayName: string };
  project: { title: string };
}): DailyReportRecord {
  return {
    id: row.id,
    userId: row.userId,
    projectId: row.projectId,
    projectTitle: row.project.title,
    engineerName: row.user.displayName,
    reportDate: row.reportDate,
    hours: row.hours,
    progressPct: row.progressPct,
    issues: row.issues,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listEngineerAssignmentOptions(
  userId: string
): Promise<EngineerAssignmentOption[]> {
  const rows = await prisma.assignment.findMany({
    where: {
      userId,
      releasedAt: null,
      project: { status: { in: [...ACTIVE_PROJECT_STATUSES] } },
    },
    include: { project: { include: { client: { select: { name: true } } } } },
    orderBy: { project: { title: 'asc' } },
  });

  return rows.map((row) => ({
    projectId: row.projectId,
    projectTitle: row.project.title,
    clientName: row.project.client.name,
  }));
}

export async function listReportsForUserOnDate(
  userId: string,
  reportDate = utcReportDate()
): Promise<DailyReportRecord[]> {
  const rows = await prisma.dailyReport.findMany({
    where: { userId, reportDate },
    include: {
      user: { select: { displayName: true } },
      project: { select: { title: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toRecord);
}

export type DailyReportMutationResult =
  | { ok: true; report: DailyReportRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function submitDailyReport(
  userId: string,
  input: SubmitDailyReportInput,
  actorId: string
): Promise<DailyReportMutationResult> {
  const errors = validateSubmitDailyReportInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const reportDate = input.reportDate ? utcReportDate(input.reportDate) : utcReportDate();

  const assignment = await prisma.assignment.findFirst({
    where: {
      userId,
      projectId: input.projectId,
      releasedAt: null,
      project: { status: { in: [...ACTIVE_PROJECT_STATUSES] } },
    },
  });
  if (!assignment) {
    return {
      ok: false,
      errors: [{ field: 'projectId', message: 'No active assignment on this project' }],
    };
  }

  const row = await prisma.dailyReport.upsert({
    where: {
      userId_projectId_reportDate: {
        userId,
        projectId: input.projectId,
        reportDate,
      },
    },
    create: {
      userId,
      projectId: input.projectId,
      reportDate,
      hours: input.hours,
      progressPct: input.progressPct,
      issues: input.issues?.trim() || null,
    },
    update: {
      hours: input.hours,
      progressPct: input.progressPct,
      issues: input.issues?.trim() || null,
    },
    include: {
      user: { select: { displayName: true } },
      project: { select: { title: true } },
    },
  });

  const report = toRecord(row);
  await auditLog({
    actorId,
    action: 'daily_report.submit',
    entityType: 'daily_report',
    entityId: report.id,
    payload: {
      projectId: report.projectId,
      reportDate: report.reportDate.toISOString().slice(0, 10),
      hours: report.hours,
      progressPct: report.progressPct,
    },
  });

  return { ok: true, report };
}

/** Active assignments without a report for the given UTC day (Ops oversight). */
export async function listMissingDailyReports(
  reportDate = utcReportDate()
): Promise<MissingDailyReport[]> {
  const assignments = await prisma.assignment.findMany({
    where: {
      releasedAt: null,
      project: { status: { in: [...ACTIVE_PROJECT_STATUSES] } },
    },
    include: {
      user: { select: { id: true, displayName: true, email: true } },
      project: { include: { client: { select: { name: true } } } },
    },
  });

  if (assignments.length === 0) return [];

  const reported = await prisma.dailyReport.findMany({
    where: {
      reportDate,
      userId: { in: assignments.map((a) => a.userId) },
      projectId: { in: assignments.map((a) => a.projectId) },
    },
    select: { userId: true, projectId: true },
  });

  const reportedKeys = new Set(reported.map((r) => `${r.userId}:${r.projectId}`));

  return assignments
    .filter((a) => !reportedKeys.has(`${a.userId}:${a.projectId}`))
    .map((a) => ({
      userId: a.user.id,
      engineerName: a.user.displayName,
      engineerEmail: a.user.email,
      projectId: a.projectId,
      projectTitle: a.project.title,
      clientName: a.project.client.name,
      reportDate,
    }))
    .sort((a, b) => a.engineerName.localeCompare(b.engineerName));
}

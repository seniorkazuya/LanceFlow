import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { parsePaymentDueDate } from '../schedules/validate';
import { syncMilestoneLinkedSchedules } from './sync';
import type { ProjectMilestoneRecord, SetProjectMilestonesInput } from './types';
import { validateProjectMilestones } from './validate';

function toRecord(row: {
  id: string;
  projectId: string;
  label: string;
  percentPct: number;
  dueDate: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): ProjectMilestoneRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    label: row.label,
    percentPct: row.percentPct,
    dueDate: row.dueDate,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export type SetProjectMilestonesResult =
  | {
      ok: true;
      milestones: ProjectMilestoneRecord[];
      totalPercent: 100;
      scheduleSync: { created: number; updated: number; removed: number };
    }
  | { ok: false; errors: { field: string; message: string }[] };

export async function listProjectMilestones(
  projectId: string
): Promise<ProjectMilestoneRecord[] | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const rows = await prisma.projectMilestone.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map(toRecord);
}

/** Replace all milestones for a project — validated to sum to 100% (PAY-001). */
export async function setProjectMilestones(
  projectId: string,
  input: SetProjectMilestonesInput,
  actorId: string
): Promise<SetProjectMilestonesResult> {
  const errors = validateProjectMilestones(input.milestones);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  const milestones = await prisma.$transaction(async (tx) => {
    await tx.paymentSchedule.deleteMany({
      where: { projectId, milestoneId: { not: null } },
    });
    await tx.projectMilestone.deleteMany({ where: { projectId } });

    const created = [];
    for (let i = 0; i < input.milestones.length; i += 1) {
      const m = input.milestones[i];
      const dueRaw = m.dueDate?.trim() ?? '';
      const dueDate = dueRaw ? parsePaymentDueDate(dueRaw) : null;
      const row = await tx.projectMilestone.create({
        data: {
          projectId,
          label: m.label.trim(),
          percentPct: m.percentPct,
          sortOrder: i,
          dueDate: dueDate ?? undefined,
        },
      });
      created.push({ row, input: m });
    }
    return created;
  });

  const records = milestones.map(({ row }) => toRecord(row));

  const scheduleSync = await syncMilestoneLinkedSchedules(
    projectId,
    milestones.map(({ row, input: m }) => ({
      id: row.id,
      label: row.label,
      dueDate: row.dueDate,
      amountCents:
        m.dueDate?.trim() && m.amountCents != null && m.amountCents > 0 ? m.amountCents : null,
    })),
    actorId
  );

  await auditLog({
    actorId,
    action: 'project_milestones.set',
    entityType: 'project',
    entityId: projectId,
    payload: {
      count: records.length,
      milestones: records.map((m) => ({
        label: m.label,
        percentPct: m.percentPct,
        dueDate: m.dueDate?.toISOString().slice(0, 10) ?? null,
      })),
      totalPercent: 100,
      scheduleSync,
    },
  });

  return { ok: true, milestones: records, totalPercent: 100, scheduleSync };
}

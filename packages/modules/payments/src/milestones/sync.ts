import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

export type MilestoneScheduleSyncRow = {
  id: string;
  dueDate: Date | null;
  amountCents: number | null;
  label: string;
};

export type MilestoneScheduleSyncResult = {
  created: number;
  updated: number;
  removed: number;
};

/** PAY-003 — upsert milestone-linked payment schedules for AUTO-005 reminders. */
export async function syncMilestoneLinkedSchedules(
  projectId: string,
  milestones: MilestoneScheduleSyncRow[],
  actorId: string
): Promise<MilestoneScheduleSyncResult> {
  let created = 0;
  let updated = 0;
  let removed = 0;

  const milestoneIds = milestones.map((m) => m.id);

  const orphanDeletes = await prisma.paymentSchedule.deleteMany({
    where: {
      projectId,
      milestoneId:
        milestoneIds.length > 0 ? { not: null, notIn: milestoneIds } : { not: null },
    },
  });
  removed += orphanDeletes.count;

  for (const milestone of milestones) {
    if (!milestone.dueDate || !milestone.amountCents) {
      const deleted = await prisma.paymentSchedule.deleteMany({
        where: { milestoneId: milestone.id },
      });
      removed += deleted.count;
      continue;
    }

    const existing = await prisma.paymentSchedule.findUnique({
      where: { milestoneId: milestone.id },
    });

    if (existing) {
      await prisma.paymentSchedule.update({
        where: { id: existing.id },
        data: {
          dueDate: milestone.dueDate,
          amountCents: milestone.amountCents,
          notes: `Milestone: ${milestone.label}`,
        },
      });
      updated += 1;
    } else {
      await prisma.paymentSchedule.create({
        data: {
          projectId,
          milestoneId: milestone.id,
          dueDate: milestone.dueDate,
          amountCents: milestone.amountCents,
          notes: `Milestone: ${milestone.label}`,
        },
      });
      created += 1;
    }
  }

  if (created > 0 || updated > 0 || removed > 0) {
    await auditLog({
      actorId,
      action: 'project_milestones.sync_schedules',
      entityType: 'project',
      entityId: projectId,
      payload: { created, updated, removed },
    });
  }

  return { created, updated, removed };
}

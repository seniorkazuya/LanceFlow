import { notifyOpsManagers } from '@lanceflow/automation';
import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import type { PaymentScheduleRecord } from '../schedules/types';
import {
  daysOverdueUtc,
  escalationActionForLevel,
  targetEscalationLevelForOverdue,
} from './compute';

export const PAYMENT_ESCALATION_SYSTEM_ACTOR = 'system:payment-escalation';

export type PaymentEscalationUpdate = {
  scheduleId: string;
  projectId: string;
  fromLevel: number;
  toLevel: number;
  daysOverdue: number;
};

export type ProcessPaymentEscalationsResult = {
  scanned: number;
  updated: PaymentEscalationUpdate[];
};

export async function processPaymentEscalations(
  asOf: Date = new Date(),
  actorId: string = PAYMENT_ESCALATION_SYSTEM_ACTOR
): Promise<ProcessPaymentEscalationsResult> {
  const rows = await prisma.paymentSchedule.findMany({
    where: { status: 'scheduled' },
    orderBy: { dueDate: 'asc' },
  });

  const updated: PaymentEscalationUpdate[] = [];

  for (const row of rows) {
    const daysOverdue = daysOverdueUtc(row.dueDate, asOf);
    const targetLevel = targetEscalationLevelForOverdue(daysOverdue);
    if (targetLevel === null || targetLevel <= row.escalationLevel) continue;

    await prisma.paymentSchedule.update({
      where: { id: row.id },
      data: { escalationLevel: targetLevel },
    });

    const change: PaymentEscalationUpdate = {
      scheduleId: row.id,
      projectId: row.projectId,
      fromLevel: row.escalationLevel,
      toLevel: targetLevel,
      daysOverdue,
    };
    updated.push(change);

    await auditLog({
      actorId,
      action: escalationActionForLevel(targetLevel),
      entityType: 'payment_schedule',
      entityId: row.id,
      payload: {
        projectId: row.projectId,
        dueDate: row.dueDate.toISOString().slice(0, 10),
        daysOverdue,
        fromLevel: row.escalationLevel,
        toLevel: targetLevel,
        amountCents: row.amountCents,
      },
    });
  }

  if (updated.length > 0) {
    await auditLog({
      actorId,
      action: 'payment_escalation.batch',
      entityType: 'job',
      entityId: 'payment-escalation',
      payload: {
        asOf: asOf.toISOString(),
        scanned: rows.length,
        updatedCount: updated.length,
        scheduleIds: updated.map((u) => u.scheduleId),
      },
    });

    await notifyOpsManagers(
      {
        type: 'payment_escalation',
        title: 'Payment escalation updates',
        body: `${updated.length} payment schedule(s) escalated. Review overdue client payments.`,
        metadata: { updatedCount: updated.length, asOf: asOf.toISOString() },
        sendEmail: process.env.PAYMENT_ESCALATION_NOTIFY_EMAIL === 'true',
      },
      actorId
    );
  }

  return { scanned: rows.length, updated };
}

/** Preview without writes (tests / ops dry-run). */
export function previewPaymentEscalations(
  schedules: Pick<PaymentScheduleRecord, 'id' | 'projectId' | 'dueDate' | 'escalationLevel' | 'status'>[],
  asOf: Date
): PaymentEscalationUpdate[] {
  const updates: PaymentEscalationUpdate[] = [];
  for (const row of schedules) {
    if (row.status !== 'scheduled') continue;
    const daysOverdue = daysOverdueUtc(row.dueDate, asOf);
    const targetLevel = targetEscalationLevelForOverdue(daysOverdue);
    if (targetLevel === null || targetLevel <= row.escalationLevel) continue;
    updates.push({
      scheduleId: row.id,
      projectId: row.projectId,
      fromLevel: row.escalationLevel,
      toLevel: targetLevel,
      daysOverdue,
    });
  }
  return updates;
}

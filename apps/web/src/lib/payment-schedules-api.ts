import type { PaymentScheduleRecord } from '@lanceflow/payments';

export function serializePaymentSchedule(schedule: PaymentScheduleRecord) {
  return {
    id: schedule.id,
    projectId: schedule.projectId,
    dueDate: schedule.dueDate.toISOString().slice(0, 10),
    amountCents: schedule.amountCents,
    currency: schedule.currency,
    status: schedule.status,
    escalationLevel: schedule.escalationLevel,
    paidAt: schedule.paidAt?.toISOString() ?? null,
    notes: schedule.notes,
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
  };
}

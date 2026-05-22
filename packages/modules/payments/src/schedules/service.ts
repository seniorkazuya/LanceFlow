import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import type {
  CreatePaymentScheduleInput,
  PaymentScheduleRecord,
  PaymentScheduleStatus,
  UpdatePaymentScheduleInput,
} from './types';
import {
  parsePaymentDueDate,
  validateCreatePaymentScheduleInput,
  validateUpdatePaymentScheduleInput,
} from './validate';

function toRecord(row: {
  id: string;
  projectId: string;
  dueDate: Date;
  amountCents: number;
  currency: string;
  status: string;
  escalationLevel: number;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): PaymentScheduleRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    dueDate: row.dueDate,
    amountCents: row.amountCents,
    currency: row.currency,
    status: row.status as PaymentScheduleStatus,
    escalationLevel: row.escalationLevel,
    paidAt: row.paidAt,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export type PaymentScheduleMutationResult =
  | { ok: true; schedule: PaymentScheduleRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function listPaymentSchedulesForProject(
  projectId: string
): Promise<PaymentScheduleRecord[] | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const rows = await prisma.paymentSchedule.findMany({
    where: { projectId },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map(toRecord);
}

export async function createPaymentSchedule(
  projectId: string,
  input: CreatePaymentScheduleInput,
  actorId: string
): Promise<PaymentScheduleMutationResult> {
  const errors = validateCreatePaymentScheduleInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  const dueDate = parsePaymentDueDate(input.dueDate)!;
  const row = await prisma.paymentSchedule.create({
    data: {
      projectId,
      dueDate,
      amountCents: input.amountCents,
      currency: input.currency?.trim().toUpperCase() ?? 'USD',
      notes: input.notes?.trim() || null,
      escalationLevel: 0,
      status: 'scheduled',
    },
  });

  const schedule = toRecord(row);
  await auditLog({
    actorId,
    action: 'payment_schedule.create',
    entityType: 'payment_schedule',
    entityId: schedule.id,
    payload: {
      projectId,
      dueDate: dueDate.toISOString().slice(0, 10),
      amountCents: schedule.amountCents,
      escalationLevel: schedule.escalationLevel,
    },
  });

  return { ok: true, schedule };
}

export async function updatePaymentSchedule(
  id: string,
  input: UpdatePaymentScheduleInput,
  actorId: string
): Promise<PaymentScheduleMutationResult> {
  const errors = validateUpdatePaymentScheduleInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const existing = await prisma.paymentSchedule.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, errors: [{ field: 'id', message: 'Payment schedule not found' }] };
  }

  const dueDate =
    input.dueDate !== undefined ? parsePaymentDueDate(input.dueDate) : undefined;
  if (input.dueDate !== undefined && !dueDate) {
    return { ok: false, errors: [{ field: 'dueDate', message: 'Invalid due date' }] };
  }

  const paidAt =
    input.status === 'paid'
      ? new Date()
      : input.status === 'scheduled'
        ? null
        : undefined;

  const row = await prisma.paymentSchedule.update({
    where: { id },
    data: {
      dueDate: dueDate ?? undefined,
      amountCents: input.amountCents,
      status: input.status,
      escalationLevel: input.escalationLevel,
      notes: input.notes === undefined ? undefined : input.notes?.trim() || null,
      paidAt,
    },
  });

  const schedule = toRecord(row);
  await auditLog({
    actorId,
    action: 'payment_schedule.update',
    entityType: 'payment_schedule',
    entityId: schedule.id,
    payload: {
      projectId: schedule.projectId,
      changes: input,
      escalationLevel: schedule.escalationLevel,
    },
  });

  return { ok: true, schedule };
}

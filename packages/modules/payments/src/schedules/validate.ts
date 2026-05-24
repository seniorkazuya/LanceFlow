import {
  MAX_PAYMENT_ESCALATION_LEVEL,
  PAYMENT_SCHEDULE_STATUSES,
  type CreatePaymentScheduleInput,
  type UpdatePaymentScheduleInput,
} from './types';

function parseDueDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function validateCreatePaymentScheduleInput(
  input: CreatePaymentScheduleInput
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (!input.dueDate?.trim()) {
    errors.push({ field: 'dueDate', message: 'dueDate is required' });
  } else if (!parseDueDate(input.dueDate)) {
    errors.push({ field: 'dueDate', message: 'dueDate must be a valid date (YYYY-MM-DD)' });
  }

  if (input.amountCents === undefined || input.amountCents === null) {
    errors.push({ field: 'amountCents', message: 'amountCents is required' });
  } else if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    errors.push({ field: 'amountCents', message: 'amountCents must be a positive integer' });
  }

  if (input.currency !== undefined && input.currency.trim().length !== 3) {
    errors.push({ field: 'currency', message: 'currency must be a 3-letter code' });
  }

  return errors;
}

export function validateUpdatePaymentScheduleInput(
  input: UpdatePaymentScheduleInput
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (input.dueDate !== undefined) {
    if (!input.dueDate.trim()) {
      errors.push({ field: 'dueDate', message: 'dueDate cannot be empty' });
    } else if (!parseDueDate(input.dueDate)) {
      errors.push({ field: 'dueDate', message: 'dueDate must be a valid date (YYYY-MM-DD)' });
    }
  }

  if (input.amountCents !== undefined) {
    if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
      errors.push({ field: 'amountCents', message: 'amountCents must be a positive integer' });
    }
  }

  if (input.status !== undefined) {
    if (!(PAYMENT_SCHEDULE_STATUSES as readonly string[]).includes(input.status)) {
      errors.push({ field: 'status', message: 'Invalid payment status' });
    }
  }

  if (input.escalationLevel !== undefined) {
    if (
      !Number.isInteger(input.escalationLevel) ||
      input.escalationLevel < 0 ||
      input.escalationLevel > MAX_PAYMENT_ESCALATION_LEVEL
    ) {
      errors.push({
        field: 'escalationLevel',
        message: `escalationLevel must be 0–${MAX_PAYMENT_ESCALATION_LEVEL}`,
      });
    }
  }

  return errors;
}

export function parsePaymentDueDate(value: string): Date | null {
  return parseDueDate(value);
}

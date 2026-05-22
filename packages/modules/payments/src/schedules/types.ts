export const PAYMENT_SCHEDULE_STATUSES = ['scheduled', 'paid', 'cancelled'] as const;

export type PaymentScheduleStatus = (typeof PAYMENT_SCHEDULE_STATUSES)[number];

/** AUTO-005 will advance 0 → 1 (reminder) → 2 (day 3) → 3 (day 7 risk). */
export const MAX_PAYMENT_ESCALATION_LEVEL = 3;

export type PaymentScheduleRecord = {
  id: string;
  projectId: string;
  dueDate: Date;
  amountCents: number;
  currency: string;
  status: PaymentScheduleStatus;
  escalationLevel: number;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePaymentScheduleInput = {
  dueDate: string;
  amountCents: number;
  currency?: string;
  notes?: string | null;
};

export type UpdatePaymentScheduleInput = {
  dueDate?: string;
  amountCents?: number;
  status?: string;
  escalationLevel?: number;
  notes?: string | null;
};

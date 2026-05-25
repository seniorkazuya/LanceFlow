import { describe, expect, it } from 'vitest';

import {
  validateCreatePaymentScheduleInput,
  validateUpdatePaymentScheduleInput,
} from '../../packages/modules/payments/src/schedules/validate';

describe('payment schedule validation (AUTO-004)', () => {
  it('requires dueDate and positive amountCents', () => {
    const errors = validateCreatePaymentScheduleInput({
      dueDate: '',
      amountCents: 0,
    });
    expect(errors.some((e) => e.field === 'dueDate')).toBe(true);
    expect(errors.some((e) => e.field === 'amountCents')).toBe(true);
  });

  it('accepts valid create input', () => {
    const errors = validateCreatePaymentScheduleInput({
      dueDate: '2026-06-01',
      amountCents: 50000,
      currency: 'USD',
    });
    expect(errors).toHaveLength(0);
  });

  it('bounds escalationLevel on update', () => {
    const errors = validateUpdatePaymentScheduleInput({ escalationLevel: 9 });
    expect(errors.some((e) => e.field === 'escalationLevel')).toBe(true);
  });
});

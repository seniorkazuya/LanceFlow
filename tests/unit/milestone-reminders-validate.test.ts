import { validateProjectMilestones } from '@lanceflow/payments';
import { describe, expect, it } from 'vitest';

describe('validateProjectMilestones PAY-003 due dates', () => {
  it('accepts milestones with due date and amount', () => {
    const errors = validateProjectMilestones([
      { label: 'Deposit', percentPct: 50, dueDate: '2026-06-01', amountCents: 50000 },
      { label: 'Final', percentPct: 50, dueDate: '2026-07-01', amountCents: 50000 },
    ]);
    expect(errors).toHaveLength(0);
  });

  it('requires amount when due date is set', () => {
    const errors = validateProjectMilestones([
      { label: 'Deposit', percentPct: 100, dueDate: '2026-06-01' },
    ]);
    expect(errors.some((e) => e.field.includes('amountCents'))).toBe(true);
  });

  it('requires due date when amount is set', () => {
    const errors = validateProjectMilestones([
      { label: 'Deposit', percentPct: 100, amountCents: 10000 },
    ]);
    expect(errors.some((e) => e.field.includes('dueDate'))).toBe(true);
  });
});

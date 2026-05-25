import { validateProjectMilestones } from '@lanceflow/payments';
import { describe, expect, it } from 'vitest';

describe('validateProjectMilestones (PAY-001)', () => {
  it('accepts milestones that sum to 100', () => {
    const errors = validateProjectMilestones([
      { label: 'Kickoff', percentPct: 30 },
      { label: 'Delivery', percentPct: 50 },
      { label: 'Final', percentPct: 20 },
    ]);
    expect(errors).toHaveLength(0);
  });

  it('rejects when sum is not 100', () => {
    const errors = validateProjectMilestones([
      { label: 'A', percentPct: 40 },
      { label: 'B', percentPct: 40 },
    ]);
    expect(errors.some((e) => e.field === 'milestones')).toBe(true);
  });

  it('rejects empty label', () => {
    const errors = validateProjectMilestones([{ label: '  ', percentPct: 100 }]);
    expect(errors.some((e) => e.field.includes('label'))).toBe(true);
  });
});

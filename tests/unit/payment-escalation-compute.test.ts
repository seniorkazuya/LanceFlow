import { describe, expect, it } from 'vitest';

import {
  daysOverdueUtc,
  previewPaymentEscalations,
  targetEscalationLevelForOverdue,
} from '@lanceflow/payments';

describe('payment escalation compute (AUTO-005)', () => {
  it('maps overdue days to escalation levels', () => {
    expect(targetEscalationLevelForOverdue(-1)).toBeNull();
    expect(targetEscalationLevelForOverdue(0)).toBe(1);
    expect(targetEscalationLevelForOverdue(2)).toBe(1);
    expect(targetEscalationLevelForOverdue(3)).toBe(2);
    expect(targetEscalationLevelForOverdue(6)).toBe(2);
    expect(targetEscalationLevelForOverdue(7)).toBe(3);
  });

  it('preview only bumps when target exceeds current level', () => {
    const due = new Date('2026-05-01T12:00:00Z');
    const asOf = new Date('2026-05-08T12:00:00Z');
    expect(daysOverdueUtc(due, asOf)).toBe(7);

    const updates = previewPaymentEscalations(
      [
        {
          id: 's1',
          projectId: 'p1',
          dueDate: due,
          escalationLevel: 0,
          status: 'scheduled',
        },
      ],
      asOf
    );
    expect(updates).toHaveLength(1);
    expect(updates[0].toLevel).toBe(3);

    const none = previewPaymentEscalations(
      [
        {
          id: 's1',
          projectId: 'p1',
          dueDate: due,
          escalationLevel: 3,
          status: 'scheduled',
        },
      ],
      asOf
    );
    expect(none).toHaveLength(0);
  });
});

import {
  evaluateWorkGatingFromData,
  isProgressTransition,
} from '@lanceflow/payments';
import { describe, expect, it } from 'vitest';

describe('work gating (PAY-002)', () => {
  it('blocks when escrow is manually held', () => {
    const status = evaluateWorkGatingFromData(
      { id: 'p1', escrowHeld: true, escrowOverrideAt: null },
      [],
      new Date('2026-05-20')
    );
    expect(status.blocked).toBe(true);
    expect(status.reason).toBe('escrow_held');
  });

  it('blocks on overdue scheduled payments', () => {
    const status = evaluateWorkGatingFromData(
      { id: 'p1', escrowHeld: false, escrowOverrideAt: null },
      [{ id: 's1', dueDate: new Date('2026-05-18'), status: 'scheduled' }],
      new Date('2026-05-20')
    );
    expect(status.blocked).toBe(true);
    expect(status.reason).toBe('overdue_payment');
  });

  it('allows work when override is active', () => {
    const status = evaluateWorkGatingFromData(
      { id: 'p1', escrowHeld: true, escrowOverrideAt: new Date() },
      [{ id: 's1', dueDate: new Date('2026-05-18'), status: 'scheduled' }],
      new Date('2026-05-20')
    );
    expect(status.blocked).toBe(false);
    expect(status.overrideActive).toBe(true);
  });

  it('identifies progress transitions', () => {
    expect(isProgressTransition('active')).toBe(true);
    expect(isProgressTransition('draft')).toBe(false);
  });
});

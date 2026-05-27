import { describe, expect, it } from 'vitest';

import { isHiringDecision, validateOverrideHiringDecisionInput } from '@lanceflow/hiring';

describe('hiring decision validation (HIRE-006)', () => {
  it('accepts the four decision values', () => {
    expect(isHiringDecision('Reject')).toBe(true);
    expect(isHiringDecision('Fast Track')).toBe(true);
    expect(isHiringDecision('Maybe')).toBe(false);
  });

  it('requires decision and reason for override', () => {
    expect(validateOverrideHiringDecisionInput({})).toHaveLength(2);
    expect(
      validateOverrideHiringDecisionInput({
        decision: 'Hire',
        reason: 'Strong portfolio and references',
      })
    ).toHaveLength(0);
  });
});

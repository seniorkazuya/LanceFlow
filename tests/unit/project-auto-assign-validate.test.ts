import { describe, expect, it } from 'vitest';

import { validateOverrideAutoAssignInput } from '../../packages/modules/automation/src/project-auto-assign/validate';

describe('validateOverrideAutoAssignInput (AUTO-003)', () => {
  it('requires userId and reason', () => {
    const errors = validateOverrideAutoAssignInput({});
    expect(errors.some((e) => e.field === 'userId')).toBe(true);
    expect(errors.some((e) => e.field === 'reason')).toBe(true);
  });

  it('rejects short reason', () => {
    const errors = validateOverrideAutoAssignInput({
      userId: 'eng-1',
      reason: 'short',
    });
    expect(errors.some((e) => e.field === 'reason')).toBe(true);
  });

  it('accepts valid input', () => {
    const errors = validateOverrideAutoAssignInput({
      userId: 'eng-1',
      reason: 'Client requested specific engineer',
    });
    expect(errors).toHaveLength(0);
  });
});

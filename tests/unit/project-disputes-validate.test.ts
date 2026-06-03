import {
  allowedDisputeTransitions,
  validateCreateProjectDisputeInput,
  validateTransitionProjectDisputeInput,
} from '@lanceflow/operations';
import { describe, expect, it } from 'vitest';

describe('project disputes (PAY-005)', () => {
  it('allows open → investigating → escalated → resolved', () => {
    expect(allowedDisputeTransitions('open')).toContain('investigating');
    expect(allowedDisputeTransitions('investigating')).toContain('escalated');
    expect(allowedDisputeTransitions('escalated')).toContain('resolved');
    expect(allowedDisputeTransitions('resolved')).toHaveLength(0);
  });

  it('requires resolution note when resolving', () => {
    const errors = validateTransitionProjectDisputeInput('escalated', {
      status: 'resolved',
    });
    expect(errors.some((e) => e.field === 'resolutionNote')).toBe(true);
  });

  it('validates create input', () => {
    expect(validateCreateProjectDisputeInput({ title: 'Refund', amountCents: 1000 })).toHaveLength(0);
    expect(validateCreateProjectDisputeInput({ title: '', amountCents: 0 }).length).toBeGreaterThan(0);
  });
});

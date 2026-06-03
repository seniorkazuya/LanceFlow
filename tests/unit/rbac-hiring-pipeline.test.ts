import { describe, expect, it } from 'vitest';
import { RolePolicy, hasRole } from '@lanceflow/auth';

describe('RolePolicy.hiringPipelineRead', () => {
  it('allows CEO and Ops only', () => {
    expect(hasRole('CEO', RolePolicy.hiringPipelineRead)).toBe(true);
    expect(hasRole('OPS_MANAGER', RolePolicy.hiringPipelineRead)).toBe(true);
    expect(hasRole('ENGINEER', RolePolicy.hiringPipelineRead)).toBe(false);
    expect(hasRole('CALLER', RolePolicy.hiringPipelineRead)).toBe(false);
  });
});

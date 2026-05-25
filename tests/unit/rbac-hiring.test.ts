import { describe, expect, it } from 'vitest';
import { RolePolicy, hasRole } from '@lanceflow/auth';

describe('RolePolicy.hiringApplicationsManage', () => {
  it('allows CEO and Ops only', () => {
    expect(hasRole('CEO', RolePolicy.hiringApplicationsManage)).toBe(true);
    expect(hasRole('OPS_MANAGER', RolePolicy.hiringApplicationsManage)).toBe(true);
    expect(hasRole('ENGINEER', RolePolicy.hiringApplicationsManage)).toBe(false);
  });
});

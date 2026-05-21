import { describe, expect, it } from 'vitest';
import { getNavItemsForRole } from '@lanceflow/ui';
import { UserRole } from '@lanceflow/types';

describe('getNavItemsForRole', () => {
  it('shows all nav items for CEO', () => {
    const ids = getNavItemsForRole(UserRole.CEO).map((item) => item.id);
    expect(ids).toEqual(['dashboard', 'control', 'hiring-ceo-queue', 'audit']);
  });

  it('shows control and hiring for ops manager', () => {
    const ids = getNavItemsForRole(UserRole.OPS_MANAGER).map((item) => item.id);
    expect(ids).toContain('control');
    expect(ids).toContain('hiring-ceo-queue');
  });

  it('hides control and hiring CEO queue for engineer', () => {
    const ids = getNavItemsForRole(UserRole.ENGINEER).map((item) => item.id);
    expect(ids).toEqual(['dashboard']);
  });

  it('shows hiring but not control for caller', () => {
    const ids = getNavItemsForRole(UserRole.CALLER).map((item) => item.id);
    expect(ids).toContain('hiring-ceo-queue');
    expect(ids).not.toContain('control');
  });
});

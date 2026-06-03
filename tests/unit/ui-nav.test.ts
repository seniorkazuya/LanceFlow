import { describe, expect, it } from 'vitest';
import { getNavItemsForRole } from '@lanceflow/ui';
import { UserRole } from '@lanceflow/types';

describe('getNavItemsForRole', () => {
  it('shows all nav items for CEO', () => {
    const ids = getNavItemsForRole(UserRole.CEO).map((item) => item.id);
    expect(ids).toEqual([
      'dashboard',
      'clients',
      'projects',
      'workers',
      'ops-console',
      'missing-reports',
      'sops',
      'control',
      'hiring-pipeline',
      'hiring-ceo-queue',
      'audit',
    ]);
  });

  it('shows control and hiring for ops manager', () => {
    const ids = getNavItemsForRole(UserRole.OPS_MANAGER).map((item) => item.id);
    expect(ids).toContain('clients');
    expect(ids).toContain('projects');
    expect(ids).toContain('workers');
    expect(ids).toContain('ops-console');
    expect(ids).toContain('missing-reports');
    expect(ids).toContain('sops');
    expect(ids).toContain('control');
    expect(ids).toContain('hiring-pipeline');
    expect(ids).not.toContain('hiring-ceo-queue');
    expect(ids).not.toContain('audit');
  });

  it('shows clients for bidder without control', () => {
    const ids = getNavItemsForRole(UserRole.BIDDER).map((item) => item.id);
    expect(ids).toContain('clients');
    expect(ids).not.toContain('control');
  });

  it('hides control and hiring CEO queue for engineer', () => {
    const ids = getNavItemsForRole(UserRole.ENGINEER).map((item) => item.id);
    expect(ids).toEqual(['dashboard', 'daily-reports', 'sops']);
  });

  it('does not show CEO queue for caller', () => {
    const ids = getNavItemsForRole(UserRole.CALLER).map((item) => item.id);
    expect(ids).not.toContain('hiring-ceo-queue');
    expect(ids).not.toContain('hiring-pipeline');
    expect(ids).not.toContain('control');
  });

  it('shows dashboard only for client portal role', () => {
    const ids = getNavItemsForRole(UserRole.CLIENT).map((item) => item.id);
    expect(ids).toEqual(['dashboard']);
  });

  it('shows dashboard and apply for developer portal role', () => {
    const ids = getNavItemsForRole(UserRole.DEVELOPER).map((item) => item.id);
    expect(ids).toEqual(['dashboard', 'apply']);
  });
});

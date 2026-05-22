import { describe, expect, it } from 'vitest';
import {
  countProjectsByStatus,
  filterWorkflowProjects,
} from '@lanceflow/operations';
import type { ProjectRecord } from '@lanceflow/operations';

function project(
  partial: Partial<ProjectRecord> & Pick<ProjectRecord, 'id' | 'status' | 'title'>
): ProjectRecord {
  return {
    clientId: 'c1',
    clientName: 'Acme',
    scopeClarityPct: null,
    profitMarginPct: null,
    clientRiskAtCreate: null,
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-20'),
    ...partial,
  };
}

describe('ops console summarize (OPS-008)', () => {
  it('counts projects by status', () => {
    const counts = countProjectsByStatus([
      project({ id: '1', title: 'A', status: 'active' }),
      project({ id: '2', title: 'B', status: 'active' }),
      project({ id: '3', title: 'C', status: 'draft' }),
    ]);
    expect(counts.active).toBe(2);
    expect(counts.draft).toBe(1);
  });

  it('filters workflow projects to pending and active, newest first', () => {
    const rows = filterWorkflowProjects([
      project({
        id: '1',
        title: 'Old active',
        status: 'active',
        updatedAt: new Date('2026-05-10'),
      }),
      project({
        id: '2',
        title: 'Pending',
        status: 'pending_approval',
        updatedAt: new Date('2026-05-22'),
      }),
      project({ id: '3', title: 'Draft', status: 'draft', updatedAt: new Date('2026-05-23') }),
    ]);
    expect(rows.map((p) => p.id)).toEqual(['2', '1']);
  });
});

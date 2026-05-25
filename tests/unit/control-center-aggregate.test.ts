import { aggregateKpiByRole } from '@lanceflow/analytics';
import { describe, expect, it } from 'vitest';

describe('aggregateKpiByRole (KPI-003)', () => {
  it('groups scores by role with avg/min/max', () => {
    const result = aggregateKpiByRole([
      { role: 'engineer', score: 80 },
      { role: 'engineer', score: 60 },
      { role: 'bidder', score: 90 },
    ]);

    expect(result).toHaveLength(2);
    const engineer = result.find((r) => r.role === 'engineer');
    expect(engineer?.count).toBe(2);
    expect(engineer?.avgScore).toBe(70);
    expect(engineer?.minScore).toBe(60);
    expect(engineer?.maxScore).toBe(80);
  });

  it('returns empty array when no records', () => {
    expect(aggregateKpiByRole([])).toEqual([]);
  });
});

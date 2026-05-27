import { describe, expect, it } from 'vitest';

import {
  averageDaysToScore,
  buildRsDistribution,
  buildThsDistribution,
  daysBetween,
} from '@lanceflow/hiring';

describe('hiring pipeline buckets (HIRE-005)', () => {
  it('bins THS scores into four bands', () => {
    const dist = buildThsDistribution([40, 55, 72, 90]);
    expect(dist.map((b) => b.count)).toEqual([1, 1, 1, 1]);
  });

  it('bins RS scores into four bands', () => {
    const dist = buildRsDistribution([10, 40, 60, 80]);
    expect(dist.map((b) => b.count)).toEqual([1, 1, 1, 1]);
  });

  it('computes whole days between apply and score', () => {
    const created = new Date('2026-01-01T00:00:00.000Z');
    const scored = new Date('2026-01-04T12:00:00.000Z');
    expect(daysBetween(created, scored)).toBe(4);
  });

  it('averages days to score', () => {
    const avg = averageDaysToScore([
      {
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        scoredAt: new Date('2026-01-03T00:00:00.000Z'),
      },
      {
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        scoredAt: new Date('2026-01-05T00:00:00.000Z'),
      },
    ]);
    expect(avg).toBe(3);
  });
});

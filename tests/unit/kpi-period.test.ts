import { countWeekdaysInclusive, getWeekPeriod } from '@lanceflow/analytics';
import { describe, expect, it } from 'vitest';

describe('getWeekPeriod (KPI-002)', () => {
  it('returns ISO week key and Monday–Sunday bounds', () => {
    const period = getWeekPeriod(new Date('2026-05-20T12:00:00Z'));
    expect(period.key).toMatch(/^\d{4}-W\d{2}$/);
    expect(period.start.getUTCDay()).toBe(1);
    expect(period.end.getUTCDay()).toBe(0);
  });
});

describe('countWeekdaysInclusive', () => {
  it('counts Mon–Fri in a full week', () => {
    const period = getWeekPeriod(new Date('2026-05-20T12:00:00Z'));
    expect(countWeekdaysInclusive(period.start, period.end)).toBe(5);
  });
});

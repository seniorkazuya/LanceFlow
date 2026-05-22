import { describe, expect, it } from 'vitest';
import { utcReportDate, validateSubmitDailyReportInput } from '@lanceflow/operations';

describe('validateSubmitDailyReportInput', () => {
  it('requires project and valid ranges', () => {
    expect(
      validateSubmitDailyReportInput({
        projectId: '',
        hours: 8,
        progressPct: 50,
      })
    ).toHaveLength(1);

    expect(
      validateSubmitDailyReportInput({
        projectId: 'p1',
        hours: 25,
        progressPct: 50,
      })
    ).toHaveLength(1);

    expect(
      validateSubmitDailyReportInput({
        projectId: 'p1',
        hours: 8,
        progressPct: 101,
      })
    ).toHaveLength(1);

    expect(
      validateSubmitDailyReportInput({
        projectId: 'p1',
        hours: 8,
        progressPct: 50,
      })
    ).toEqual([]);
  });
});

describe('utcReportDate', () => {
  it('normalizes to UTC midnight', () => {
    const d = utcReportDate(new Date('2026-05-22T15:30:00Z'));
    expect(d.toISOString()).toBe('2026-05-22T00:00:00.000Z');
  });
});

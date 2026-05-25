import {
  FRAUD_THRESHOLDS,
  isExcessiveDailyHours,
  isProgressSpike,
} from '@lanceflow/automation';
import { describe, expect, it } from 'vitest';

describe('fraud triggers v1 (PAY-004)', () => {
  it('flags excessive daily hours', () => {
    expect(isExcessiveDailyHours(FRAUD_THRESHOLDS.maxDailyHours - 0.5)).toBe(false);
    expect(isExcessiveDailyHours(FRAUD_THRESHOLDS.maxDailyHours)).toBe(true);
  });

  it('flags progress spike vs prior max', () => {
    expect(isProgressSpike(50, 30)).toBe(false);
    expect(isProgressSpike(71, 30)).toBe(true);
  });
});

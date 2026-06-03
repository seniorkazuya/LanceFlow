import { FRAUD_THRESHOLDS } from './types';

export type DailyReportRow = {
  id: string;
  userId: string;
  projectId: string;
  reportDate: Date;
  hours: number;
  progressPct: number;
};

export type PriorProgressRow = {
  userId: string;
  projectId: string;
  maxProgressPct: number;
};

/** PAY-004 — hours logged in a single day exceed policy. */
export function isExcessiveDailyHours(hours: number): boolean {
  return hours >= FRAUD_THRESHOLDS.maxDailyHours;
}

/** PAY-004 — progress jump vs prior max on same assignment. */
export function isProgressSpike(currentPct: number, priorMaxPct: number): boolean {
  return currentPct - priorMaxPct >= FRAUD_THRESHOLDS.progressSpikePct;
}

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function addUtcDays(date: Date, days: number): Date {
  const d = startOfUtcDay(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

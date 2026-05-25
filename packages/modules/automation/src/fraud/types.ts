import type { UpsertExceptionInput } from '../exceptions/types';

export const FRAUD_FORMULA_VERSION = 'fraud-triggers-v1';

export const FRAUD_THRESHOLDS = {
  maxDailyHours: 12,
  progressSpikePct: 40,
  missingReportDays: 2,
} as const;

export type FraudSignal = UpsertExceptionInput & { ruleKey: string };

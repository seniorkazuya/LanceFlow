/**
 * Client-safe exports (no Prisma, no rules-engine registry).
 * Use in `'use client'` components — never import from `@lanceflow/analytics` barrel.
 */
export {
  classifyByMetric,
  classifyClientRisk,
  classifyKpiScore,
  highRiskClientMinScore,
} from './thresholds/classify';
export { DEFAULT_KPI_SIGNAL_THRESHOLDS } from './thresholds/defaults';
export type {
  ClientRiskThreshold,
  KpiScoreThreshold,
  KpiSignalThresholdsConfig,
  SignalLevel,
} from './thresholds/types';

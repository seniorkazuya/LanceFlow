import type {
  ClientRiskThreshold,
  KpiScoreThreshold,
  KpiSignalThresholdMetric,
  SignalLevel,
} from './types';

/** Classify a 0–100 KPI score (higher is better). */
export function classifyKpiScore(score: number, thresholds: KpiScoreThreshold): SignalLevel {
  if (score >= thresholds.greenMin) return 'success';
  if (score >= thresholds.yellowMin) return 'warning';
  return 'danger';
}

/** Classify client risk score (lower is better). */
export function classifyClientRisk(score: number, thresholds: ClientRiskThreshold): SignalLevel {
  if (score <= thresholds.greenMax) return 'success';
  if (score <= thresholds.yellowMax) return 'warning';
  return 'danger';
}

/** Minimum client risk score counted as "high risk" in operations summary. */
export function highRiskClientMinScore(thresholds: ClientRiskThreshold): number {
  return thresholds.yellowMax + 1;
}

export function classifyByMetric(
  metric: KpiSignalThresholdMetric,
  value: number
): SignalLevel {
  if (metric.metricKey === 'kpi_score') {
    return classifyKpiScore(value, metric);
  }
  return classifyClientRisk(value, metric);
}

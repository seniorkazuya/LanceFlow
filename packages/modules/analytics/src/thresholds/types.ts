/** Signal band direction — higher scores better (KPI) or lower better (risk). */
export type ThresholdDirection = 'asc' | 'desc';

export type SignalLevel = 'success' | 'warning' | 'danger';

export type KpiScoreThreshold = {
  metricKey: 'kpi_score';
  direction: 'asc';
  greenMin: number;
  yellowMin: number;
};

export type ClientRiskThreshold = {
  metricKey: 'client_risk';
  direction: 'desc';
  greenMax: number;
  yellowMax: number;
};

export type KpiSignalThresholdMetric = KpiScoreThreshold | ClientRiskThreshold;

export type KpiSignalThresholdsConfig = {
  kpiScore: KpiScoreThreshold;
  clientRisk: ClientRiskThreshold;
};

export type KpiSignalThresholdUpdateInput = {
  kpiScore?: { greenMin?: number; yellowMin?: number };
  clientRisk?: { greenMax?: number; yellowMax?: number };
};

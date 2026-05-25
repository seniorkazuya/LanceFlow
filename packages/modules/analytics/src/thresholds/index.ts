export { DEFAULT_KPI_SIGNAL_THRESHOLDS } from './defaults';
export {
  classifyByMetric,
  classifyClientRisk,
  classifyKpiScore,
  highRiskClientMinScore,
} from './classify';
export { getKpiSignalThresholds, updateKpiSignalThresholds } from './service';
export type {
  ClientRiskThreshold,
  KpiScoreThreshold,
  KpiSignalThresholdMetric,
  KpiSignalThresholdUpdateInput,
  KpiSignalThresholdsConfig,
  SignalLevel,
  ThresholdDirection,
} from './types';
export { validateThresholdUpdate } from './validate';

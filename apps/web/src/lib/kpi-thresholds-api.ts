import type { KpiSignalThresholdsConfig } from '@lanceflow/analytics';

/** JSON-safe threshold config for BFF routes (KPI-005). */
export function serializeKpiThresholds(config: KpiSignalThresholdsConfig) {
  return {
    kpiScore: {
      metricKey: config.kpiScore.metricKey,
      direction: config.kpiScore.direction,
      greenMin: config.kpiScore.greenMin,
      yellowMin: config.kpiScore.yellowMin,
    },
    clientRisk: {
      metricKey: config.clientRisk.metricKey,
      direction: config.clientRisk.direction,
      greenMax: config.clientRisk.greenMax,
      yellowMax: config.clientRisk.yellowMax,
      highRiskMinScore: config.clientRisk.yellowMax + 1,
    },
  };
}

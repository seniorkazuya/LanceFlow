import type { KpiSignalThresholdsConfig } from './types';

/** KPI-005 defaults — aligned with control center v1 and OPS-002 risk bands. */
export const DEFAULT_KPI_SIGNAL_THRESHOLDS: KpiSignalThresholdsConfig = {
  kpiScore: {
    metricKey: 'kpi_score',
    direction: 'asc',
    greenMin: 70,
    yellowMin: 50,
  },
  clientRisk: {
    metricKey: 'client_risk',
    direction: 'desc',
    greenMax: 39,
    yellowMax: 59,
  },
};

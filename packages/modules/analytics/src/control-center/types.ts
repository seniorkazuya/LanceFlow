import type { ExceptionInboxSummary } from '@lanceflow/automation';

import type { KpiSignalThresholdsConfig } from '../thresholds/types';

export type KpiRoleSummary = {
  role: string;
  count: number;
  avgScore: number;
  minScore: number;
  maxScore: number;
};

export type ControlCenterOperationsSummary = {
  projectsPendingApproval: number;
  projectsActive: number;
  overduePayments: number;
  highRiskClients: number;
};

export type ControlCenterKpiSummary = {
  periodKey: string;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  byRole: KpiRoleSummary[];
};

export type ControlCenterSummary = {
  scope: 'control-center';
  period: { key: string; start: string; end: string };
  exceptions: ExceptionInboxSummary;
  kpi: ControlCenterKpiSummary;
  operations: ControlCenterOperationsSummary;
  thresholds: KpiSignalThresholdsConfig;
  generatedAt: string;
};

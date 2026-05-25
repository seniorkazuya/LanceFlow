import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { DEFAULT_KPI_SIGNAL_THRESHOLDS } from './defaults';
import type {
  ClientRiskThreshold,
  KpiScoreThreshold,
  KpiSignalThresholdUpdateInput,
  KpiSignalThresholdsConfig,
} from './types';
import { validateThresholdUpdate } from './validate';

function rowToKpiScore(row: {
  metricKey: string;
  direction: string;
  greenMin: number | null;
  yellowMin: number | null;
}): KpiScoreThreshold {
  return {
    metricKey: 'kpi_score',
    direction: 'asc',
    greenMin: row.greenMin ?? DEFAULT_KPI_SIGNAL_THRESHOLDS.kpiScore.greenMin,
    yellowMin: row.yellowMin ?? DEFAULT_KPI_SIGNAL_THRESHOLDS.kpiScore.yellowMin,
  };
}

function rowToClientRisk(row: {
  metricKey: string;
  direction: string;
  greenMax: number | null;
  yellowMax: number | null;
}): ClientRiskThreshold {
  return {
    metricKey: 'client_risk',
    direction: 'desc',
    greenMax: row.greenMax ?? DEFAULT_KPI_SIGNAL_THRESHOLDS.clientRisk.greenMax,
    yellowMax: row.yellowMax ?? DEFAULT_KPI_SIGNAL_THRESHOLDS.clientRisk.yellowMax,
  };
}

/** Load active KPI signal thresholds (KPI-005). Falls back to defaults if table empty. */
export async function getKpiSignalThresholds(): Promise<KpiSignalThresholdsConfig> {
  const rows = await prisma.kpiSignalThreshold.findMany();
  if (rows.length === 0) {
    return DEFAULT_KPI_SIGNAL_THRESHOLDS;
  }

  const kpiRow = rows.find((r) => r.metricKey === 'kpi_score');
  const riskRow = rows.find((r) => r.metricKey === 'client_risk');

  return {
    kpiScore: kpiRow ? rowToKpiScore(kpiRow) : DEFAULT_KPI_SIGNAL_THRESHOLDS.kpiScore,
    clientRisk: riskRow ? rowToClientRisk(riskRow) : DEFAULT_KPI_SIGNAL_THRESHOLDS.clientRisk,
  };
}

/** CEO-only threshold update with audit trail (KPI-005). */
export async function updateKpiSignalThresholds(
  input: KpiSignalThresholdUpdateInput,
  actorId: string
): Promise<
  | { ok: true; thresholds: KpiSignalThresholdsConfig }
  | { ok: false; errors: { field: string; message: string }[] }
> {
  const current = await getKpiSignalThresholds();
  const validated = validateThresholdUpdate(input, current);
  if (!validated.ok) {
    return validated;
  }
  const { next } = validated;

  await prisma.$transaction([
    prisma.kpiSignalThreshold.upsert({
      where: { metricKey: 'kpi_score' },
      create: {
        metricKey: 'kpi_score',
        direction: 'asc',
        greenMin: next.kpiScore.greenMin,
        yellowMin: next.kpiScore.yellowMin,
        updatedBy: actorId,
      },
      update: {
        greenMin: next.kpiScore.greenMin,
        yellowMin: next.kpiScore.yellowMin,
        updatedBy: actorId,
      },
    }),
    prisma.kpiSignalThreshold.upsert({
      where: { metricKey: 'client_risk' },
      create: {
        metricKey: 'client_risk',
        direction: 'desc',
        greenMax: next.clientRisk.greenMax,
        yellowMax: next.clientRisk.yellowMax,
        updatedBy: actorId,
      },
      update: {
        greenMax: next.clientRisk.greenMax,
        yellowMax: next.clientRisk.yellowMax,
        updatedBy: actorId,
      },
    }),
  ]);

  await auditLog({
    actorId,
    action: 'kpi_thresholds.updated',
    entityType: 'kpi_signal_thresholds',
    entityId: 'active',
    payload: {
      previous: current,
      next,
      input,
    },
  });

  return { ok: true, thresholds: next };
}

import {
  DEFAULT_KPI_SIGNAL_THRESHOLDS,
  getKpiSignalThresholds,
  updateKpiSignalThresholds,
} from '@lanceflow/analytics';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: KPI signal thresholds (KPI-005)', () => {
  const actorId = 'test-actor-kpi-005';
  const original = { ...DEFAULT_KPI_SIGNAL_THRESHOLDS };

  afterAll(async () => {
    await updateKpiSignalThresholds(
      {
        kpiScore: {
          greenMin: original.kpiScore.greenMin,
          yellowMin: original.kpiScore.yellowMin,
        },
        clientRisk: {
          greenMax: original.clientRisk.greenMax,
          yellowMax: original.clientRisk.yellowMax,
        },
      },
      actorId
    );
    await prisma.$disconnect();
  });

  it('loads thresholds from database seed', async () => {
    const config = await getKpiSignalThresholds();
    expect(config.kpiScore.greenMin).toBe(70);
    expect(config.clientRisk.yellowMax).toBe(59);
  });

  it('persists CEO threshold updates with audit log', async () => {
    const result = await updateKpiSignalThresholds(
      { kpiScore: { greenMin: 72, yellowMin: 52 } },
      actorId
    );
    expect(result.ok).toBe(true);

    const config = await getKpiSignalThresholds();
    expect(config.kpiScore.greenMin).toBe(72);
    expect(config.kpiScore.yellowMin).toBe(52);

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'kpi_thresholds.updated', actorId },
      orderBy: { createdAt: 'desc' },
    });
    expect(audit).not.toBeNull();
  });
});

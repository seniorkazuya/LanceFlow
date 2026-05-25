import { getControlCenterSummary, getWeekPeriod } from '@lanceflow/analytics';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: control center summary (KPI-003)', () => {
  const userIds: string[] = [];
  const kpiRecordIds: string[] = [];

  afterAll(async () => {
    if (userIds.length > 0) {
      await prisma.kpiRecord.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('returns exceptions, kpi, and operations aggregates', async () => {
    const engineer = await prisma.user.create({
      data: {
        email: `cc-summary-${Date.now()}@test.local`,
        displayName: 'CC Summary Engineer',
        role: UserRole.ENGINEER,
        status: 'active',
      },
    });
    userIds.push(engineer.id);

    const ref = new Date('2026-05-20T12:00:00Z');
    const period = getWeekPeriod(ref);
    const row = await prisma.kpiRecord.create({
      data: {
        userId: engineer.id,
        role: UserRole.ENGINEER,
        periodKey: period.key,
        periodStart: period.start,
        periodEnd: period.end,
        formulaVersion: 'role-kpi-worker-v1',
        score: 75,
        components: { quality: 80, speed: 70, reliability: 75 },
      },
    });
    kpiRecordIds.push(row.id);

    const summary = await getControlCenterSummary(ref);

    expect(summary.scope).toBe('control-center');
    expect(summary.period.key).toBe(period.key);
    expect(summary.exceptions).toBeDefined();
    expect(typeof summary.exceptions.open).toBe('number');
    expect(summary.kpi.recordCount).toBeGreaterThanOrEqual(1);
    expect(summary.kpi.byRole.some((r) => r.role === UserRole.ENGINEER)).toBe(true);
    expect(summary.operations).toMatchObject({
      projectsPendingApproval: expect.any(Number),
      projectsActive: expect.any(Number),
      overduePayments: expect.any(Number),
      highRiskClients: expect.any(Number),
    });
    expect(summary.thresholds.kpiScore.greenMin).toBeGreaterThan(0);
    expect(summary.thresholds.clientRisk.yellowMax).toBeGreaterThan(
      summary.thresholds.clientRisk.greenMax
    );
  });
});

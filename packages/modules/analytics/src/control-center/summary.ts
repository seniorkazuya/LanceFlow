import { getExceptionInboxSummary } from '@lanceflow/automation';
import { prisma } from '@lanceflow/database';

import { getWeekPeriod } from '../period';
import { getKpiSignalThresholds, highRiskClientMinScore } from '../thresholds';
import { aggregateKpiByRole } from './aggregate';
import type { ControlCenterSummary } from './types';

/** Read-only Control Center aggregates for CEO/Ops (KPI-003). */
export async function getControlCenterSummary(
  referenceDate: Date = new Date()
): Promise<ControlCenterSummary> {
  const period = getWeekPeriod(referenceDate);
  const periodStart = period.start.toISOString().slice(0, 10);
  const periodEnd = period.end.toISOString().slice(0, 10);
  const today = referenceDate.toISOString().slice(0, 10);

  const thresholds = await getKpiSignalThresholds();
  const highRiskMin = highRiskClientMinScore(thresholds.clientRisk);

  const [
    exceptions,
    kpiRows,
    projectsPendingApproval,
    projectsActive,
    overduePayments,
    highRiskClients,
  ] = await Promise.all([
    getExceptionInboxSummary(),
    prisma.kpiRecord.findMany({
      where: { periodKey: period.key },
      select: { role: true, score: true },
    }),
    prisma.project.count({ where: { status: 'pending_approval' } }),
    prisma.project.count({ where: { status: 'active' } }),
    prisma.paymentSchedule.count({
      where: {
        status: 'scheduled',
        OR: [{ dueDate: { lt: new Date(`${today}T00:00:00.000Z`) } }, { escalationLevel: { gte: 1 } }],
      },
    }),
    prisma.client.count({
      where: { status: 'active', riskScore: { gte: highRiskMin } },
    }),
  ]);

  return {
    scope: 'control-center',
    period: {
      key: period.key,
      start: periodStart,
      end: periodEnd,
    },
    exceptions,
    kpi: {
      periodKey: period.key,
      periodStart,
      periodEnd,
      recordCount: kpiRows.length,
      byRole: aggregateKpiByRole(kpiRows),
    },
    operations: {
      projectsPendingApproval,
      projectsActive,
      overduePayments,
      highRiskClients,
    },
    thresholds,
    generatedAt: referenceDate.toISOString(),
  };
}

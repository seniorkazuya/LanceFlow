import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import type { Prisma } from '@prisma/client';
import { UserRole } from '@lanceflow/types';

import type {
  BidderKpiInputV1,
  CallerKpiInputV1,
  WorkerKpiInputV1,
} from '@lanceflow/rules-engine';

import { computeRoleKpi } from '../calculators';
import { generateCompensationSuggestions } from '../compensation';
import { gatherKpiComponents } from '../components';
import { getWeekPeriod } from '../period';

export const KPI_ROLLUP_SYSTEM_ACTOR = 'system:kpi-rollup';

const KPI_ROLES: readonly string[] = [
  UserRole.ENGINEER,
  UserRole.BIDDER,
  UserRole.CALLER,
];

export type KpiRollupRow = {
  userId: string;
  role: string;
  periodKey: string;
  score: number;
  formulaVersion: string;
};

export type KpiRollupResult = {
  periodKey: string;
  scanned: number;
  upserted: KpiRollupRow[];
};

/** Idempotent nightly rollup — one KPIRecord per user per ISO week (KPI-002). */
export async function processKpiRollup(
  referenceDate: Date = new Date(),
  actorId: string = KPI_ROLLUP_SYSTEM_ACTOR
): Promise<KpiRollupResult> {
  const period = getWeekPeriod(referenceDate);
  const users = await prisma.user.findMany({
    where: { status: 'active', role: { in: [...KPI_ROLES] } },
    select: { id: true, role: true },
  });

  const upserted: KpiRollupRow[] = [];

  for (const user of users) {
    if (!KPI_ROLES.includes(user.role)) continue;

    const components = await gatherKpiComponents(user.role, user.id, period);
    const result =
      user.role === UserRole.ENGINEER
        ? computeRoleKpi({
            role: UserRole.ENGINEER,
            components: components as WorkerKpiInputV1,
          })
        : user.role === UserRole.BIDDER
          ? computeRoleKpi({
              role: UserRole.BIDDER,
              components: components as BidderKpiInputV1,
            })
          : computeRoleKpi({
              role: UserRole.CALLER,
              components: components as CallerKpiInputV1,
            });

    await prisma.kpiRecord.upsert({
      where: {
        userId_periodKey: { userId: user.id, periodKey: period.key },
      },
      create: {
        userId: user.id,
        role: user.role,
        periodKey: period.key,
        periodStart: period.start,
        periodEnd: period.end,
        formulaVersion: result.formulaVersion,
        score: result.score,
        components: result.components as Prisma.InputJsonValue,
      },
      update: {
        role: user.role,
        periodStart: period.start,
        periodEnd: period.end,
        formulaVersion: result.formulaVersion,
        score: result.score,
        components: result.components as Prisma.InputJsonValue,
        computedAt: new Date(),
      },
    });

    upserted.push({
      userId: user.id,
      role: user.role,
      periodKey: period.key,
      score: result.score,
      formulaVersion: result.formulaVersion,
    });
  }

  await auditLog({
    actorId,
    action: 'kpi.rollup',
    entityType: 'kpi_period',
    entityId: period.key,
    payload: {
      periodKey: period.key,
      scanned: users.length,
      upserted: upserted.length,
    },
  });

  await generateCompensationSuggestions(referenceDate, actorId);

  return {
    periodKey: period.key,
    scanned: users.length,
    upserted,
  };
}

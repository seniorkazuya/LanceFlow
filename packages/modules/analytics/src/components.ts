import { prisma } from '@lanceflow/database';
import type {
  BidderKpiInputV1,
  CallerKpiInputV1,
  WorkerKpiInputV1,
} from '@lanceflow/rules-engine';
import { UserRole } from '@lanceflow/types';

import { countWeekdaysInclusive, type KpiPeriod } from './period';

const NEUTRAL = 50;

async function engineerComponents(
  userId: string,
  period: KpiPeriod
): Promise<WorkerKpiInputV1> {
  const reports = await prisma.dailyReport.findMany({
    where: {
      userId,
      reportDate: { gte: period.start, lte: period.end },
    },
  });

  if (reports.length === 0) {
    return { quality: NEUTRAL, speed: NEUTRAL, reliability: NEUTRAL };
  }

  const quality = Math.round(
    reports.reduce((s, r) => s + r.progressPct, 0) / reports.length
  );
  const speed = Math.round(
    reports.reduce((s, r) => s + Math.min(100, r.hours * 12), 0) / reports.length
  );
  const weekdays = countWeekdaysInclusive(period.start, period.end);
  const reliability = Math.round((reports.length / weekdays) * 100);

  return {
    quality: Math.min(100, quality),
    speed: Math.min(100, speed),
    reliability: Math.min(100, reliability),
  };
}

/** v0 proxy until bidder-specific signals exist — active project count in period. */
async function bidderComponents(period: KpiPeriod): Promise<BidderKpiInputV1> {
  const projects = await prisma.project.count({
    where: {
      updatedAt: { gte: period.start, lte: new Date(period.end.getTime() + 86_400_000) },
      status: { in: ['pending_approval', 'active'] },
    },
  });
  const signal = Math.min(100, projects * 15 + NEUTRAL);
  return {
    revenue: signal,
    clientSuccess: Math.min(100, NEUTRAL + projects * 5),
    paymentReliability: NEUTRAL,
  };
}

async function callerComponents(period: KpiPeriod): Promise<CallerKpiInputV1> {
  const clients = await prisma.client.count({
    where: {
      updatedAt: { gte: period.start, lte: new Date(period.end.getTime() + 86_400_000) },
      status: 'active',
    },
  });
  const signal = Math.min(100, clients * 10 + NEUTRAL);
  return {
    accuracy: signal,
    conversion: Math.min(100, NEUTRAL + clients * 5),
    responseTime: NEUTRAL,
  };
}

export async function gatherKpiComponents(
  role: string,
  userId: string,
  period: KpiPeriod
): Promise<WorkerKpiInputV1 | BidderKpiInputV1 | CallerKpiInputV1> {
  switch (role) {
    case UserRole.ENGINEER:
      return engineerComponents(userId, period);
    case UserRole.BIDDER:
      return bidderComponents(period);
    case UserRole.CALLER:
      return callerComponents(period);
    default:
      return { quality: NEUTRAL, speed: NEUTRAL, reliability: NEUTRAL };
  }
}

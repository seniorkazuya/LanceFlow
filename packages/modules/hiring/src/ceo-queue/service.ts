import { prisma } from '@lanceflow/database';

import type { HiringCeoQueueItem, HiringCeoQueueSnapshot } from './types';

const TOP_PERCENT = 0.05;
const HIGH_RS_MIN_INCLUSIVE = 50;
const HIGH_RP_MIN_INCLUSIVE = 70;
const LIST_LIMIT = 30;

type ScoredRow = {
  id: string;
  fullName: string;
  roleApplied: string;
  status: string;
  thsScore: number;
  rsScore: number;
  rpScore: number | null;
  hiringDecision: string | null;
  hiringDecisionSource: string | null;
  createdAt: Date;
  thsRsScoredAt: Date;
};

function toItem(row: ScoredRow, flags: HiringCeoQueueItem['flags']): HiringCeoQueueItem {
  return {
    id: row.id,
    fullName: row.fullName,
    roleApplied: row.roleApplied,
    status: row.status,
    thsScore: row.thsScore,
    rsScore: row.rsScore,
    rpScore: row.rpScore,
    decision: row.hiringDecision,
    decisionSource: row.hiringDecisionSource,
    flags,
    createdAt: row.createdAt.toISOString(),
    scoredAt: row.thsRsScoredAt.toISOString(),
  };
}

export async function getHiringCeoQueueSnapshot(
  referenceDate: Date = new Date()
): Promise<HiringCeoQueueSnapshot> {
  const scoredTotal = await prisma.hiringApplication.count({
    where: { thsScore: { not: null }, rsScore: { not: null }, thsRsScoredAt: { not: null } },
  });

  const topCount = Math.max(1, Math.ceil(scoredTotal * TOP_PERCENT));

  const topRows = await prisma.hiringApplication.findMany({
    where: { thsScore: { not: null }, rsScore: { not: null }, thsRsScoredAt: { not: null } },
    orderBy: [{ thsScore: 'desc' }, { rsScore: 'asc' }, { thsRsScoredAt: 'desc' }],
    take: Math.min(LIST_LIMIT, topCount),
    select: {
      id: true,
      fullName: true,
      roleApplied: true,
      status: true,
      thsScore: true,
      rsScore: true,
      rpScore: true,
      hiringDecision: true,
      hiringDecisionSource: true,
      createdAt: true,
      thsRsScoredAt: true,
    },
  });

  const riskRows = await prisma.hiringApplication.findMany({
    where: {
      thsScore: { not: null },
      rsScore: { not: null },
      thsRsScoredAt: { not: null },
      OR: [
        { rsScore: { gte: HIGH_RS_MIN_INCLUSIVE } },
        { rpScore: { gte: HIGH_RP_MIN_INCLUSIVE } },
      ],
    },
    orderBy: [{ rsScore: 'desc' }, { rpScore: 'desc' }, { thsRsScoredAt: 'desc' }],
    take: LIST_LIMIT,
    select: {
      id: true,
      fullName: true,
      roleApplied: true,
      status: true,
      thsScore: true,
      rsScore: true,
      rpScore: true,
      hiringDecision: true,
      hiringDecisionSource: true,
      createdAt: true,
      thsRsScoredAt: true,
    },
  });

  const map = new Map<string, { row: ScoredRow; flags: HiringCeoQueueItem['flags'] }>();

  for (const row of topRows as unknown as ScoredRow[]) {
    map.set(row.id, { row, flags: ['top_5_percent'] });
  }

  for (const row of riskRows as unknown as ScoredRow[]) {
    const existing = map.get(row.id);
    const flags: HiringCeoQueueItem['flags'] = existing?.flags ?? [];
    if (row.rsScore >= HIGH_RS_MIN_INCLUSIVE && !flags.includes('high_rs')) flags.push('high_rs');
    if (row.rpScore !== null && row.rpScore >= HIGH_RP_MIN_INCLUSIVE && !flags.includes('high_rp')) {
      flags.push('high_rp');
    }
    if (existing) {
      map.set(row.id, { row: existing.row, flags });
    } else {
      map.set(row.id, { row, flags });
    }
  }

  const items = Array.from(map.values())
    .map((entry) => toItem(entry.row, entry.flags))
    .sort((a, b) => b.thsScore - a.thsScore || b.rsScore - a.rsScore)
    .slice(0, LIST_LIMIT);

  return {
    scope: 'hiring-ceo-queue',
    thresholds: {
      topPercent: TOP_PERCENT,
      highRsMinInclusive: HIGH_RS_MIN_INCLUSIVE,
      highRpMinInclusive: HIGH_RP_MIN_INCLUSIVE,
    },
    counts: {
      scoredTotal,
      returned: items.length,
    },
    items,
    generatedAt: referenceDate.toISOString(),
  };
}


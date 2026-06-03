import { prisma } from '@lanceflow/database';

import { averageDaysToScore, buildRsDistribution, buildThsDistribution, daysBetween } from './buckets';
import { hiringPipelineWhere } from './filters';
import {
  HIRING_PIPELINE_STAGES,
  type HiringPipelineFilters,
  type HiringPipelineListItem,
  type HiringPipelineSnapshot,
} from './types';

const LIST_LIMIT = 50;

function toListItem(row: {
  id: string;
  fullName: string;
  roleApplied: string;
  status: string;
  technicalScore: number | null;
  thsScore: number | null;
  rsScore: number | null;
  hiringRecommendation: string | null;
  hiringDecision: string | null;
  hiringDecisionSource: string | null;
  createdAt: Date;
  thsRsScoredAt: Date | null;
}): HiringPipelineListItem {
  return {
    id: row.id,
    fullName: row.fullName,
    roleApplied: row.roleApplied,
    status: row.status,
    technicalScore: row.technicalScore,
    thsScore: row.thsScore,
    rsScore: row.rsScore,
    hiringRecommendation: row.hiringRecommendation,
    hiringDecision: row.hiringDecision,
    hiringDecisionSource: row.hiringDecisionSource,
    createdAt: row.createdAt.toISOString(),
    thsRsScoredAt: row.thsRsScoredAt?.toISOString() ?? null,
    daysToScore:
      row.thsRsScoredAt !== null
        ? daysBetween(row.createdAt, row.thsRsScoredAt)
        : null,
  };
}

/** Pipeline dashboard aggregates — stages, score bands, time-to-hire (HIRE-005). */
export async function getHiringPipelineSnapshot(
  filters: HiringPipelineFilters = {},
  referenceDate: Date = new Date()
): Promise<HiringPipelineSnapshot> {
  const where = hiringPipelineWhere(filters);

  const [grouped, applications, scoredRows] = await Promise.all([
    prisma.hiringApplication.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    }),
    prisma.hiringApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: LIST_LIMIT,
      select: {
        id: true,
        fullName: true,
        roleApplied: true,
        status: true,
        technicalScore: true,
        thsScore: true,
        rsScore: true,
        hiringRecommendation: true,
        hiringDecision: true,
        hiringDecisionSource: true,
        createdAt: true,
        thsRsScoredAt: true,
      },
    }),
    prisma.hiringApplication.findMany({
      where: { ...where, thsRsScoredAt: { not: null } },
      select: {
        createdAt: true,
        thsRsScoredAt: true,
        thsScore: true,
        rsScore: true,
      },
    }),
  ]);

  const countByStatus = new Map(grouped.map((g) => [g.status, g._count._all]));
  const stageCounts = HIRING_PIPELINE_STAGES.map((stage) => ({
    stage,
    count: countByStatus.get(stage) ?? 0,
  }));

  const thsScores = scoredRows
    .map((r) => r.thsScore)
    .filter((s): s is number => s !== null);
  const rsScores = scoredRows
    .map((r) => r.rsScore)
    .filter((s): s is number => s !== null);

  const timePairs = scoredRows
    .filter((r): r is typeof r & { thsRsScoredAt: Date } => r.thsRsScoredAt !== null)
    .map((r) => ({ createdAt: r.createdAt, scoredAt: r.thsRsScoredAt }));

  return {
    scope: 'hiring-pipeline',
    filters,
    stageCounts,
    thsDistribution: buildThsDistribution(thsScores),
    rsDistribution: buildRsDistribution(rsScores),
    timeToHire: {
      scoredCount: timePairs.length,
      averageDays: averageDaysToScore(timePairs),
    },
    applications: applications.map(toListItem),
    generatedAt: referenceDate.toISOString(),
  };
}

import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import {
  COMPENSATION_SUGGESTION_FORMULA_V1,
  computeCompensationSuggestionV1,
} from '@lanceflow/rules-engine/compensation';
import type { Prisma } from '@prisma/client';

import { getWeekPeriod } from '../period';
import { getKpiSignalThresholds } from '../thresholds';

export type GenerateCompensationSuggestionsResult = {
  periodKey: string;
  scanned: number;
  created: number;
  updated: number;
  skipped: number;
};

/** Build or refresh pending suggestions from KPI records for a week (KPI-006). */
export async function generateCompensationSuggestions(
  referenceDate: Date = new Date(),
  actorId: string
): Promise<GenerateCompensationSuggestionsResult> {
  const period = getWeekPeriod(referenceDate);
  const thresholds = await getKpiSignalThresholds();
  const kpiThreshold = thresholds.kpiScore;

  const records = await prisma.kpiRecord.findMany({
    where: { periodKey: period.key },
    include: { user: { select: { id: true, displayName: true, role: true } } },
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const record of records) {
    const suggestion = computeCompensationSuggestionV1({
      kpiScore: record.score,
      greenMin: kpiThreshold.greenMin,
      yellowMin: kpiThreshold.yellowMin,
    });

    if (!suggestion) {
      skipped += 1;
      continue;
    }

    const inputs = {
      kpiScore: record.score,
      greenMin: kpiThreshold.greenMin,
      yellowMin: kpiThreshold.yellowMin,
      role: record.role,
    } satisfies Prisma.InputJsonObject;

    const existing = await prisma.compensationSuggestion.findUnique({
      where: {
        userId_periodKey: { userId: record.userId, periodKey: period.key },
      },
    });

    if (existing && existing.status !== 'pending') {
      skipped += 1;
      continue;
    }

    if (existing) {
      await prisma.compensationSuggestion.update({
        where: { id: existing.id },
        data: {
          kind: suggestion.kind,
          percentBps: suggestion.percentBps,
          kpiScore: record.score,
          formulaVersion: COMPENSATION_SUGGESTION_FORMULA_V1,
          inputs,
        },
      });
      updated += 1;
    } else {
      await prisma.compensationSuggestion.create({
        data: {
          userId: record.userId,
          periodKey: period.key,
          kind: suggestion.kind,
          percentBps: suggestion.percentBps,
          kpiScore: record.score,
          formulaVersion: COMPENSATION_SUGGESTION_FORMULA_V1,
          inputs,
        },
      });
      created += 1;
    }
  }

  await auditLog({
    actorId,
    action: 'compensation_suggestions.generated',
    entityType: 'compensation_suggestions',
    entityId: period.key,
    payload: { periodKey: period.key, scanned: records.length, created, updated, skipped },
  });

  return {
    periodKey: period.key,
    scanned: records.length,
    created,
    updated,
    skipped,
  };
}

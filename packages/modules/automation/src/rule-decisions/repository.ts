import { prisma } from '@lanceflow/database';
import type { Prisma } from '@prisma/client';

import type { CreateRuleDecisionInput, RuleDecisionRecord } from './types';

function toRecord(row: {
  id: string;
  entityType: string;
  entityId: string;
  ruleKey: string;
  formulaVersion: string;
  inputs: unknown;
  outcome: string;
  explanation: unknown;
  overridden: boolean;
  actorId: string | null;
  createdAt: Date;
}): RuleDecisionRecord {
  const explanation = Array.isArray(row.explanation)
    ? (row.explanation as string[])
    : [];

  return {
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    ruleKey: row.ruleKey,
    formulaVersion: row.formulaVersion,
    inputs: row.inputs as Record<string, unknown>,
    outcome: row.outcome,
    explanation,
    overridden: row.overridden,
    actorId: row.actorId,
    createdAt: row.createdAt,
  };
}

export async function createRuleDecision(
  input: CreateRuleDecisionInput
): Promise<RuleDecisionRecord> {
  const row = await prisma.ruleDecision.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      ruleKey: input.ruleKey,
      formulaVersion: input.formulaVersion,
      inputs: input.inputs as Prisma.InputJsonValue,
      outcome: input.outcome,
      explanation: input.explanation as Prisma.InputJsonValue,
      actorId: input.actorId ?? null,
    },
  });
  return toRecord(row);
}

export async function getLatestRuleDecision(
  entityType: string,
  entityId: string,
  ruleKey: string
): Promise<RuleDecisionRecord | null> {
  const row = await prisma.ruleDecision.findFirst({
    where: { entityType, entityId, ruleKey },
    orderBy: { createdAt: 'desc' },
  });
  return row ? toRecord(row) : null;
}

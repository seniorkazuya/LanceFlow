import {
  createRuleDecision,
  getLatestRuleDecision,
  markLatestRuleDecisionOverridden,
} from '@lanceflow/automation';
import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { HIRE_THS_RS_RULE_KEY } from '@lanceflow/rules-engine';

import { sendCandidateDecisionEmail } from '../notifications';
import { mapHiringApplicationRow } from '../record-mapper';
import type { HiringApplicationRecord, HiringDecision } from '../types';
import { validateOverrideHiringDecisionInput } from './validate';

export const HIRE_DECISION_FORMULA_V1 = 'hiring-decision-v1';
export const HIRE_DECISION_RULE_KEY = 'hiring.decision';

export type HiringDecisionDetail = {
  applicationId: string;
  decision: HiringDecision | null;
  source: string | null;
  ruleRecommendation: string | null;
  overrideReason: string | null;
  decidedAt: string | null;
  rpScore: number | null;
  latestThsRsDecision: {
    id: string;
    outcome: string;
    formulaVersion: string;
    overridden: boolean;
    createdAt: string;
  } | null;
  latestOverrideDecision: {
    id: string;
    outcome: string;
    createdAt: string;
  } | null;
};

export type OverrideHiringDecisionInput = {
  decision: string;
  reason: string;
};

export type OverrideHiringDecisionResult =
  | { ok: true; application: HiringApplicationRecord; decisionId: string }
  | { ok: false; errors: { field: string; message: string }[] };

function statusForDecision(decision: HiringDecision): string | undefined {
  if (decision === 'Reject') return 'rejected';
  return undefined;
}

/** Read effective hiring decision + latest rule outcomes (HIRE-006). */
export async function getHiringDecisionDetail(
  applicationId: string
): Promise<HiringDecisionDetail | null> {
  const row = await prisma.hiringApplication.findUnique({ where: { id: applicationId } });
  if (!row) return null;

  const [thsRsDecision, overrideDecision] = await Promise.all([
    getLatestRuleDecision('hiring_application', applicationId, HIRE_THS_RS_RULE_KEY),
    getLatestRuleDecision('hiring_application', applicationId, HIRE_DECISION_RULE_KEY),
  ]);

  return {
    applicationId,
    decision: row.hiringDecision as HiringDecision | null,
    source: row.hiringDecisionSource,
    ruleRecommendation: row.hiringRecommendation,
    overrideReason: row.hiringDecisionOverrideReason,
    decidedAt: row.hiringDecisionAt?.toISOString() ?? null,
    rpScore: row.rpScore,
    latestThsRsDecision: thsRsDecision
      ? {
          id: thsRsDecision.id,
          outcome: thsRsDecision.outcome,
          formulaVersion: thsRsDecision.formulaVersion,
          overridden: thsRsDecision.overridden,
          createdAt: thsRsDecision.createdAt.toISOString(),
        }
      : null,
    latestOverrideDecision: overrideDecision
      ? {
          id: overrideDecision.id,
          outcome: overrideDecision.outcome,
          createdAt: overrideDecision.createdAt.toISOString(),
        }
      : null,
  };
}

/** Apply rule-derived decision after THS/RS scoring (HIRE-006). */
export async function applyHiringDecisionFromRule(
  applicationId: string,
  decision: HiringDecision,
  actorId: string
): Promise<void> {
  const existing = await prisma.hiringApplication.findUnique({ where: { id: applicationId } });
  if (!existing) return;

  const previousDecision = existing.hiringDecision as HiringDecision | null;
  const now = new Date();
  const updated = await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      hiringDecision: decision,
      hiringDecisionSource: 'rule',
      hiringDecisionAt: now,
      hiringDecisionOverrideReason: null,
    },
  });

  await auditLog({
    actorId,
    action: 'hiring_application.apply_decision_rule',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: { decision, source: 'rule', previousDecision },
  });

  if (previousDecision !== decision) {
    await sendCandidateDecisionEmail({
      applicationId,
      email: updated.email,
      fullName: updated.fullName,
      roleApplied: updated.roleApplied,
      decision,
      actorId,
    });
  }
}

/** Manual decision override — audited; marks prior THS/RS rule decision overridden (HIRE-006). */
export async function overrideHiringDecision(
  applicationId: string,
  input: OverrideHiringDecisionInput,
  actorId: string
): Promise<OverrideHiringDecisionResult> {
  const errors = validateOverrideHiringDecisionInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const row = await prisma.hiringApplication.findUnique({ where: { id: applicationId } });
  if (!row) {
    return { ok: false, errors: [{ field: 'applicationId', message: 'Application not found' }] };
  }

  if (row.thsScore === null || row.rsScore === null) {
    return {
      ok: false,
      errors: [
        {
          field: 'applicationId',
          message: 'Application must be THS/RS scored before decision override',
        },
      ],
    };
  }

  const decision = input.decision.trim() as HiringDecision;
  const reason = input.reason.trim();
  const previousDecision = row.hiringDecision;

  await markLatestRuleDecisionOverridden(
    'hiring_application',
    applicationId,
    HIRE_THS_RS_RULE_KEY
  );

  const nextStatus = statusForDecision(decision);
  const now = new Date();

  const updated = await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      hiringDecision: decision,
      hiringDecisionSource: 'override',
      hiringDecisionAt: now,
      hiringDecisionOverrideReason: reason,
      ...(nextStatus ? { status: nextStatus } : {}),
    },
  });

  const ruleDecision = await createRuleDecision({
    entityType: 'hiring_application',
    entityId: applicationId,
    ruleKey: HIRE_DECISION_RULE_KEY,
    formulaVersion: HIRE_DECISION_FORMULA_V1,
    inputs: {
      previousDecision,
      ruleRecommendation: row.hiringRecommendation,
      ths: row.thsScore,
      rs: row.rsScore,
      reason,
    },
    outcome: decision,
    explanation: [`manual override: ${reason}`],
    actorId,
  });

  await auditLog({
    actorId,
    action: 'hiring_application.decision_override',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: {
      previousDecision,
      decision,
      reason,
      decisionId: ruleDecision.id,
    },
  });

  await sendCandidateDecisionEmail({
    applicationId,
    email: updated.email,
    fullName: updated.fullName,
    roleApplied: updated.roleApplied,
    decision,
    actorId,
  });

  return {
    ok: true,
    application: mapHiringApplicationRow(updated),
    decisionId: ruleDecision.id,
  };
}

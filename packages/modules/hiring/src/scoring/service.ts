import { createRuleDecision } from '@lanceflow/automation';
import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import {
  HIRE_THS_RS_FORMULA_V1,
  HIRE_THS_RS_RULE_KEY,
  evaluateRule,
  hiringThsRsV1Rule,
} from '@lanceflow/rules-engine';

import { applyHiringDecisionFromRule } from '../decision';
import { mapHiringApplicationRow } from '../record-mapper';
import { buildThsRsInputFromApplication } from './build-input';
import type { HiringApplicationRecord, HiringDecision } from '../types';

export type ScoreHiringApplicationResult =
  | {
      ok: true;
      application: HiringApplicationRecord;
      ths: number;
      rs: number;
      recommendation: string;
      autoRejected: boolean;
      decisionId: string;
    }
  | { ok: false; errors: { field: string; message: string }[] };

/** HIRE-004 — compute THS/RS, persist scores, auto-reject when RS > 70. */
export async function scoreHiringApplication(
  applicationId: string,
  actorId: string
): Promise<ScoreHiringApplicationResult> {
  const row = await prisma.hiringApplication.findUnique({ where: { id: applicationId } });
  if (!row) {
    return { ok: false, errors: [{ field: 'applicationId', message: 'Application not found' }] };
  }

  const ruleInput = buildThsRsInputFromApplication({
    roleApplied: row.roleApplied,
    resumeParsed: row.resumeParsed,
    technicalScore: row.technicalScore,
  });

  if (!ruleInput) {
    return {
      ok: false,
      errors: [
        {
          field: 'resumeParsed',
          message: 'Resume must be parsed before THS/RS scoring (run parse first)',
        },
      ],
    };
  }

  const evaluated = evaluateRule(hiringThsRsV1Rule, ruleInput);
  const nextStatus = evaluated.value.autoRejected
    ? 'rejected'
    : row.status === 'submitted'
      ? 'scored'
      : row.status;

  const updated = await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      thsScore: evaluated.value.ths,
      rsScore: evaluated.value.rs,
      hiringRecommendation: evaluated.value.recommendation,
      thsRsFormulaVersion: HIRE_THS_RS_FORMULA_V1,
      thsRsScoredAt: new Date(),
      status: nextStatus,
    },
  });

  const decision = await createRuleDecision({
    entityType: 'hiring_application',
    entityId: applicationId,
    ruleKey: HIRE_THS_RS_RULE_KEY,
    formulaVersion: HIRE_THS_RS_FORMULA_V1,
    inputs: { ...ruleInput, ths: evaluated.value.ths, rs: evaluated.value.rs },
    outcome: evaluated.value.recommendation,
    explanation: [...evaluated.explanation],
    actorId,
  });

  await applyHiringDecisionFromRule(
    applicationId,
    evaluated.value.recommendation as HiringDecision,
    actorId
  );

  const refreshed = await prisma.hiringApplication.findUniqueOrThrow({
    where: { id: applicationId },
  });

  await auditLog({
    actorId,
    action: 'hiring_application.score_ths_rs',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: {
      formulaVersion: HIRE_THS_RS_FORMULA_V1,
      ths: evaluated.value.ths,
      rs: evaluated.value.rs,
      recommendation: evaluated.value.recommendation,
      autoRejected: evaluated.value.autoRejected,
      decisionId: decision.id,
    },
  });

  return {
    ok: true,
    application: mapHiringApplicationRow(refreshed),
    ths: evaluated.value.ths,
    rs: evaluated.value.rs,
    recommendation: evaluated.value.recommendation,
    autoRejected: evaluated.value.autoRejected,
    decisionId: decision.id,
  };
}

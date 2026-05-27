import { createRuleDecision } from '@lanceflow/automation';
import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import {
  HIRE_THS_RS_FORMULA_V1,
  HIRE_THS_RS_RULE_KEY,
  evaluateRule,
  hiringThsRsV1Rule,
} from '@lanceflow/rules-engine';

import { buildThsRsInputFromApplication } from './build-input';
import type { HiringApplicationRecord } from '../types';

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

function toRecord(row: {
  id: string;
  fullName: string;
  email: string;
  roleApplied: string;
  resumeStorageKey: string;
  resumeFileName: string;
  resumeMimeType: string | null;
  resumeSizeBytes: number;
  consentGiven: boolean;
  consentAt: Date;
  status: string;
  technicalScore: number | null;
  technicalScoreAt: Date | null;
  technicalScoreSource: string | null;
  thsScore: number | null;
  rsScore: number | null;
  hiringRecommendation: string | null;
  thsRsFormulaVersion: string | null;
  thsRsScoredAt: Date | null;
  createdAt: Date;
}): HiringApplicationRecord {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    roleApplied: row.roleApplied,
    resumeStorageKey: row.resumeStorageKey,
    resumeFileName: row.resumeFileName,
    resumeMimeType: row.resumeMimeType,
    resumeSizeBytes: row.resumeSizeBytes,
    consentGiven: row.consentGiven,
    consentAt: row.consentAt,
    status: row.status,
    technicalScore: row.technicalScore,
    technicalScoreAt: row.technicalScoreAt,
    technicalScoreSource: row.technicalScoreSource,
    thsScore: row.thsScore,
    rsScore: row.rsScore,
    hiringRecommendation: row.hiringRecommendation,
    thsRsFormulaVersion: row.thsRsFormulaVersion,
    thsRsScoredAt: row.thsRsScoredAt,
    createdAt: row.createdAt,
  };
}

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
    application: toRecord(updated),
    ths: evaluated.value.ths,
    rs: evaluated.value.rs,
    recommendation: evaluated.value.recommendation,
    autoRejected: evaluated.value.autoRejected,
    decisionId: decision.id,
  };
}

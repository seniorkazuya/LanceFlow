import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { mapHiringApplicationRow } from '../record-mapper';
import { getHiringApplicationById } from '../queries';
import type { HiringApplicationRecord, TechnicalScoreSource } from '../types';
import { validateTechnicalScore } from './validate';

export type SetTechnicalScoreResult =
  | { ok: true; application: HiringApplicationRecord }
  | { ok: false; errors: { field: string; message: string }[] };

/** HIRE-003 — attach coding test score to an application. */
export async function setTechnicalScore(
  applicationId: string,
  technicalScore: number,
  source: TechnicalScoreSource,
  actorId: string
): Promise<SetTechnicalScoreResult> {
  const errors = validateTechnicalScore(technicalScore);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const existing = await getHiringApplicationById(applicationId);
  if (!existing) {
    return { ok: false, errors: [{ field: 'applicationId', message: 'Application not found' }] };
  }

  const now = new Date();
  const row = await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      technicalScore,
      technicalScoreAt: now,
      technicalScoreSource: source,
      status: existing.status === 'submitted' ? 'assessed' : existing.status,
    },
  });

  const application = mapHiringApplicationRow(row);

  await auditLog({
    actorId,
    action: 'hiring_application.set_technical_score',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: {
      technicalScore,
      source,
      previousScore: existing.technicalScore,
    },
  });

  return { ok: true, application };
}

export type AssessmentWebhookInput = {
  applicationId: string;
  technicalScore: number;
};

export type AssessmentWebhookResult =
  | { ok: true; application: HiringApplicationRecord }
  | { ok: false; status: 401 | 503; error: string }
  | { ok: false; errors: { field: string; message: string }[] };

/** Placeholder webhook ingress for external coding-test providers (HIRE-003). */
export async function ingestAssessmentWebhook(
  input: AssessmentWebhookInput,
  providedSecret: string | null | undefined
): Promise<AssessmentWebhookResult> {
  const expected = process.env.HIRING_ASSESSMENT_WEBHOOK_SECRET?.trim();
  if (!expected) {
    return { ok: false, status: 503, error: 'Assessment webhook is not configured' };
  }
  if (!providedSecret || providedSecret !== expected) {
    return { ok: false, status: 401, error: 'Invalid webhook secret' };
  }

  const result = await setTechnicalScore(
    input.applicationId,
    input.technicalScore,
    'webhook',
    'webhook:hiring-assessment'
  );
  if (!result.ok) {
    return { ok: false, errors: result.errors };
  }
  return result;
}

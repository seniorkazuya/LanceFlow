import { getEmailAdapter } from '@lanceflow/automation';
import { auditLog } from '@lanceflow/audit';

import type { HiringDecision } from '../types';
import { buildCandidateDecisionEmail } from './templates';

export function isHiringDecisionEmailEnabled(): boolean {
  return process.env.HIRING_DECISION_NOTIFY_EMAIL === 'true';
}

export type SendCandidateDecisionEmailInput = {
  applicationId: string;
  email: string;
  fullName: string;
  roleApplied: string;
  decision: HiringDecision;
  actorId: string | null;
};

export type SendCandidateDecisionEmailResult = {
  attempted: boolean;
  sent: boolean;
  provider: string | null;
  error: string | null;
};

/** Send decision email to candidate when HIRING_DECISION_NOTIFY_EMAIL=true (HIRE-008 / AUTO-007). */
export async function sendCandidateDecisionEmail(
  input: SendCandidateDecisionEmailInput
): Promise<SendCandidateDecisionEmailResult> {
  if (!isHiringDecisionEmailEnabled()) {
    return { attempted: false, sent: false, provider: null, error: null };
  }

  const to = input.email.trim();
  if (!to) {
    await auditDecisionEmail(input, { attempted: true, sent: false, provider: null, error: 'missing email' });
    return { attempted: true, sent: false, provider: null, error: 'missing email' };
  }

  const content = buildCandidateDecisionEmail({
    decision: input.decision,
    fullName: input.fullName,
    roleApplied: input.roleApplied,
  });

  const adapter = getEmailAdapter();
  const result = await adapter.send({
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  const outcome: SendCandidateDecisionEmailResult = {
    attempted: true,
    sent: result.ok,
    provider: result.provider,
    error: result.ok ? null : result.error,
  };

  await auditDecisionEmail(input, outcome);
  return outcome;
}

async function auditDecisionEmail(
  input: SendCandidateDecisionEmailInput,
  outcome: SendCandidateDecisionEmailResult
): Promise<void> {
  await auditLog({
    actorId: input.actorId,
    action: 'hiring_application.decision_email',
    entityType: 'hiring_application',
    entityId: input.applicationId,
    payload: {
      decision: input.decision,
      attempted: outcome.attempted,
      sent: outcome.sent,
      provider: outcome.provider,
      error: outcome.error,
    },
  });
}

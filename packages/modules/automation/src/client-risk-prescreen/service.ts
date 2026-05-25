import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { evaluateClientRisk } from '@lanceflow/operations';
import {
  CLIENT_RISK_PRESCREEN_FORMULA_V1,
  CLIENT_RISK_PRESCREEN_RULE_KEY,
  clientRiskPrescreenV1Rule,
  evaluateRule,
  type PrescreenRecommendationV1,
} from '@lanceflow/rules-engine';

import { createRuleDecision } from '../rule-decisions/repository';
import type { RuleDecisionRecord } from '../rule-decisions/types';

export type ClientRiskPrescreenResult =
  | {
      ok: true;
      score: number;
      band: 'low' | 'medium' | 'high';
      recommendation: PrescreenRecommendationV1;
      decision: RuleDecisionRecord;
      persisted: boolean;
      clientRiskScore: number;
    }
  | { ok: false; errors: { field: string; message: string }[] };

export async function runClientRiskPrescreen(
  clientId: string,
  actorId: string,
  options?: { persist?: boolean }
): Promise<ClientRiskPrescreenResult> {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return { ok: false, errors: [{ field: 'clientId', message: 'Client not found' }] };
  }

  const ruleInput = {
    hasContactEmail: Boolean(client.contactEmail),
    notesLength: client.notes?.length ?? 0,
    priorScore: client.riskScore,
  };

  const evaluated = evaluateRule(clientRiskPrescreenV1Rule, ruleInput);

  const decision = await createRuleDecision({
    entityType: 'client',
    entityId: clientId,
    ruleKey: CLIENT_RISK_PRESCREEN_RULE_KEY,
    formulaVersion: CLIENT_RISK_PRESCREEN_FORMULA_V1,
    inputs: {
      hasContactEmail: ruleInput.hasContactEmail,
      notesLength: ruleInput.notesLength,
      priorScore: ruleInput.priorScore,
      clientName: client.name,
    },
    outcome: evaluated.value.recommendation,
    explanation: [...evaluated.explanation],
    actorId,
  });

  let persisted = false;
  let clientRiskScore = client.riskScore;

  if (options?.persist) {
    const saved = await evaluateClientRisk(clientId, actorId);
    if (!saved.ok) {
      return { ok: false, errors: saved.errors };
    }
    persisted = true;
    clientRiskScore = saved.client.riskScore;
  }

  await auditLog({
    actorId,
    action: 'client.risk_prescreen',
    entityType: 'client',
    entityId: clientId,
    payload: {
      score: evaluated.value.score,
      band: evaluated.value.band,
      recommendation: evaluated.value.recommendation,
      formulaVersion: CLIENT_RISK_PRESCREEN_FORMULA_V1,
      persisted,
      decisionId: decision.id,
    },
  });

  return {
    ok: true,
    score: evaluated.value.score,
    band: evaluated.value.band,
    recommendation: evaluated.value.recommendation,
    decision,
    persisted,
    clientRiskScore,
  };
}

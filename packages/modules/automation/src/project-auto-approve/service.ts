import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { transitionProject } from '@lanceflow/operations';
import { PROJECT_AUTO_APPROVE_THRESHOLDS } from '@lanceflow/config';
import {
  PROJECT_AUTO_APPROVE_FORMULA_V1,
  PROJECT_AUTO_APPROVE_RULE_KEY,
  evaluateProjectAutoApproveV1,
  evaluateRule,
  projectAutoApproveV1Rule,
  type ProjectAutoApproveInputV1,
} from '@lanceflow/rules-engine';

import { runProjectAutoAssignOnActivate } from '../project-auto-assign/service';
import { createRuleDecision } from '../rule-decisions/repository';
import type { RuleDecisionRecord } from '../rule-decisions/types';

export type ProjectAutoApproveResult =
  | {
      ok: true;
      approved: boolean;
      decision: RuleDecisionRecord;
      projectStatus: string;
      transitioned: boolean;
    }
  | { ok: false; errors: { field: string; message: string }[] };

export async function runProjectAutoApproval(
  projectId: string,
  actorId: string
): Promise<ProjectAutoApproveResult> {
  const row = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: { select: { riskScore: true, name: true } } },
  });

  if (!row) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  if (row.status !== 'pending_approval') {
    return {
      ok: false,
      errors: [
        {
          field: 'status',
          message: 'Auto-approval only applies to projects in pending_approval',
        },
      ],
    };
  }

  if (row.scopeClarityPct == null || row.profitMarginPct == null) {
    return {
      ok: false,
      errors: [
        {
          field: 'project',
          message: 'Scope clarity and profit margin are required for auto-approval',
        },
      ],
    };
  }

  const ruleInput = {
    clientRiskScore: row.client.riskScore,
    profitMarginPct: row.profitMarginPct,
    scopeClarityPct: row.scopeClarityPct,
  };

  const evaluated = evaluateRule(projectAutoApproveV1Rule, ruleInput);

  const decision = await createRuleDecision({
    entityType: 'project',
    entityId: projectId,
    ruleKey: PROJECT_AUTO_APPROVE_RULE_KEY,
    formulaVersion: PROJECT_AUTO_APPROVE_FORMULA_V1,
    inputs: {
      clientRiskScore: ruleInput.clientRiskScore,
      profitMarginPct: ruleInput.profitMarginPct,
      scopeClarityPct: ruleInput.scopeClarityPct,
      clientName: row.client.name,
    },
    outcome: evaluated.value.outcome,
    explanation: [...evaluated.explanation],
    actorId,
  });

  await auditLog({
    actorId,
    action: 'rule.project_auto_approve',
    entityType: 'project',
    entityId: projectId,
    payload: {
      formulaVersion: PROJECT_AUTO_APPROVE_FORMULA_V1,
      outcome: evaluated.value.outcome,
      checks: evaluated.value.checks,
      decisionId: decision.id,
    },
  });

  let projectStatus = row.status;
  let transitioned = false;

  if (evaluated.value.approved) {
    const transition = await transitionProject(projectId, 'active', actorId);
    if (!transition.ok) {
      return { ok: false, errors: transition.errors };
    }
    projectStatus = transition.project.status;
    transitioned = true;
    await runProjectAutoAssignOnActivate(projectId, actorId);
  }

  return {
    ok: true,
    approved: evaluated.value.approved,
    decision,
    projectStatus,
    transitioned,
  };
}

/** Evaluate without persisting (for previews/tests). */
export function previewProjectAutoApproval(input: ProjectAutoApproveInputV1) {
  return evaluateProjectAutoApproveV1(input, PROJECT_AUTO_APPROVE_THRESHOLDS);
}

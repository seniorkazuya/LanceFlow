import { auditLog } from '@lanceflow/audit';
import { isAutoAssignEnabled } from '@lanceflow/config';
import { prisma } from '@lanceflow/database';
import {
  assignEngineerToProject,
  listProjectAssignments,
  suggestEngineersForProject,
} from '@lanceflow/operations';
import {
  ASSIGNMENT_RANK_FORMULA_V1,
  PROJECT_AUTO_ASSIGN_RULE_KEY,
} from '@lanceflow/rules-engine';

import { createRuleDecision, markLatestRuleDecisionOverridden } from '../rule-decisions/repository';
import type { RuleDecisionRecord } from '../rule-decisions/types';
import { validateOverrideAutoAssignInput } from './validate';

export type ProjectAutoAssignResult =
  | {
      ok: true;
      skipped: true;
      reason: string;
    }
  | {
      ok: true;
      skipped: false;
      assigned: boolean;
      decision: RuleDecisionRecord;
      assignmentId?: string;
    }
  | { ok: false; errors: { field: string; message: string }[] };

export type OverrideProjectAutoAssignInput = {
  userId: string;
  reason: string;
  requiredSkills?: string[];
};

export type OverrideProjectAutoAssignResult =
  | { ok: true; assignmentId: string; decision: RuleDecisionRecord }
  | { ok: false; errors: { field: string; message: string }[] };

async function persistAutoAssignDecision(params: {
  projectId: string;
  actorId: string;
  outcome: string;
  inputs: Record<string, unknown>;
  explanation: string[];
}): Promise<RuleDecisionRecord> {
  return createRuleDecision({
    entityType: 'project',
    entityId: params.projectId,
    ruleKey: PROJECT_AUTO_ASSIGN_RULE_KEY,
    formulaVersion: ASSIGNMENT_RANK_FORMULA_V1,
    inputs: params.inputs,
    outcome: params.outcome,
    explanation: params.explanation,
    actorId: params.actorId,
  });
}

/** Rank and assign top engineer when project is active (AUTO-003). */
export async function runProjectAutoAssignOnActivate(
  projectId: string,
  actorId: string,
  options?: { requiredSkills?: string[] }
): Promise<ProjectAutoAssignResult> {
  if (!isAutoAssignEnabled()) {
    return { ok: true, skipped: true, reason: 'auto_assign_disabled' };
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  if (project.status !== 'active') {
    return {
      ok: false,
      errors: [
        {
          field: 'status',
          message: 'Auto-assign only runs for active projects',
        },
      ],
    };
  }

  const existing = await listProjectAssignments(projectId);
  if (existing.length > 0) {
    const decision = await persistAutoAssignDecision({
      projectId,
      actorId,
      outcome: 'skipped',
      inputs: { reason: 'already_assigned', assignmentIds: existing.map((a) => a.id) },
      explanation: ['active assignment already exists'],
    });
    await auditLog({
      actorId,
      action: 'rule.project_auto_assign',
      entityType: 'project',
      entityId: projectId,
      payload: { outcome: 'skipped', reason: 'already_assigned', decisionId: decision.id },
    });
    return { ok: true, skipped: false, assigned: false, decision };
  }

  const requiredSkills = options?.requiredSkills ?? [];
  const suggestions = await suggestEngineersForProject(projectId, requiredSkills);
  if (!suggestions || suggestions.length === 0) {
    const decision = await persistAutoAssignDecision({
      projectId,
      actorId,
      outcome: 'no_candidate',
      inputs: { requiredSkills },
      explanation: ['no eligible engineers'],
    });
    await auditLog({
      actorId,
      action: 'rule.project_auto_assign',
      entityType: 'project',
      entityId: projectId,
      payload: { outcome: 'no_candidate', decisionId: decision.id },
    });
    return { ok: true, skipped: false, assigned: false, decision };
  }

  const top = suggestions[0];
  const assignResult = await assignEngineerToProject(
    projectId,
    { userId: top.userId, requiredSkills },
    actorId
  );

  if (!assignResult.ok) {
    return { ok: false, errors: assignResult.errors };
  }

  const decision = await persistAutoAssignDecision({
    projectId,
    actorId,
    outcome: 'assigned',
    inputs: {
      requiredSkills,
      selectedUserId: top.userId,
      rankScore: top.rankScore,
      skillMatchPct: top.skillMatchPct,
      displayName: top.displayName,
    },
    explanation: [
      `formula ${ASSIGNMENT_RANK_FORMULA_V1}`,
      `selected=${top.userId} score=${top.rankScore} skill=${top.skillMatchPct}%`,
    ],
  });

  await auditLog({
    actorId,
    action: 'rule.project_auto_assign',
    entityType: 'project',
    entityId: projectId,
    payload: {
      outcome: 'assigned',
      userId: top.userId,
      rankScore: top.rankScore,
      decisionId: decision.id,
      assignmentId: assignResult.assignment.id,
    },
  });

  return {
    ok: true,
    skipped: false,
    assigned: true,
    decision,
    assignmentId: assignResult.assignment.id,
  };
}

/** Manual override of auto-assign pick — audited (AUTO-003). */
export async function overrideProjectAutoAssign(
  projectId: string,
  input: OverrideProjectAutoAssignInput,
  actorId: string
): Promise<OverrideProjectAutoAssignResult> {
  const errors = validateOverrideAutoAssignInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  if (project.status !== 'active') {
    return {
      ok: false,
      errors: [{ field: 'status', message: 'Override only applies to active projects' }],
    };
  }

  await markLatestRuleDecisionOverridden('project', projectId, PROJECT_AUTO_ASSIGN_RULE_KEY);

  await prisma.assignment.updateMany({
    where: { projectId, releasedAt: null },
    data: { releasedAt: new Date() },
  });

  const requiredSkills = input.requiredSkills ?? [];
  const assignResult = await assignEngineerToProject(
    projectId,
    { userId: input.userId.trim(), requiredSkills },
    actorId
  );

  if (!assignResult.ok) {
    return { ok: false, errors: assignResult.errors };
  }

  const decision = await persistAutoAssignDecision({
    projectId,
    actorId,
    outcome: 'override',
    inputs: {
      userId: input.userId.trim(),
      reason: input.reason.trim(),
      requiredSkills,
    },
    explanation: [`manual override: ${input.reason.trim()}`],
  });

  await auditLog({
    actorId,
    action: 'assignment.auto_assign_override',
    entityType: 'project',
    entityId: projectId,
    payload: {
      userId: input.userId.trim(),
      reason: input.reason.trim(),
      assignmentId: assignResult.assignment.id,
      decisionId: decision.id,
    },
  });

  return { ok: true, assignmentId: assignResult.assignment.id, decision };
}

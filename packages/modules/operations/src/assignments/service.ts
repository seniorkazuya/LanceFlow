import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import {
  ASSIGNMENT_RANK_FORMULA_V1,
  rankEngineersForAssignmentV1,
} from '@lanceflow/rules-engine';
import { UserRole } from '@lanceflow/types';

import { normalizeSkillTags } from '../workers/validate';
import { countActiveAssignments } from '../workers/workload';
import type { AssignEngineerInput, AssignmentRecord, AssignmentSuggestion } from './types';

const assignmentInclude = {
  user: { select: { displayName: true, email: true } },
} as const;

function toRecord(row: {
  id: string;
  projectId: string;
  userId: string;
  skillScore: number | null;
  formulaVersion: string | null;
  assignedAt: Date;
  releasedAt: Date | null;
  user: { displayName: string; email: string };
}): AssignmentRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    userId: row.userId,
    engineerName: row.user.displayName,
    engineerEmail: row.user.email,
    skillScore: row.skillScore,
    formulaVersion: row.formulaVersion,
    assignedAt: row.assignedAt,
    releasedAt: row.releasedAt,
  };
}

const ASSIGNABLE_PROJECT_STATUSES = ['pending_approval', 'active'] as const;

export async function listProjectAssignments(projectId: string): Promise<AssignmentRecord[]> {
  const rows = await prisma.assignment.findMany({
    where: { projectId, releasedAt: null },
    orderBy: { assignedAt: 'desc' },
    include: assignmentInclude,
  });
  return rows.map(toRecord);
}

export async function suggestEngineersForProject(
  projectId: string,
  requiredSkills: string[]
): Promise<AssignmentSuggestion[] | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const skills = normalizeSkillTags(requiredSkills);
  const engineers = await prisma.user.findMany({
    where: { role: UserRole.ENGINEER, status: 'active' },
    include: { assignments: { select: { releasedAt: true } } },
  });

  const ranked = rankEngineersForAssignmentV1({
    requiredSkills: skills,
    candidates: engineers.map((e) => ({
      userId: e.id,
      skillTags: e.skillTags,
      activeAssignmentCount: countActiveAssignments(e.assignments),
    })),
  });

  const byId = new Map(engineers.map((e) => [e.id, e]));
  return ranked.map((row) => {
    const engineer = byId.get(row.userId)!;
    return {
      userId: row.userId,
      displayName: engineer.displayName,
      email: engineer.email,
      skillTags: engineer.skillTags,
      activeAssignmentCount: row.activeAssignmentCount,
      skillMatchPct: row.skillMatchPct,
      rankScore: row.rankScore,
    };
  });
}

export type AssignmentMutationResult =
  | { ok: true; assignment: AssignmentRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function assignEngineerToProject(
  projectId: string,
  input: AssignEngineerInput,
  actorId: string
): Promise<AssignmentMutationResult> {
  if (!input.userId?.trim()) {
    return { ok: false, errors: [{ field: 'userId', message: 'userId is required' }] };
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  if (!(ASSIGNABLE_PROJECT_STATUSES as readonly string[]).includes(project.status)) {
    return {
      ok: false,
      errors: [
        {
          field: 'status',
          message: 'Assign only when project is pending approval or active',
        },
      ],
    };
  }

  const engineer = await prisma.user.findFirst({
    where: { id: input.userId, role: UserRole.ENGINEER, status: 'active' },
    include: { assignments: { select: { releasedAt: true } } },
  });
  if (!engineer) {
    return { ok: false, errors: [{ field: 'userId', message: 'Engineer not found' }] };
  }

  const existing = await prisma.assignment.findFirst({
    where: { projectId, userId: input.userId, releasedAt: null },
  });
  if (existing) {
    return {
      ok: false,
      errors: [{ field: 'userId', message: 'Engineer already assigned to this project' }],
    };
  }

  const skills = normalizeSkillTags(input.requiredSkills);
  const [ranked] = rankEngineersForAssignmentV1({
    requiredSkills: skills,
    candidates: [
      {
        userId: engineer.id,
        skillTags: engineer.skillTags,
        activeAssignmentCount: countActiveAssignments(engineer.assignments),
      },
    ],
  });

  const skillScore = ranked?.rankScore ?? 0;

  const row = await prisma.assignment.create({
    data: {
      projectId,
      userId: input.userId,
      skillScore,
      formulaVersion: ASSIGNMENT_RANK_FORMULA_V1,
    },
    include: assignmentInclude,
  });

  const assignment = toRecord(row);
  await auditLog({
    actorId,
    action: 'assignment.create',
    entityType: 'assignment',
    entityId: assignment.id,
    payload: {
      projectId,
      userId: input.userId,
      skillScore,
      formulaVersion: ASSIGNMENT_RANK_FORMULA_V1,
      requiredSkills: skills,
    },
  });

  return { ok: true, assignment };
}

import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';

import type { UpdateWorkerSkillsInput, WorkerRecord } from './types';
import { normalizeSkillTags, validateUpdateWorkerSkillsInput } from './validate';
import { countActiveAssignments } from './workload';

function toRecord(row: {
  id: string;
  email: string;
  displayName: string;
  status: string;
  skillTags: string[];
  assignments: { releasedAt: Date | null }[];
}): WorkerRecord {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    status: row.status,
    skillTags: row.skillTags,
    activeAssignmentCount: countActiveAssignments(row.assignments),
  };
}

const workerInclude = {
  assignments: { select: { releasedAt: true } },
} as const;

export async function listWorkersWithWorkload(): Promise<WorkerRecord[]> {
  const rows = await prisma.user.findMany({
    where: { role: UserRole.ENGINEER, status: 'active' },
    orderBy: { displayName: 'asc' },
    include: workerInclude,
  });
  return rows.map(toRecord);
}

export async function getWorkerById(id: string): Promise<WorkerRecord | null> {
  const row = await prisma.user.findFirst({
    where: { id, role: UserRole.ENGINEER },
    include: workerInclude,
  });
  return row ? toRecord(row) : null;
}

export type WorkerMutationResult =
  | { ok: true; worker: WorkerRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function updateWorkerSkills(
  id: string,
  input: UpdateWorkerSkillsInput,
  actorId: string
): Promise<WorkerMutationResult> {
  const errors = validateUpdateWorkerSkillsInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const existing = await prisma.user.findFirst({
    where: { id, role: UserRole.ENGINEER },
  });
  if (!existing) {
    return { ok: false, errors: [{ field: 'id', message: 'Engineer not found' }] };
  }

  const skillTags = normalizeSkillTags(input.skillTags);
  const row = await prisma.user.update({
    where: { id },
    data: { skillTags },
    include: workerInclude,
  });

  const worker = toRecord(row);
  await auditLog({
    actorId,
    action: 'worker.skills_update',
    entityType: 'user',
    entityId: worker.id,
    payload: { skillTags },
  });

  return { ok: true, worker };
}

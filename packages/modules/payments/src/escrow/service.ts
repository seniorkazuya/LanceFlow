import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import {
  evaluateWorkGatingFromData,
  isProgressTransition,
} from './gating';
import type { EscrowOverrideInput, WorkGatingStatus } from './types';

export type WorkGatingCheckResult =
  | { ok: true; status: WorkGatingStatus }
  | { ok: false; errors: { field: string; message: string }[] };

export type EscrowOverrideResult =
  | { ok: true; status: WorkGatingStatus }
  | { ok: false; errors: { field: string; message: string }[] };

async function loadGatingContext(projectId: string, asOf: Date = new Date()) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      escrowHeld: true,
      escrowOverrideAt: true,
    },
  });
  if (!project) return null;

  const schedules = await prisma.paymentSchedule.findMany({
    where: { projectId, status: 'scheduled' },
    select: { id: true, dueDate: true, status: true },
  });

  return evaluateWorkGatingFromData(project, schedules, asOf);
}

/** PAY-002 — whether project work/progress should be blocked. */
export async function getWorkGatingStatus(
  projectId: string,
  asOf: Date = new Date()
): Promise<WorkGatingCheckResult> {
  const status = await loadGatingContext(projectId, asOf);
  if (!status) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }
  return { ok: true, status };
}

/** Returns error if a progress transition is blocked. */
export async function assertWorkAllowedForTransition(
  projectId: string,
  toStatus: string,
  asOf: Date = new Date()
): Promise<{ ok: true } | { ok: false; errors: { field: string; message: string }[] }> {
  if (!isProgressTransition(toStatus)) {
    return { ok: true };
  }

  const check = await getWorkGatingStatus(projectId, asOf);
  if (!check.ok) return check;
  if (check.status.blocked) {
    return {
      ok: false,
      errors: [{ field: 'workGating', message: check.status.message }],
    };
  }
  return { ok: true };
}

/** Ops escrow override / manual hold — audited (PAY-002). */
export async function applyEscrowOverride(
  projectId: string,
  input: EscrowOverrideInput,
  actorId: string
): Promise<EscrowOverrideResult> {
  const errors: { field: string; message: string }[] = [];

  if (!['release', 'clear_override', 'hold', 'unhold'].includes(input.action)) {
    errors.push({ field: 'action', message: 'Invalid action' });
  }

  if ((input.action === 'release' || input.action === 'hold') && !input.reason?.trim()) {
    errors.push({ field: 'reason', message: 'reason is required for release and hold' });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  const now = new Date();
  const data =
    input.action === 'release'
      ? {
          escrowOverrideReason: input.reason!.trim(),
          escrowOverrideBy: actorId,
          escrowOverrideAt: now,
          escrowHeld: false,
        }
      : input.action === 'clear_override'
        ? {
            escrowOverrideReason: null,
            escrowOverrideBy: null,
            escrowOverrideAt: null,
          }
        : input.action === 'hold'
          ? {
              escrowHeld: true,
              escrowOverrideReason: null,
              escrowOverrideBy: null,
              escrowOverrideAt: null,
            }
          : {
              escrowHeld: false,
            };

  await prisma.project.update({ where: { id: projectId }, data });

  await auditLog({
    actorId,
    action: `project_escrow.${input.action}`,
    entityType: 'project',
    entityId: projectId,
    payload: { action: input.action, reason: input.reason ?? null },
  });

  const status = await loadGatingContext(projectId);
  if (!status) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }
  return { ok: true, status };
}

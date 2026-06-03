import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import {
  DISPUTE_CEO_ESCALATION_CENTS,
  DISPUTE_SOP_LINK_ID,
  type CreateProjectDisputeInput,
  type DisputeStatus,
  type ProjectDisputeRecord,
  type TransitionProjectDisputeInput,
} from './types';
import {
  validateCreateProjectDisputeInput,
  validateTransitionProjectDisputeInput,
} from './validate';

function toRecord(row: {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  amountCents: number;
  currency: string;
  status: string;
  sopLinkId: string | null;
  escalatedAt: Date | null;
  escalatedBy: string | null;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  resolutionNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ProjectDisputeRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    amountCents: row.amountCents,
    currency: row.currency,
    status: row.status as DisputeStatus,
    sopLinkId: row.sopLinkId,
    escalatedAt: row.escalatedAt,
    escalatedBy: row.escalatedBy,
    resolvedAt: row.resolvedAt,
    resolvedBy: row.resolvedBy,
    resolutionNote: row.resolutionNote,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function upsertCeoDisputeException(
  dispute: ProjectDisputeRecord,
  projectTitle: string
): Promise<void> {
  if (dispute.amountCents < DISPUTE_CEO_ESCALATION_CENTS) return;

  await prisma.leadershipException.upsert({
    where: { sourceKey: `dispute:${dispute.id}` },
    create: {
      sourceKey: `dispute:${dispute.id}`,
      severity: 'danger',
      category: 'dispute',
      title: `High-value dispute: ${dispute.title}`,
      summary: `${(dispute.amountCents / 100).toFixed(2)} ${dispute.currency} · ${projectTitle}`,
      entityType: 'project_dispute',
      entityId: dispute.id,
      status: 'open',
      metadata: {
        projectId: dispute.projectId,
        amountCents: dispute.amountCents,
        sopLinkId: DISPUTE_SOP_LINK_ID,
      },
    },
    update: {
      severity: 'danger',
      title: `High-value dispute: ${dispute.title}`,
      summary: `${(dispute.amountCents / 100).toFixed(2)} ${dispute.currency} · ${projectTitle}`,
      status: 'open',
    },
  });
}

async function resolveCeoDisputeException(disputeId: string): Promise<void> {
  const existing = await prisma.leadershipException.findUnique({
    where: { sourceKey: `dispute:${disputeId}` },
  });
  if (existing?.status === 'open') {
    await prisma.leadershipException.update({
      where: { sourceKey: `dispute:${disputeId}` },
      data: { status: 'resolved' },
    });
  }
}

export type DisputeMutationResult =
  | { ok: true; dispute: ProjectDisputeRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function listProjectDisputes(
  projectId: string
): Promise<ProjectDisputeRecord[] | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return null;

  const rows = await prisma.projectDispute.findMany({
    where: { projectId },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });
  return rows.map(toRecord);
}

export async function createProjectDispute(
  projectId: string,
  input: CreateProjectDisputeInput,
  actorId: string
): Promise<DisputeMutationResult> {
  const errors = validateCreateProjectDisputeInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, errors: [{ field: 'projectId', message: 'Project not found' }] };
  }

  const row = await prisma.projectDispute.create({
    data: {
      projectId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      amountCents: input.amountCents,
      currency: input.currency?.trim().toUpperCase() ?? 'USD',
      sopLinkId: DISPUTE_SOP_LINK_ID,
    },
  });

  const dispute = toRecord(row);

  await auditLog({
    actorId,
    action: 'project_dispute.create',
    entityType: 'project_dispute',
    entityId: dispute.id,
    payload: {
      projectId,
      amountCents: dispute.amountCents,
      status: dispute.status,
    },
  });

  return { ok: true, dispute };
}

export async function transitionProjectDispute(
  disputeId: string,
  input: TransitionProjectDisputeInput,
  actorId: string
): Promise<DisputeMutationResult> {
  const existing = await prisma.projectDispute.findUnique({
    where: { id: disputeId },
    include: { project: { select: { title: true } } },
  });
  if (!existing) {
    return { ok: false, errors: [{ field: 'disputeId', message: 'Dispute not found' }] };
  }

  const from = existing.status as DisputeStatus;
  const errors = validateTransitionProjectDisputeInput(from, input);
  if (errors.length > 0) return { ok: false, errors };

  const now = new Date();
  const row = await prisma.projectDispute.update({
    where: { id: disputeId },
    data: {
      status: input.status,
      ...(input.status === 'escalated'
        ? { escalatedAt: now, escalatedBy: actorId }
        : {}),
      ...(input.status === 'resolved'
        ? {
            resolvedAt: now,
            resolvedBy: actorId,
            resolutionNote: input.resolutionNote!.trim(),
          }
        : {}),
    },
  });
  const dispute = toRecord(row);

  if (input.status === 'escalated') {
    await upsertCeoDisputeException(dispute, existing.project.title);
  }
  if (input.status === 'resolved') {
    await resolveCeoDisputeException(dispute.id);
  }

  await auditLog({
    actorId,
    action: `project_dispute.${input.status}`,
    entityType: 'project_dispute',
    entityId: dispute.id,
    payload: {
      from,
      to: input.status,
      amountCents: dispute.amountCents,
      ceoEscalation: dispute.amountCents >= DISPUTE_CEO_ESCALATION_CENTS,
    },
  });

  return { ok: true, dispute };
}

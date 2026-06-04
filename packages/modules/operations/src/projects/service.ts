import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { allowedTransitionsFrom, canTransition } from './transitions';
import type {
  CreateProjectInput,
  ProjectRecord,
  ProjectStatus,
  UpdateProjectInput,
} from './types';
import {
  isProjectStatus,
  validateCreateProjectInput,
  validateUpdateProjectInput,
} from './validate';

function toRecord(row: {
  id: string;
  clientId: string;
  title: string;
  status: string;
  scopeClarityPct: number | null;
  profitMarginPct: number | null;
  clientRiskAtCreate: number | null;
  createdAt: Date;
  updatedAt: Date;
  client: { name: string };
}): ProjectRecord {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.client.name,
    title: row.title,
    status: row.status as ProjectStatus,
    scopeClarityPct: row.scopeClarityPct,
    profitMarginPct: row.profitMarginPct,
    clientRiskAtCreate: row.clientRiskAtCreate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const projectInclude = { client: { select: { name: true } } } as const;

export type ProjectMutationResult =
  | { ok: true; project: ProjectRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function listProjects(): Promise<ProjectRecord[]> {
  const rows = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toRecord);
}

/** Portal clients see projects whose ops client record matches their login email. */
export async function listProjectsForPortalClient(contactEmail: string): Promise<ProjectRecord[]> {
  const normalized = contactEmail.trim().toLowerCase();
  if (!normalized) return [];

  const rows = await prisma.project.findMany({
    where: {
      client: {
        contactEmail: { equals: normalized, mode: 'insensitive' },
      },
    },
    include: projectInclude,
    orderBy: { updatedAt: 'desc' },
  });
  return rows.map(toRecord);
}

export async function portalClientCanAccessProject(
  contactEmail: string,
  projectId: string
): Promise<boolean> {
  const normalized = contactEmail.trim().toLowerCase();
  if (!normalized) return false;

  const count = await prisma.project.count({
    where: {
      id: projectId,
      client: {
        contactEmail: { equals: normalized, mode: 'insensitive' },
      },
    },
  });
  return count > 0;
}

export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const row = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  return row ? toRecord(row) : null;
}

export async function createProject(
  input: CreateProjectInput,
  actorId: string
): Promise<ProjectMutationResult> {
  const errors = validateCreateProjectInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const client = await prisma.client.findUnique({ where: { id: input.clientId } });
  if (!client) return { ok: false, errors: [{ field: 'clientId', message: 'Client not found' }] };

  const row = await prisma.project.create({
    data: {
      clientId: input.clientId,
      title: input.title.trim(),
      status: 'draft',
      scopeClarityPct: input.scopeClarityPct ?? null,
      profitMarginPct: input.profitMarginPct ?? null,
      clientRiskAtCreate: client.riskScore,
    },
    include: projectInclude,
  });

  const project = toRecord(row);
  await auditLog({
    actorId,
    action: 'project.create',
    entityType: 'project',
    entityId: project.id,
    payload: { title: project.title, clientId: project.clientId, status: project.status },
  });

  return { ok: true, project };
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
  actorId: string
): Promise<ProjectMutationResult> {
  const errors = validateUpdateProjectInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Project not found' }] };

  const row = await prisma.project.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.scopeClarityPct !== undefined ? { scopeClarityPct: input.scopeClarityPct } : {}),
      ...(input.profitMarginPct !== undefined ? { profitMarginPct: input.profitMarginPct } : {}),
    },
    include: projectInclude,
  });

  const project = toRecord(row);
  await auditLog({
    actorId,
    action: 'project.update',
    entityType: 'project',
    entityId: project.id,
    payload: { changes: input },
  });

  return { ok: true, project };
}

export async function transitionProject(
  id: string,
  toStatus: string,
  actorId: string
): Promise<ProjectMutationResult> {
  if (!isProjectStatus(toStatus)) {
    return { ok: false, errors: [{ field: 'status', message: 'Invalid status' }] };
  }

  const existing = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Project not found' }] };

  const fromStatus = existing.status as ProjectStatus;
  if (!canTransition(fromStatus, toStatus)) {
    return {
      ok: false,
      errors: [
        {
          field: 'status',
          message: `Cannot transition from ${fromStatus} to ${toStatus}`,
        },
      ],
    };
  }

  const row = await prisma.project.update({
    where: { id },
    data: { status: toStatus },
    include: projectInclude,
  });

  const project = toRecord(row);
  await auditLog({
    actorId,
    action: 'project.transition',
    entityType: 'project',
    entityId: project.id,
    payload: { from: fromStatus, to: toStatus },
  });

  return { ok: true, project };
}

export { allowedTransitionsFrom };

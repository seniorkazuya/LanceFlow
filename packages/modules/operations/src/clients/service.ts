import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import type {
  ClientRecord,
  ClientStatus,
  CreateClientInput,
  RiskScoreSource,
  UpdateClientInput,
} from './types';
import { validateCreateClientInput, validateUpdateClientInput } from './validate';

function toRecord(row: {
  id: string;
  name: string;
  contactEmail: string | null;
  status: string;
  riskScore: number;
  riskScoreSource: string;
  riskFormulaVersion: string | null;
  riskOverrideReason: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ClientRecord {
  return {
    id: row.id,
    name: row.name,
    contactEmail: row.contactEmail,
    status: row.status as ClientStatus,
    riskScore: row.riskScore,
    riskScoreSource: row.riskScoreSource as RiskScoreSource,
    riskFormulaVersion: row.riskFormulaVersion,
    riskOverrideReason: row.riskOverrideReason,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listClients(includeArchived = false): Promise<ClientRecord[]> {
  const rows = await prisma.client.findMany({
    where: includeArchived ? undefined : { status: 'active' },
    orderBy: { name: 'asc' },
  });
  return rows.map(toRecord);
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  const row = await prisma.client.findUnique({ where: { id } });
  return row ? toRecord(row) : null;
}

export type ClientMutationResult =
  | { ok: true; client: ClientRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function createClient(
  input: CreateClientInput,
  actorId: string
): Promise<ClientMutationResult> {
  const errors = validateCreateClientInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const row = await prisma.client.create({
    data: {
      name: input.name.trim(),
      contactEmail: input.contactEmail?.trim() || null,
      riskScore: input.riskScore ?? 0,
      riskScoreSource: 'default',
      notes: input.notes?.trim() || null,
    },
  });

  const client = toRecord(row);
  await auditLog({
    actorId,
    action: 'client.create',
    entityType: 'client',
    entityId: client.id,
    payload: { name: client.name, riskScore: client.riskScore },
  });

  return { ok: true, client };
}

export async function updateClient(
  id: string,
  input: UpdateClientInput,
  actorId: string
): Promise<ClientMutationResult> {
  const errors = validateUpdateClientInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Client not found' }] };

  const row = await prisma.client.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.contactEmail !== undefined
        ? { contactEmail: input.contactEmail?.trim() || null }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.notes !== undefined ? { notes: input.notes?.trim() || null } : {}),
    },
  });

  const client = toRecord(row);
  await auditLog({
    actorId,
    action: 'client.update',
    entityType: 'client',
    entityId: client.id,
    payload: { changes: input },
  });

  return { ok: true, client };
}

export async function archiveClient(id: string, actorId: string): Promise<ClientMutationResult> {
  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Client not found' }] };

  const row = await prisma.client.update({
    where: { id },
    data: { status: 'archived' },
  });

  const client = toRecord(row);
  await auditLog({
    actorId,
    action: 'client.archive',
    entityType: 'client',
    entityId: client.id,
    payload: { name: client.name },
  });

  return { ok: true, client };
}

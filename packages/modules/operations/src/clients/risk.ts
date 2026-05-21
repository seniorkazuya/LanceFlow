import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { CLIENT_RISK_FORMULA_V0, computeClientRiskV0 } from './risk-v0';
import type { ClientMutationResult } from './service';
import type { ClientRecord, OverrideClientRiskInput } from './types';
import { validateOverrideClientRiskInput } from './validate';

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
    status: row.status as ClientRecord['status'],
    riskScore: row.riskScore,
    riskScoreSource: row.riskScoreSource as ClientRecord['riskScoreSource'],
    riskFormulaVersion: row.riskFormulaVersion,
    riskOverrideReason: row.riskOverrideReason,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Run v0 risk evaluation and persist score (OPS-002). */
export async function evaluateClientRisk(
  clientId: string,
  actorId: string
): Promise<ClientMutationResult> {
  const existing = await prisma.client.findUnique({ where: { id: clientId } });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Client not found' }] };

  const computed = computeClientRiskV0({
    hasContactEmail: Boolean(existing.contactEmail),
    notesLength: existing.notes?.length ?? 0,
  });

  const row = await prisma.client.update({
    where: { id: clientId },
    data: {
      riskScore: computed,
      riskScoreSource: 'evaluated',
      riskFormulaVersion: CLIENT_RISK_FORMULA_V0,
      riskOverrideReason: null,
    },
  });

  const client = toRecord(row);
  await auditLog({
    actorId,
    action: 'client.risk_evaluate',
    entityType: 'client',
    entityId: client.id,
    payload: {
      formulaVersion: CLIENT_RISK_FORMULA_V0,
      previousScore: existing.riskScore,
      newScore: computed,
      inputs: {
        hasContactEmail: Boolean(existing.contactEmail),
        notesLength: existing.notes?.length ?? 0,
      },
    },
  });

  return { ok: true, client };
}

/** Manual risk override — Ops only path with audited reason (OPS-002). */
export async function overrideClientRisk(
  clientId: string,
  input: OverrideClientRiskInput,
  actorId: string
): Promise<ClientMutationResult> {
  const errors = validateOverrideClientRiskInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const existing = await prisma.client.findUnique({ where: { id: clientId } });
  if (!existing) return { ok: false, errors: [{ field: 'id', message: 'Client not found' }] };

  const row = await prisma.client.update({
    where: { id: clientId },
    data: {
      riskScore: input.riskScore,
      riskScoreSource: 'manual',
      riskFormulaVersion: null,
      riskOverrideReason: input.reason.trim(),
    },
  });

  const client = toRecord(row);
  await auditLog({
    actorId,
    action: 'client.risk_override',
    entityType: 'client',
    entityId: client.id,
    payload: {
      previousScore: existing.riskScore,
      newScore: input.riskScore,
      reason: input.reason.trim(),
    },
  });

  return { ok: true, client };
}

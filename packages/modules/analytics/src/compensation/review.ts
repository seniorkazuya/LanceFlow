import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { toCompensationSuggestionRecord } from './serialize';
import type { CompensationSuggestionRecord, CompensationSuggestionReviewInput } from './types';

export type ReviewCompensationSuggestionResult =
  | { ok: true; suggestion: CompensationSuggestionRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function reviewCompensationSuggestion(
  id: string,
  input: CompensationSuggestionReviewInput,
  actorId: string
): Promise<ReviewCompensationSuggestionResult> {
  const errors: { field: string; message: string }[] = [];

  if (input.action !== 'approve' && input.action !== 'reject') {
    errors.push({ field: 'action', message: 'Must be approve or reject' });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const existing = await prisma.compensationSuggestion.findUnique({
    where: { id },
    include: { user: { select: { displayName: true, role: true } } },
  });

  if (!existing) {
    return { ok: false, errors: [{ field: 'id', message: 'Suggestion not found' }] };
  }

  if (existing.status !== 'pending') {
    return {
      ok: false,
      errors: [{ field: 'status', message: `Already ${existing.status}` }],
    };
  }

  const status = input.action === 'approve' ? 'approved' : 'rejected';
  const reviewedAt = new Date();

  const row = await prisma.compensationSuggestion.update({
    where: { id },
    data: {
      status,
      reviewedBy: actorId,
      reviewedAt,
      reviewNote: input.note?.trim() || null,
    },
    include: { user: { select: { displayName: true, role: true } } },
  });

  await auditLog({
    actorId,
    action: `compensation_suggestion.${status}`,
    entityType: 'compensation_suggestion',
    entityId: id,
    payload: {
      userId: row.userId,
      periodKey: row.periodKey,
      kind: row.kind,
      percentBps: row.percentBps,
      kpiScore: row.kpiScore,
      note: input.note ?? null,
    },
  });

  return { ok: true, suggestion: toCompensationSuggestionRecord(row) };
}

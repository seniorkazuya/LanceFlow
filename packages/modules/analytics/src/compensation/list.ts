import { prisma } from '@lanceflow/database';

import type { CompensationSuggestionRecord } from './types';

export async function listCompensationSuggestions(options?: {
  status?: string;
  periodKey?: string;
  limit?: number;
}): Promise<CompensationSuggestionRecord[]> {
  const rows = await prisma.compensationSuggestion.findMany({
    where: {
      ...(options?.status ? { status: options.status } : {}),
      ...(options?.periodKey ? { periodKey: options.periodKey } : {}),
    },
    include: { user: { select: { displayName: true, role: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: options?.limit ?? 50,
  });

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    userDisplayName: row.user.displayName,
    userRole: row.user.role,
    periodKey: row.periodKey,
    kind: row.kind as 'bonus' | 'penalty',
    percentBps: row.percentBps,
    kpiScore: row.kpiScore,
    formulaVersion: row.formulaVersion,
    status: row.status as CompensationSuggestionRecord['status'],
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    reviewNote: row.reviewNote,
    createdAt: row.createdAt.toISOString(),
  }));
}

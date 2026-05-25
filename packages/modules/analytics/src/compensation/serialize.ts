import type { CompensationSuggestionRecord } from './types';

type RowWithUser = {
  id: string;
  userId: string;
  periodKey: string;
  kind: string;
  percentBps: number;
  kpiScore: number;
  formulaVersion: string;
  status: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
  createdAt: Date;
  user: { displayName: string; role: string };
};

export function toCompensationSuggestionRecord(row: RowWithUser): CompensationSuggestionRecord {
  return {
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
  };
}

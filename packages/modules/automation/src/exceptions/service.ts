import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import type { Prisma } from '@prisma/client';

import { collectExceptionCandidates } from './sync';
import type {
  ExceptionInboxSummary,
  ExceptionSeverity,
  ExceptionStatus,
  LeadershipExceptionRecord,
  UpsertExceptionInput,
} from './types';

function toRecord(row: {
  id: string;
  sourceKey: string;
  severity: string;
  category: string;
  title: string;
  summary: string;
  entityType: string;
  entityId: string;
  status: string;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}): LeadershipExceptionRecord {
  return {
    id: row.id,
    sourceKey: row.sourceKey,
    severity: row.severity as ExceptionSeverity,
    category: row.category,
    title: row.title,
    summary: row.summary,
    entityType: row.entityType,
    entityId: row.entityId,
    status: row.status as ExceptionStatus,
    acknowledgedAt: row.acknowledgedAt,
    acknowledgedBy: row.acknowledgedBy,
    metadata:
      row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function upsertOpenException(input: UpsertExceptionInput): Promise<void> {
  const existing = await prisma.leadershipException.findUnique({
    where: { sourceKey: input.sourceKey },
  });

  if (existing?.status === 'acknowledged') {
    return;
  }

  await prisma.leadershipException.upsert({
    where: { sourceKey: input.sourceKey },
    create: {
      sourceKey: input.sourceKey,
      severity: input.severity,
      category: input.category,
      title: input.title,
      summary: input.summary,
      entityType: input.entityType,
      entityId: input.entityId,
      status: 'open',
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    update: {
      severity: input.severity,
      category: input.category,
      title: input.title,
      summary: input.summary,
      entityType: input.entityType,
      entityId: input.entityId,
      status: existing?.status === 'resolved' ? 'open' : existing?.status ?? 'open',
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

/** Refresh inbox from live signals; resolves open rows no longer in candidates. */
export async function syncLeadershipExceptions(): Promise<ExceptionInboxSummary> {
  const candidates = await collectExceptionCandidates();
  const activeKeys = new Set(candidates.map((c) => c.sourceKey));

  for (const candidate of candidates) {
    await upsertOpenException(candidate);
  }

  const openRows = await prisma.leadershipException.findMany({
    where: { status: 'open' },
  });

  for (const row of openRows) {
    if (!activeKeys.has(row.sourceKey)) {
      await prisma.leadershipException.update({
        where: { id: row.id },
        data: { status: 'resolved' },
      });
    }
  }

  return summarizeInbox(
    await prisma.leadershipException.findMany({
      where: { status: { in: ['open', 'acknowledged'] } },
    })
  );
}

function summarizeInbox(
  rows: { status: string; severity: string }[]
): ExceptionInboxSummary {
  const openRows = rows.filter((r) => r.status === 'open');
  return {
    open: openRows.length,
    danger: openRows.filter((r) => r.severity === 'danger').length,
    warning: openRows.filter((r) => r.severity === 'warning').length,
    success: openRows.filter((r) => r.severity === 'success').length,
  };
}

const SEVERITY_ORDER: Record<ExceptionSeverity, number> = {
  danger: 0,
  warning: 1,
  success: 2,
};

export async function listLeadershipExceptions(options?: {
  status?: ExceptionStatus | 'active';
  /** CEO inbox: only critical (danger) items (PAY-004). */
  minSeverity?: ExceptionSeverity;
  limit?: number;
}): Promise<LeadershipExceptionRecord[]> {
  const statusFilter =
    options?.status === 'active'
      ? { in: ['open', 'acknowledged'] as string[] }
      : options?.status
        ? options.status
        : 'open';

  const rows = await prisma.leadershipException.findMany({
    where: {
      status: typeof statusFilter === 'string' ? statusFilter : statusFilter,
      ...(options?.minSeverity ? { severity: options.minSeverity } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take: options?.limit ?? 100,
  });

  return rows
    .map(toRecord)
    .sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'open') return -1;
        if (b.status === 'open') return 1;
      }
      return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    });
}

export async function getExceptionInboxSummary(options?: {
  minSeverity?: ExceptionSeverity;
}): Promise<ExceptionInboxSummary> {
  const rows = await prisma.leadershipException.findMany({
    where: {
      status: { in: ['open', 'acknowledged'] },
      ...(options?.minSeverity ? { severity: options.minSeverity } : {}),
    },
  });
  return summarizeInbox(rows);
}

export type AcknowledgeExceptionResult =
  | { ok: true; exception: LeadershipExceptionRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function acknowledgeLeadershipException(
  id: string,
  actorId: string
): Promise<AcknowledgeExceptionResult> {
  const existing = await prisma.leadershipException.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, errors: [{ field: 'id', message: 'Exception not found' }] };
  }

  const row = await prisma.leadershipException.update({
    where: { id },
    data: {
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      acknowledgedBy: actorId,
    },
  });

  const exception = toRecord(row);

  await auditLog({
    actorId,
    action: 'exception.acknowledge',
    entityType: 'leadership_exception',
    entityId: exception.id,
    payload: {
      sourceKey: exception.sourceKey,
      severity: exception.severity,
      category: exception.category,
    },
  });

  return { ok: true, exception };
}

import { prisma } from '@lanceflow/database';

import type { AuditLogPage, AuditLogQuery, AuditLogRecord } from './types';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function normalizeAuditPagination(query: AuditLogQuery): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(query.pageSize ?? DEFAULT_PAGE_SIZE))
  );
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

function toRecord(row: {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  payload: unknown;
  createdAt: Date;
}): AuditLogRecord {
  return {
    id: row.id,
    actorId: row.actorId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    payload: row.payload,
    createdAt: row.createdAt,
  };
}

/** Paginated audit log query — newest first. */
export async function queryAuditLogs(query: AuditLogQuery = {}): Promise<AuditLogPage> {
  const { page, pageSize, skip } = normalizeAuditPagination(query);

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ]);

  return {
    items: rows.map(toRecord),
    total,
    page,
    pageSize,
  };
}

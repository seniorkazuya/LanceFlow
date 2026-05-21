import type { Paginated } from '@lanceflow/types';

export type AuditLogInput = {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  payload?: Record<string, unknown> | null;
};

export type AuditLogRecord = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  payload: unknown;
  createdAt: Date;
};

export type AuditLogQuery = {
  page?: number;
  pageSize?: number;
};

export type AuditLogPage = Paginated<AuditLogRecord>;

import type { LeadershipExceptionRecord } from '@lanceflow/automation';

export function serializeException(row: LeadershipExceptionRecord) {
  return {
    id: row.id,
    sourceKey: row.sourceKey,
    severity: row.severity,
    category: row.category,
    title: row.title,
    summary: row.summary,
    entityType: row.entityType,
    entityId: row.entityId,
    status: row.status,
    acknowledgedAt: row.acknowledgedAt?.toISOString() ?? null,
    acknowledgedBy: row.acknowledgedBy,
    metadata: row.metadata,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function entityHref(entityType: string, entityId: string): string | null {
  switch (entityType) {
    case 'project':
      return `/projects/${entityId}`;
    case 'client':
      return `/clients/${entityId}`;
    case 'payment_schedule':
      return null;
    default:
      return null;
  }
}

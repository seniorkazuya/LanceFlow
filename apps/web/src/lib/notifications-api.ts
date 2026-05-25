import type { NotificationRecord } from '@lanceflow/automation';

export function serializeNotification(row: NotificationRecord) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    metadata: row.metadata,
  };
}

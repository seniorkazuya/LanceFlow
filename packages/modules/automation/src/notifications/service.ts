import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import type { Prisma } from '@prisma/client';

import { getEmailAdapter } from './email';
import type { NotificationRecord, NotifyUserInput } from './types';

function toRecord(row: {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  metadata: unknown;
  createdAt: Date;
}): NotificationRecord {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.readAt,
    metadata:
      row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
        ? (row.metadata as Record<string, unknown>)
        : null,
    createdAt: row.createdAt,
  };
}

export async function notifyUser(
  input: NotifyUserInput,
  actorId: string | null = null
): Promise<NotificationRecord> {
  const row = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title.trim(),
      body: input.body.trim(),
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });

  const notification = toRecord(row);

  let emailSent = false;
  if (input.sendEmail) {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true },
    });
    if (user?.email) {
      const adapter = getEmailAdapter();
      const result = await adapter.send({
        to: user.email,
        subject: input.title,
        text: input.body,
      });
      emailSent = result.ok;
    }
  }

  await auditLog({
    actorId,
    action: 'notification.create',
    entityType: 'notification',
    entityId: notification.id,
    payload: {
      userId: input.userId,
      type: input.type,
      emailSent,
      emailProvider: input.sendEmail ? getEmailAdapter().provider : null,
    },
  });

  return notification;
}

export async function listNotificationsForUser(
  userId: string,
  options?: { limit?: number; unreadOnly?: boolean }
): Promise<NotificationRecord[]> {
  const limit = options?.limit ?? 30;
  const rows = await prisma.notification.findMany({
    where: {
      userId,
      ...(options?.unreadOnly ? { readAt: null } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.map(toRecord);
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

export type MarkNotificationReadResult =
  | { ok: true; notification: NotificationRecord }
  | { ok: false; errors: { field: string; message: string }[] };

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<MarkNotificationReadResult> {
  const existing = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!existing) {
    return { ok: false, errors: [{ field: 'id', message: 'Notification not found' }] };
  }

  if (existing.readAt) {
    return { ok: true, notification: toRecord(existing) };
  }

  const row = await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });

  return { ok: true, notification: toRecord(row) };
}

/** Notify all active CEO/Ops users (e.g. payment escalation). */
export async function notifyOpsManagers(
  input: Omit<NotifyUserInput, 'userId'>,
  actorId: string | null = null
): Promise<NotificationRecord[]> {
  const managers = await prisma.user.findMany({
    where: { role: { in: ['CEO', 'OPS_MANAGER'] }, status: 'active' },
    select: { id: true },
  });

  const results: NotificationRecord[] = [];
  for (const manager of managers) {
    const row = await notifyUser({ ...input, userId: manager.id }, actorId);
    results.push(row);
  }
  return results;
}

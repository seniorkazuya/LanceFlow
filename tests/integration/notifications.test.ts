import { notifyUser, listNotificationsForUser, markNotificationRead } from '@lanceflow/automation';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: notifications (AUTO-007)', () => {
  const userIds: string[] = [];
  const notificationIds: string[] = [];

  afterAll(async () => {
    if (notificationIds.length > 0) {
      await prisma.notification.deleteMany({ where: { id: { in: notificationIds } } });
    }
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('creates in-app notification and marks read', async () => {
    const user = await prisma.user.create({
      data: {
        email: `notify-${Date.now()}@test.local`,
        displayName: 'Notify Test',
        role: UserRole.OPS_MANAGER,
      },
    });
    userIds.push(user.id);

    const created = await notifyUser(
      {
        userId: user.id,
        type: 'test',
        title: 'Test alert',
        body: 'Integration notification body',
      },
      user.id
    );
    notificationIds.push(created.id);

    const listed = await listNotificationsForUser(user.id, { unreadOnly: true });
    expect(listed.some((n) => n.id === created.id)).toBe(true);

    const read = await markNotificationRead(created.id, user.id);
    expect(read.ok).toBe(true);
    if (read.ok) {
      expect(read.notification.readAt).not.toBeNull();
    }
  });
});

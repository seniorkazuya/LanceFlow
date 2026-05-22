import { createClient, createProject } from '@lanceflow/operations';
import {
  createPaymentSchedule,
  listPaymentSchedulesForProject,
  updatePaymentSchedule,
} from '@lanceflow/payments';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: payment schedules (AUTO-004)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const scheduleIds: string[] = [];
  const actorId = 'test-actor-auto-004';

  afterAll(async () => {
    if (scheduleIds.length > 0) {
      await prisma.paymentSchedule.deleteMany({ where: { id: { in: scheduleIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    await prisma.$disconnect();
  });

  it('creates schedule with escalationLevel 0 and updates status', async () => {
    const client = await createClient({ name: `Pay Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: `Pay Project ${Date.now()}` },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const created = await createPaymentSchedule(
      project.project.id,
      { dueDate: '2026-07-15', amountCents: 125000, notes: 'Milestone 1' },
      actorId
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    scheduleIds.push(created.schedule.id);
    expect(created.schedule.escalationLevel).toBe(0);
    expect(created.schedule.status).toBe('scheduled');

    const listed = await listPaymentSchedulesForProject(project.project.id);
    expect(listed?.length).toBe(1);

    const updated = await updatePaymentSchedule(
      created.schedule.id,
      { status: 'paid', escalationLevel: 1 },
      actorId
    );
    expect(updated.ok).toBe(true);
    if (!updated.ok) return;
    expect(updated.schedule.status).toBe('paid');
    expect(updated.schedule.escalationLevel).toBe(1);
    expect(updated.schedule.paidAt).not.toBeNull();
  });
});

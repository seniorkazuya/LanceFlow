import { createClient, createProject } from '@lanceflow/operations';
import { createPaymentSchedule, processPaymentEscalations } from '@lanceflow/payments';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: payment escalation (AUTO-005)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const scheduleIds: string[] = [];
  const actorId = 'test-actor-auto-005';

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

  it('escalates overdue scheduled payment to level 3 after 7 days', async () => {
    const client = await createClient({ name: `Escalation Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: `Escalation Project ${Date.now()}` },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const created = await createPaymentSchedule(
      project.project.id,
      { dueDate: '2026-05-01', amountCents: 10000 },
      actorId
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    scheduleIds.push(created.schedule.id);

    const result = await processPaymentEscalations(new Date('2026-05-08T12:00:00Z'), actorId);
    expect(result.updated.length).toBeGreaterThanOrEqual(1);

    const row = await prisma.paymentSchedule.findUnique({
      where: { id: created.schedule.id },
    });
    expect(row?.escalationLevel).toBe(3);
  });
});

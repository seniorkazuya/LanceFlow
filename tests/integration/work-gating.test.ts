import {
  applyEscrowOverride,
  assertWorkAllowedForTransition,
  getWorkGatingStatus,
} from '@lanceflow/payments';
import { createClient, createProject } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: work gating (PAY-002)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const scheduleIds: string[] = [];
  const actorId = 'test-actor-pay-002';

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

  it('blocks progress transition when payment is overdue', async () => {
    const client = await createClient({ name: `Escrow ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Escrow Gating Project', status: 'pending_approval' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const schedule = await prisma.paymentSchedule.create({
      data: {
        projectId: project.project.id,
        dueDate: new Date('2026-05-10'),
        amountCents: 10000,
        status: 'scheduled',
      },
    });
    scheduleIds.push(schedule.id);

    const gate = await assertWorkAllowedForTransition(
      project.project.id,
      'active',
      new Date('2026-05-20')
    );
    expect(gate.ok).toBe(false);

    const released = await applyEscrowOverride(
      project.project.id,
      { action: 'release', reason: 'Client paid offline' },
      actorId
    );
    expect(released.ok).toBe(true);

    const after = await assertWorkAllowedForTransition(
      project.project.id,
      'active',
      new Date('2026-05-20')
    );
    expect(after.ok).toBe(true);

    const status = await getWorkGatingStatus(project.project.id, new Date('2026-05-20'));
    expect(status.ok).toBe(true);
    if (status.ok) {
      expect(status.status.overrideActive).toBe(true);
    }
  });
});

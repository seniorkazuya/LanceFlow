import {
  listPaymentSchedulesForProject,
  processPaymentEscalations,
  setProjectMilestones,
} from '@lanceflow/payments';
import { createClient, createProject } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: milestone payment reminders (PAY-003)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const scheduleIds: string[] = [];
  const actorId = 'test-actor-pay-003';

  afterAll(async () => {
    if (scheduleIds.length > 0) {
      await prisma.paymentSchedule.deleteMany({ where: { id: { in: scheduleIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.projectMilestone.deleteMany({ where: { projectId: { in: projectIds } } });
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
  });

  it('syncs linked schedules and escalates on milestone due date', async () => {
    const client = await createClient({ name: `Pay-003 ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Milestone Reminder Project' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const result = await setProjectMilestones(
      project.project.id,
      {
        milestones: [
          {
            label: 'Deposit',
            percentPct: 100,
            dueDate: '2026-05-01',
            amountCents: 25000,
          },
        ],
      },
      actorId
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.scheduleSync.created).toBe(1);

    const schedules = await listPaymentSchedulesForProject(project.project.id);
    expect(schedules?.length).toBe(1);
    expect(schedules?.[0].dueDate.toISOString().slice(0, 10)).toBe('2026-05-01');

    if (schedules?.[0]) scheduleIds.push(schedules[0].id);

    const escalation = await processPaymentEscalations(
      new Date('2026-05-08T12:00:00Z'),
      actorId
    );
    expect(escalation.updated.length).toBeGreaterThanOrEqual(1);

    const audit = await prisma.auditLog.findFirst({
      where: {
        action: 'payment_schedule.risk_flag_day7',
        entityId: schedules?.[0]?.id,
      },
      orderBy: { createdAt: 'desc' },
    });
    const payload = audit?.payload as { milestoneLabel?: string } | null;
    expect(payload?.milestoneLabel).toBe('Deposit');
  });
});

import {
  DISPUTE_CEO_ESCALATION_CENTS,
  createClient,
  createProject,
  createProjectDispute,
  transitionProjectDispute,
} from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: project disputes (PAY-005)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const disputeIds: string[] = [];
  const actorId = 'test-actor-pay-005';

  afterAll(async () => {
    if (disputeIds.length > 0) {
      await prisma.leadershipException.deleteMany({
        where: { sourceKey: { startsWith: 'dispute:' } },
      });
      await prisma.projectDispute.deleteMany({ where: { id: { in: disputeIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
  });

  it('escalates high-value dispute to CEO exception inbox', async () => {
    const client = await createClient({ name: `Dispute Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Dispute Project' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const created = await createProjectDispute(
      project.project.id,
      {
        title: 'Client refund dispute',
        amountCents: DISPUTE_CEO_ESCALATION_CENTS,
      },
      actorId
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    disputeIds.push(created.dispute.id);

    const investigating = await transitionProjectDispute(
      created.dispute.id,
      { status: 'investigating' },
      actorId
    );
    expect(investigating.ok).toBe(true);

    const escalated = await transitionProjectDispute(
      created.dispute.id,
      { status: 'escalated' },
      actorId
    );
    expect(escalated.ok).toBe(true);

    const exception = await prisma.leadershipException.findUnique({
      where: { sourceKey: `dispute:${created.dispute.id}` },
    });
    expect(exception?.severity).toBe('danger');
    expect(exception?.category).toBe('dispute');
  });
});

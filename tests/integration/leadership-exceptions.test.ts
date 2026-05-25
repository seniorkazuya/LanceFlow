import { createClient, createProject, transitionProject } from '@lanceflow/operations';
import {
  acknowledgeLeadershipException,
  listLeadershipExceptions,
  syncLeadershipExceptions,
} from '@lanceflow/automation';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: leadership exceptions (AUTO-008)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const exceptionIds: string[] = [];
  const actorId = 'test-actor-auto-008';

  afterAll(async () => {
    if (exceptionIds.length > 0) {
      await prisma.leadershipException.deleteMany({ where: { id: { in: exceptionIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    await prisma.$disconnect();
  });

  it('syncs pending approval project into open exception inbox', async () => {
    const client = await createClient({ name: `Exception Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      {
        clientId: client.client.id,
        title: `Pending Approval ${Date.now()}`,
        profitMarginPct: 20,
        scopeClarityPct: 80,
      },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const submitted = await transitionProject(project.project.id, 'pending_approval', actorId);
    expect(submitted.ok).toBe(true);

    const summary = await syncLeadershipExceptions();
    expect(summary.open).toBeGreaterThanOrEqual(1);

    const items = await listLeadershipExceptions({ status: 'open' });
    const match = items.find(
      (row) =>
        row.entityType === 'project' &&
        row.entityId === project.project.id &&
        row.category === 'project_approval'
    );
    expect(match).toBeDefined();
    if (!match) return;
    exceptionIds.push(match.id);

    const ack = await acknowledgeLeadershipException(match.id, actorId);
    expect(ack.ok).toBe(true);
    if (ack.ok) {
      expect(ack.exception.status).toBe('acknowledged');
    }

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'exception.acknowledge', entityId: match.id },
      orderBy: { createdAt: 'desc' },
    });
    expect(audit).not.toBeNull();
  });
});

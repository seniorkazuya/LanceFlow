import { collectFraudExceptionCandidates, syncLeadershipExceptions } from '@lanceflow/automation';
import {
  createClient,
  createProject,
  submitDailyReport,
  transitionProject,
} from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: fraud triggers (PAY-004)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const userIds: string[] = [];
  const reportIds: string[] = [];
  const actorId = 'test-actor-pay-004';

  afterAll(async () => {
    if (reportIds.length > 0) {
      await prisma.dailyReport.deleteMany({ where: { id: { in: reportIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.leadershipException.deleteMany({
        where: { entityId: { in: projectIds } },
      });
      await prisma.assignment.deleteMany({ where: { projectId: { in: projectIds } } });
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
  });

  it('creates fraud exception for excessive hours', async () => {
    const engineer = await prisma.user.create({
      data: {
        email: `fraud-${Date.now()}@test.local`,
        displayName: 'Fraud Test Engineer',
        role: UserRole.ENGINEER,
        status: 'active',
        skillTags: ['ts'],
      },
    });
    userIds.push(engineer.id);

    const client = await createClient({ name: `Fraud Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Fraud Hours Project' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    await prisma.assignment.create({
      data: { projectId: project.project.id, userId: engineer.id },
    });

    const toPending = await transitionProject(project.project.id, 'pending_approval', actorId);
    expect(toPending.ok).toBe(true);
    const toActive = await transitionProject(project.project.id, 'active', actorId);
    expect(toActive.ok).toBe(true);

    const report = await submitDailyReport(
      engineer.id,
      {
        projectId: project.project.id,
        hours: 14,
        progressPct: 10,
      },
      actorId
    );
    expect(report.ok).toBe(true);
    if (report.ok) reportIds.push(report.report.id);

    const candidates = await collectFraudExceptionCandidates();
    expect(
      candidates.some((c) => c.category === 'fraud' && c.sourceKey.startsWith('fraud:excessive_hours'))
    ).toBe(true);

    await syncLeadershipExceptions();
    const stored = await prisma.leadershipException.findFirst({
      where: { sourceKey: { startsWith: 'fraud:excessive_hours' }, status: 'open' },
    });
    expect(stored?.severity).toBe('danger');
  });
});

import { listProjectMilestones, setProjectMilestones } from '@lanceflow/payments';
import { createClient, createProject } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: project milestones (PAY-001)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const actorId = 'test-actor-pay-001';

  afterAll(async () => {
    if (projectIds.length > 0) {
      await prisma.projectMilestone.deleteMany({ where: { projectId: { in: projectIds } } });
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    await prisma.$disconnect();
  });

  it('persists milestones that sum to 100% with audit', async () => {
    const client = await createClient({ name: `Milestone Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Milestone Project' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const result = await setProjectMilestones(
      project.project.id,
      {
        milestones: [
          { label: 'Deposit', percentPct: 25 },
          { label: 'Mid', percentPct: 50 },
          { label: 'Final', percentPct: 25 },
        ],
      },
      actorId
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.totalPercent).toBe(100);

    const listed = await listProjectMilestones(project.project.id);
    expect(listed?.length).toBe(3);
    expect(listed?.reduce((s, m) => s + m.percentPct, 0)).toBe(100);

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'project_milestones.set', entityId: project.project.id },
    });
    expect(audit).not.toBeNull();
  });

  it('rejects invalid sum without persisting', async () => {
    const client = await createClient({ name: `Bad Sum ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: 'Bad Sum Project' },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const result = await setProjectMilestones(
      project.project.id,
      { milestones: [{ label: 'Only', percentPct: 90 }] },
      actorId
    );
    expect(result.ok).toBe(false);

    const listed = await listProjectMilestones(project.project.id);
    expect(listed?.length).toBe(0);
  });
});

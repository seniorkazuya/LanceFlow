import { createClient, createProject, transitionProject } from '@lanceflow/operations';
import { runProjectAutoApproval } from '@lanceflow/automation';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: project auto-approval (AUTO-002)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const decisionIds: string[] = [];
  const actorId = 'test-actor-auto-002';

  afterAll(async () => {
    if (decisionIds.length > 0) {
      await prisma.ruleDecision.deleteMany({ where: { id: { in: decisionIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    await prisma.$disconnect();
  });

  it('stores RuleDecision and activates project when thresholds met', async () => {
    const client = await createClient({ name: `Auto Approve Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    await prisma.client.update({
      where: { id: client.client.id },
      data: { riskScore: 45 },
    });

    const project = await createProject(
      {
        clientId: client.client.id,
        title: `Auto Approve Project ${Date.now()}`,
        scopeClarityPct: 90,
        profitMarginPct: 30,
      },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const toPending = await transitionProject(
      project.project.id,
      'pending_approval',
      actorId
    );
    expect(toPending.ok).toBe(true);

    const result = await runProjectAutoApproval(project.project.id, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.approved).toBe(true);
    expect(result.transitioned).toBe(true);
    expect(result.projectStatus).toBe('active');
    expect(result.decision.formulaVersion).toBe('project-auto-approve-v1');
    expect(result.decision.outcome).toBe('approved');

    decisionIds.push(result.decision.id);

    const stored = await prisma.ruleDecision.findUnique({
      where: { id: result.decision.id },
    });
    expect(stored?.entityType).toBe('project');
    expect(stored?.outcome).toBe('approved');
  });
});

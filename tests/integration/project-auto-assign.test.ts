import {
  overrideProjectAutoAssign,
  runProjectAutoAssignOnActivate,
} from '@lanceflow/automation';
import { createClient, createProject, transitionProject } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: project auto-assign (AUTO-003)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const assignmentIds: string[] = [];
  const decisionIds: string[] = [];
  const userIds: string[] = [];
  const actorId = 'test-actor-auto-003';
  const previousFlag = process.env.AUTO_ASSIGN_ENABLED;

  beforeAll(() => {
    process.env.AUTO_ASSIGN_ENABLED = 'true';
  });

  afterAll(async () => {
    if (previousFlag === undefined) {
      delete process.env.AUTO_ASSIGN_ENABLED;
    } else {
      process.env.AUTO_ASSIGN_ENABLED = previousFlag;
    }

    if (assignmentIds.length > 0) {
      await prisma.assignment.deleteMany({ where: { id: { in: assignmentIds } } });
    }
    if (decisionIds.length > 0) {
      await prisma.ruleDecision.deleteMany({ where: { id: { in: decisionIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('assigns top engineer and stores RuleDecision', async () => {
    const uniqueSkill = `auto-assign-skill-${Date.now()}`;
    const engineer = await prisma.user.create({
      data: {
        email: `auto-assign-${Date.now()}@test.local`,
        displayName: 'Auto Assign Engineer',
        role: UserRole.ENGINEER,
        status: 'active',
        skillTags: [uniqueSkill],
      },
    });
    userIds.push(engineer.id);

    const client = await createClient({ name: `Auto Assign Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      {
        clientId: client.client.id,
        title: `Auto Assign Project ${Date.now()}`,
      },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    const toActive = await transitionProject(project.project.id, 'pending_approval', actorId);
    expect(toActive.ok).toBe(true);
    const active = await transitionProject(project.project.id, 'active', actorId);
    expect(active.ok).toBe(true);

    const result = await runProjectAutoAssignOnActivate(project.project.id, actorId, {
      requiredSkills: [uniqueSkill],
    });
    expect(result.ok).toBe(true);
    if (!result.ok || result.skipped) return;

    expect(result.assigned).toBe(true);
    expect(result.assignmentId).toBeTruthy();
    expect(result.decision.outcome).toBe('assigned');
    assignmentIds.push(result.assignmentId!);
    decisionIds.push(result.decision.id);

    const stored = await prisma.assignment.findUnique({
      where: { id: result.assignmentId },
    });
    expect(stored?.userId).toBe(engineer.id);
  });

  it('override marks prior decision and assigns different engineer', async () => {
    const engineerA = await prisma.user.create({
      data: {
        email: `override-a-${Date.now()}@test.local`,
        displayName: 'Override A',
        role: UserRole.ENGINEER,
        status: 'active',
        skillTags: ['react'],
      },
    });
    const engineerB = await prisma.user.create({
      data: {
        email: `override-b-${Date.now()}@test.local`,
        displayName: 'Override B',
        role: UserRole.ENGINEER,
        status: 'active',
        skillTags: ['react'],
      },
    });
    userIds.push(engineerA.id, engineerB.id);

    const client = await createClient({ name: `Override Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      {
        clientId: client.client.id,
        title: `Override Project ${Date.now()}`,
      },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    await transitionProject(project.project.id, 'pending_approval', actorId);
    await transitionProject(project.project.id, 'active', actorId);

    const first = await runProjectAutoAssignOnActivate(project.project.id, actorId);
    expect(first.ok).toBe(true);
    if (!first.ok || first.skipped) return;
    if (first.assignmentId) assignmentIds.push(first.assignmentId);
    decisionIds.push(first.decision.id);

    const override = await overrideProjectAutoAssign(
      project.project.id,
      {
        userId: engineerB.id,
        reason: 'Ops selected backup engineer for coverage',
        requiredSkills: ['react'],
      },
      actorId
    );
    expect(override.ok).toBe(true);
    if (!override.ok) return;

    assignmentIds.push(override.assignmentId);
    decisionIds.push(override.decision.id);
    expect(override.decision.outcome).toBe('override');

    const prior = await prisma.ruleDecision.findUnique({ where: { id: first.decision.id } });
    expect(prior?.overridden).toBe(true);
  });
});

import { processKpiRollup } from '@lanceflow/analytics';
import { createClient, createProject } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: KPI rollup (KPI-002)', () => {
  const clientIds: string[] = [];
  const projectIds: string[] = [];
  const userIds: string[] = [];
  const kpiRecordIds: string[] = [];
  const actorId = 'test-actor-kpi-002';

  afterAll(async () => {
    if (kpiRecordIds.length > 0) {
      await prisma.kpiRecord.deleteMany({ where: { id: { in: kpiRecordIds } } });
    }
    if (projectIds.length > 0) {
      await prisma.dailyReport.deleteMany({ where: { projectId: { in: projectIds } } });
      await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    if (userIds.length > 0) {
      await prisma.assignment.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.dailyReport.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.kpiRecord.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  async function createEngineer() {
    const engineer = await prisma.user.create({
      data: {
        email: `kpi-engineer-${Date.now()}@test.local`,
        displayName: 'KPI Test Engineer',
        role: UserRole.ENGINEER,
        status: 'active',
        skillTags: ['react'],
      },
    });
    userIds.push(engineer.id);
    return engineer;
  }

  it('upserts KPI records idempotently for the current week', async () => {
    const engineer = await createEngineer();

    const first = await processKpiRollup(new Date('2026-05-20T12:00:00Z'), actorId);
    expect(first.upserted.length).toBeGreaterThanOrEqual(1);

    const row = await prisma.kpiRecord.findUnique({
      where: {
        userId_periodKey: { userId: engineer.id, periodKey: first.periodKey },
      },
    });
    expect(row).not.toBeNull();
    if (row) kpiRecordIds.push(row.id);

    const second = await processKpiRollup(new Date('2026-05-21T12:00:00Z'), actorId);
    expect(second.periodKey).toBe(first.periodKey);

    const count = await prisma.kpiRecord.count({
      where: { periodKey: first.periodKey, userId: engineer.id },
    });
    expect(count).toBe(1);
  });

  it('creates engineer KPI from daily reports in period', async () => {
    const engineer = await createEngineer();

    const client = await createClient({ name: `KPI Client ${Date.now()}` }, actorId);
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const project = await createProject(
      { clientId: client.client.id, title: `KPI Project ${Date.now()}` },
      actorId
    );
    expect(project.ok).toBe(true);
    if (!project.ok) return;
    projectIds.push(project.project.id);

    await prisma.dailyReport.create({
      data: {
        userId: engineer.id,
        projectId: project.project.id,
        reportDate: new Date('2026-05-19T00:00:00Z'),
        hours: 6,
        progressPct: 80,
      },
    });

    const result = await processKpiRollup(new Date('2026-05-20T12:00:00Z'), actorId);
    const match = result.upserted.find((r) => r.userId === engineer.id);
    expect(match?.score).toBeGreaterThan(0);

    const record = await prisma.kpiRecord.findUnique({
      where: {
        userId_periodKey: { userId: engineer.id, periodKey: result.periodKey },
      },
    });
    if (record) kpiRecordIds.push(record.id);
    expect(record?.formulaVersion).toBe('role-kpi-worker-v1');
  });
});

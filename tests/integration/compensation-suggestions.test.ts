import {
  generateCompensationSuggestions,
  listCompensationSuggestions,
  reviewCompensationSuggestion,
} from '@lanceflow/analytics';
import { prisma } from '@lanceflow/database';
import { UserRole } from '@lanceflow/types';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: compensation suggestions (KPI-006)', () => {
  const actorId = 'test-actor-kpi-006';
  const userIds: string[] = [];
  const suggestionIds: string[] = [];

  afterAll(async () => {
    if (suggestionIds.length > 0) {
      await prisma.compensationSuggestion.deleteMany({ where: { id: { in: suggestionIds } } });
    }
    if (userIds.length > 0) {
      await prisma.kpiRecord.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.compensationSuggestion.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('generates bonus suggestion from high KPI and supports Ops review', async () => {
    const engineer = await prisma.user.create({
      data: {
        email: `comp-suggest-${Date.now()}@test.local`,
        displayName: 'Comp Test Engineer',
        role: UserRole.ENGINEER,
        status: 'active',
      },
    });
    userIds.push(engineer.id);

    const ref = new Date('2026-05-20T12:00:00Z');
    const { getWeekPeriod } = await import('@lanceflow/analytics');
    const period = getWeekPeriod(ref);

    await prisma.kpiRecord.create({
      data: {
        userId: engineer.id,
        role: UserRole.ENGINEER,
        periodKey: period.key,
        periodStart: period.start,
        periodEnd: period.end,
        formulaVersion: 'role-kpi-worker-v1',
        score: 80,
        components: { quality: 80, speed: 80, reliability: 80 },
      },
    });

    const generated = await generateCompensationSuggestions(ref, actorId);
    expect(generated.created + generated.updated).toBeGreaterThanOrEqual(1);

    const pending = await listCompensationSuggestions({ status: 'pending', periodKey: period.key });
    const row = pending.find((s) => s.userId === engineer.id);
    expect(row).toBeDefined();
    expect(row?.kind).toBe('bonus');
    if (row) suggestionIds.push(row.id);

    const reviewed = await reviewCompensationSuggestion(
      row!.id,
      { action: 'approve', note: 'Strong week' },
      actorId
    );
    expect(reviewed.ok).toBe(true);
    if (reviewed.ok) {
      expect(reviewed.suggestion.status).toBe('approved');
    }

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'compensation_suggestion.approved', entityId: row!.id },
    });
    expect(audit).not.toBeNull();
  });
});

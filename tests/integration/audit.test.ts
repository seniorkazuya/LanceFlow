import { auditLog, queryAuditLogs } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: audit service (CORE-006)', () => {
  const createdIds: string[] = [];

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.auditLog.deleteMany({ where: { id: { in: createdIds } } });
    }
    await prisma.$disconnect();
  });

  it('auditLog inserts immutable row', async () => {
    const row = await auditLog({
      actorId: null,
      action: 'test.integration',
      entityType: 'system',
      entityId: 'test',
      payload: { ok: true },
    });
    createdIds.push(row.id);

    expect(row.action).toBe('test.integration');
    expect(row.createdAt).toBeInstanceOf(Date);
  });

  it('queryAuditLogs returns paginated newest-first', async () => {
    const first = await auditLog({
      action: 'test.pagination.a',
      entityType: 'system',
    });
    const second = await auditLog({
      action: 'test.pagination.b',
      entityType: 'system',
    });
    createdIds.push(first.id, second.id);

    const page = await queryAuditLogs({ page: 1, pageSize: 5 });
    const actions = page.items.map((i) => i.action);
    expect(actions.indexOf('test.pagination.b')).toBeLessThan(actions.indexOf('test.pagination.a'));
  });
});

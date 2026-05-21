import { PrismaClient } from '@prisma/client';
import { describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: database schema (CORE-001)', () => {
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl! } },
  });

  it('supports User create and read', async () => {
    const email = `test-${Date.now()}@lanceflow.local`;
    const created = await prisma.user.create({
      data: {
        email,
        displayName: 'Integration Test',
        role: 'ENGINEER',
        status: 'active',
      },
    });

    expect(created.id).toBeTruthy();
    expect(created.email).toBe(email);

    const found = await prisma.user.findUnique({ where: { email } });
    expect(found?.displayName).toBe('Integration Test');

    await prisma.user.delete({ where: { id: created.id } });
  });

  it('supports AuditLog create', async () => {
    const log = await prisma.auditLog.create({
      data: {
        action: 'test.integration',
        entityType: 'system',
        payload: { ok: true },
      },
    });

    expect(log.id).toBeTruthy();
    await prisma.auditLog.delete({ where: { id: log.id } });
  });
});

import { createClient, getClientById, listClients } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: clients (OPS-001)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-ops-001';

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: createdIds } } });
    }
    await prisma.$disconnect();
  });

  it('creates and lists clients', async () => {
    const result = await createClient({ name: `Test Client ${Date.now()}` }, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    createdIds.push(result.client.id);
    const list = await listClients(false);
    expect(list.some((c) => c.id === result.client.id)).toBe(true);
  });

  it('loads client by id', async () => {
    const result = await createClient({ name: `Detail Client ${Date.now()}`, riskScore: 10 }, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    createdIds.push(result.client.id);
    const found = await getClientById(result.client.id);
    expect(found?.name).toBe(result.client.name);
  });
});

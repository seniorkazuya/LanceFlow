import { createClient, evaluateClientRisk, overrideClientRisk } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: client risk (OPS-002)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-ops-002';

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: createdIds } } });
    }
    await prisma.$disconnect();
  });

  it('evaluateClientRisk sets formula version and source', async () => {
    const created = await createClient({ name: `Risk Eval ${Date.now()}` }, actorId);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    createdIds.push(created.client.id);

    const result = await evaluateClientRisk(created.client.id, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.client.riskScoreSource).toBe('evaluated');
    expect(result.client.riskFormulaVersion).toBe('ops-client-risk-v0');
  });

  it('overrideClientRisk requires reason and audits manual source', async () => {
    const created = await createClient({ name: `Risk Override ${Date.now()}` }, actorId);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    createdIds.push(created.client.id);

    const result = await overrideClientRisk(
      created.client.id,
      { riskScore: 72, reason: 'Ops review — payment delay' },
      actorId
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.client.riskScore).toBe(72);
    expect(result.client.riskScoreSource).toBe('manual');
    expect(result.client.riskOverrideReason).toContain('payment delay');
  });
});

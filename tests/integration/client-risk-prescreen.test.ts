import { runClientRiskPrescreen } from '@lanceflow/automation';
import { createClient } from '@lanceflow/operations';
import { prisma } from '@lanceflow/database';
import { afterAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

describe.runIf(runIntegration)('integration: client risk prescreen (AUTO-006)', () => {
  const clientIds: string[] = [];
  const decisionIds: string[] = [];
  const actorId = 'test-actor-auto-006';

  afterAll(async () => {
    if (decisionIds.length > 0) {
      await prisma.ruleDecision.deleteMany({ where: { id: { in: decisionIds } } });
    }
    if (clientIds.length > 0) {
      await prisma.client.deleteMany({ where: { id: { in: clientIds } } });
    }
    await prisma.$disconnect();
  });

  it('stores RuleDecision and audit without persisting by default', async () => {
    const client = await createClient(
      {
        name: `Prescreen Client ${Date.now()}`,
        contactEmail: null,
        notes: 'x'.repeat(81),
      },
      actorId
    );
    expect(client.ok).toBe(true);
    if (!client.ok) return;
    clientIds.push(client.client.id);

    const beforeScore = client.client.riskScore;

    const result = await runClientRiskPrescreen(client.client.id, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.persisted).toBe(false);
    expect(result.recommendation).toBe('do_not_proceed');
    decisionIds.push(result.decision.id);

    const row = await prisma.client.findUnique({ where: { id: client.client.id } });
    expect(row?.riskScore).toBe(beforeScore);

    const stored = await prisma.ruleDecision.findUnique({
      where: { id: result.decision.id },
    });
    expect(stored?.ruleKey).toBe('client.risk_prescreen');
    expect(stored?.outcome).toBe('do_not_proceed');
  });
});

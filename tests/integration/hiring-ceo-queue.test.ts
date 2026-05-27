import { parseHiringApplicationResume } from '@lanceflow/ai-hiring';
import { getHiringCeoQueueSnapshot, scoreHiringApplication, submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { readFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-ceo-queue');

describe.runIf(runIntegration)('integration: hiring CEO queue (HIRE-007)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-007';

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.ruleDecision.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
      await prisma.auditLog.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
      await prisma.hiringApplication.deleteMany({ where: { id: { in: createdIds } } });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  it('returns a snapshot and surfaces scored candidates', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'CEO Queue Test',
        email: `hire-ceo-queue-${Date.now()}@example.com`,
        roleApplied: 'ENGINEER',
        consentGiven: true,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes: pdf,
      },
      actorId
    );
    expect(submit.ok).toBe(true);
    if (!submit.ok) return;
    createdIds.push(submit.application.id);

    await parseHiringApplicationResume(submit.application.id, actorId);
    const scored = await scoreHiringApplication(submit.application.id, actorId);
    expect(scored.ok).toBe(true);

    const snapshot = await getHiringCeoQueueSnapshot();
    expect(snapshot.scope).toBe('hiring-ceo-queue');
    expect(snapshot.counts.scoredTotal).toBeGreaterThanOrEqual(1);
  });
});


import { submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { mkdir, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-pipeline');

describe.runIf(runIntegration)('integration: hiring pipeline (HIRE-005)', () => {
  const createdIds: string[] = [];

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.hiringApplication.deleteMany({ where: { id: { in: createdIds } } });
      await prisma.auditLog.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  it('returns stage counts and applications for submitted filter', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'Pipeline Test',
        email: `hire-pipeline-${Date.now()}@example.com`,
        roleApplied: 'ENGINEER',
        consentGiven: true,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes: pdf,
      },
      'test-actor-hire-005'
    );
    expect(submit.ok).toBe(true);
    if (!submit.ok) return;
    createdIds.push(submit.application.id);

    const { getHiringPipelineSnapshot } = await import('@lanceflow/hiring');
    const snapshot = await getHiringPipelineSnapshot({ status: 'submitted' });
    expect(snapshot.scope).toBe('hiring-pipeline');
    expect(snapshot.stageCounts.find((s) => s.stage === 'submitted')!.count).toBeGreaterThan(0);
    expect(snapshot.applications.some((a) => a.id === submit.application.id)).toBe(true);
    expect(snapshot.timeToHire.scoredCount).toBeGreaterThanOrEqual(0);
  });
});

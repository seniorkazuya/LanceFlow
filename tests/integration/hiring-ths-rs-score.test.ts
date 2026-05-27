import { parseHiringApplicationResume } from '@lanceflow/ai-hiring';
import { scoreHiringApplication, setTechnicalScore, submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { mkdir, rm } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-ths-rs');

describe.runIf(runIntegration)('integration: hiring THS/RS score (HIRE-004)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-004';

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.hiringApplication.deleteMany({ where: { id: { in: createdIds } } });
      await prisma.ruleDecision.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
      await prisma.auditLog.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  it('auto-rejects when RS exceeds 70', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'Hop Risk',
        email: `hire-ths-rs-${Date.now()}@example.com`,
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

    await setTechnicalScore(submit.application.id, 50, 'manual', actorId);
    await prisma.hiringApplication.update({
      where: { id: submit.application.id },
      data: {
        resumeParsed: {
          yearsExperience: 4,
          stack: ['javascript'],
          seniority: 'mid',
          jobHopIndex: 9,
          formulaVersion: 'resume-parse-v1',
        },
        resumeParsedAt: new Date(),
        resumeParseVersion: 'resume-parse-v1',
        status: 'parsed',
      },
    });

    const scored = await scoreHiringApplication(submit.application.id, actorId);
    expect(scored.ok).toBe(true);
    if (!scored.ok) return;

    expect(scored.rs).toBeGreaterThan(70);
    expect(scored.autoRejected).toBe(true);
    expect(scored.recommendation).toBe('Reject');
    expect(scored.application.status).toBe('rejected');
  });

  it('scores after resume parse pipeline', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(`%PDF-1.4\n(${text.replace(/[()\\]/g, ' ')})`);

    const submit = await submitHiringApplication(
      {
        fullName: 'Strong Hire',
        email: `hire-ths-strong-${Date.now()}@example.com`,
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

    await setTechnicalScore(submit.application.id, 88, 'manual', actorId);
    const parseResult = await parseHiringApplicationResume(submit.application.id, actorId);
    expect(parseResult.ok).toBe(true);
    if (!parseResult.ok) return;

    const scored = await scoreHiringApplication(submit.application.id, actorId);
    expect(scored.ok).toBe(true);
    if (!scored.ok) return;

    expect(scored.ths).toBeGreaterThanOrEqual(55);
    expect(scored.rs).toBeLessThanOrEqual(70);
    expect(scored.autoRejected).toBe(false);
  });
});

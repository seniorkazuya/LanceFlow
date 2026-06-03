import { parseHiringApplicationResume } from '@lanceflow/ai-hiring';
import {
  getHiringDecisionDetail,
  overrideHiringDecision,
  scoreHiringApplication,
  setTechnicalScore,
  submitHiringApplication,
} from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { readFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-decision');

describe.runIf(runIntegration)('integration: hiring decision override (HIRE-006)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-006';

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
      await prisma.hiringApplication.deleteMany({ where: { id: { in: createdIds } } });
      await prisma.auditLog.deleteMany({
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  it('applies rule decision on score and allows audited override', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'Decision Test',
        email: `hire-decision-${Date.now()}@example.com`,
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
    await setTechnicalScore(submit.application.id, 85, 'manual', actorId);
    const scored = await scoreHiringApplication(submit.application.id, actorId);
    expect(scored.ok).toBe(true);
    if (!scored.ok) return;

    const before = await getHiringDecisionDetail(submit.application.id);
    expect(before?.decision).toBe(scored.recommendation);
    expect(before?.source).toBe('rule');

    const overridden = await overrideHiringDecision(
      submit.application.id,
      { decision: 'Fast Track', reason: 'CEO referral — expedite interview' },
      actorId
    );
    expect(overridden.ok).toBe(true);
    if (!overridden.ok) return;

    const after = await getHiringDecisionDetail(submit.application.id);
    expect(after?.decision).toBe('Fast Track');
    expect(after?.source).toBe('override');
    expect(after?.latestThsRsDecision?.overridden).toBe(true);
    expect(after?.latestOverrideDecision?.outcome).toBe('Fast Track');
  });
});

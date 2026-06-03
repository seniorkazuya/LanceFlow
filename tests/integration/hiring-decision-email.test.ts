import { parseHiringApplicationResume } from '@lanceflow/ai-hiring';
import {
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
const testDir = path.join(process.cwd(), '.data/test-hiring-decision-email');

describe.runIf(runIntegration)('integration: hiring decision candidate email (HIRE-008)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-008';
  const previousNotify = process.env.HIRING_DECISION_NOTIFY_EMAIL;

  beforeAll(async () => {
    process.env.HIRING_DECISION_NOTIFY_EMAIL = 'true';
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    delete process.env.RESEND_API_KEY;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    if (previousNotify === undefined) {
      delete process.env.HIRING_DECISION_NOTIFY_EMAIL;
    } else {
      process.env.HIRING_DECISION_NOTIFY_EMAIL = previousNotify;
    }

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

  it('audits decision emails on first rule decision and override', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'Email Test',
        email: `hire-email-${Date.now()}@example.com`,
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

    const ruleEmailLogs = await prisma.auditLog.findMany({
      where: {
        entityType: 'hiring_application',
        entityId: submit.application.id,
        action: 'hiring_application.decision_email',
      },
    });
    expect(ruleEmailLogs.length).toBe(1);
    expect(ruleEmailLogs[0]?.payload).toMatchObject({
      decision: scored.recommendation,
      attempted: true,
      sent: true,
      provider: 'noop',
    });

    const rescored = await scoreHiringApplication(submit.application.id, actorId);
    expect(rescored.ok).toBe(true);

    const afterRescoreLogs = await prisma.auditLog.count({
      where: {
        entityType: 'hiring_application',
        entityId: submit.application.id,
        action: 'hiring_application.decision_email',
      },
    });
    expect(afterRescoreLogs).toBe(1);

    const overridden = await overrideHiringDecision(
      submit.application.id,
      { decision: 'Hire', reason: 'Strong portfolio — proceed to interview' },
      actorId
    );
    expect(overridden.ok).toBe(true);

    const allEmailLogs = await prisma.auditLog.findMany({
      where: {
        entityType: 'hiring_application',
        entityId: submit.application.id,
        action: 'hiring_application.decision_email',
      },
      orderBy: { createdAt: 'asc' },
    });
    expect(allEmailLogs.length).toBe(2);
    expect(allEmailLogs[1]?.payload).toMatchObject({
      decision: 'Hire',
      attempted: true,
      sent: true,
    });
  });
});

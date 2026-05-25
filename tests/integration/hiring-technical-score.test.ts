import { ingestAssessmentWebhook, setTechnicalScore, submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import path from 'node:path';
import { mkdir, rm } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const testDir = path.join(process.cwd(), '.data/test-hiring-assessment');

describe.runIf(runIntegration)('integration: hiring technical score (HIRE-003)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-003';
  const webhookSecret = 'test-webhook-secret-hire-003';

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    process.env.HIRING_ASSESSMENT_WEBHOOK_SECRET = webhookSecret;
    delete process.env.S3_BUCKET;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    delete process.env.HIRING_ASSESSMENT_WEBHOOK_SECRET;
    if (createdIds.length > 0) {
      await prisma.hiringApplication.deleteMany({ where: { id: { in: createdIds } } });
      await prisma.auditLog.deleteMany({
        where: {
          entityType: 'hiring_application',
          entityId: { in: createdIds },
        },
      });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  async function createApplication() {
    const pdf = Buffer.from('%PDF-1.4\n(Jane Doe)\n(8 years experience)\n');
    const submit = await submitHiringApplication(
      {
        fullName: 'Score Test',
        email: `hire-score-${Date.now()}@example.com`,
        roleApplied: 'ENGINEER',
        consentGiven: true,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes: pdf,
      },
      actorId
    );
    expect(submit.ok).toBe(true);
    if (!submit.ok) throw new Error('submit failed');
    createdIds.push(submit.application.id);
    return submit.application.id;
  }

  it('sets technical score manually via service', async () => {
    const id = await createApplication();
    const result = await setTechnicalScore(id, 88, 'manual', actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.application.technicalScore).toBe(88);
    expect(result.application.technicalScoreSource).toBe('manual');
    expect(result.application.status).toBe('assessed');
  });

  it('ingests score from webhook with secret', async () => {
    const id = await createApplication();
    const result = await ingestAssessmentWebhook(
      { applicationId: id, technicalScore: 72 },
      webhookSecret
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.application.technicalScore).toBe(72);
    expect(result.application.technicalScoreSource).toBe('webhook');
  });

  it('rejects webhook without secret', async () => {
    const id = await createApplication();
    const result = await ingestAssessmentWebhook({ applicationId: id, technicalScore: 50 }, 'wrong');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect('status' in result && result.status).toBe(401);
  });
});

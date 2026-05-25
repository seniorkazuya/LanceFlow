import { submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const testDir = path.join(process.cwd(), '.data/test-hiring-resumes');

describe.runIf(runIntegration)('integration: hiring applications (HIRE-001)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-001';

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
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

  it('submits application with local resume storage and audit', async () => {
    const email = `hire-test-${Date.now()}@example.com`;
    const pdf = Buffer.from('%PDF-1.4 minimal test resume');

    const result = await submitHiringApplication(
      {
        fullName: 'Test Candidate',
        email,
        roleApplied: 'ENGINEER',
        consentGiven: true,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes: pdf,
      },
      actorId
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    createdIds.push(result.application.id);
    expect(result.application.email).toBe(email.toLowerCase());
    expect(result.application.resumeStorageKey).toMatch(/^local\//);
    expect(result.application.consentGiven).toBe(true);

    const row = await prisma.hiringApplication.findUnique({
      where: { id: result.application.id },
    });
    expect(row?.status).toBe('submitted');

    const audits = await prisma.auditLog.findMany({
      where: {
        entityType: 'hiring_application',
        entityId: result.application.id,
        action: 'hiring_application.submit',
      },
    });
    expect(audits.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects missing consent', async () => {
    const result = await submitHiringApplication(
      {
        fullName: 'No Consent',
        email: `no-consent-${Date.now()}@example.com`,
        roleApplied: 'CALLER',
        consentGiven: false,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes: Buffer.from('%PDF-1.4'),
      },
      actorId
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.field === 'consentGiven')).toBe(true);
  });
});

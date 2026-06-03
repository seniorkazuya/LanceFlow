import { parseHiringApplicationResume } from '@lanceflow/ai-hiring';
import { submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { mkdir, rm } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-resumes-parse');

describe.runIf(runIntegration)('integration: hiring resume parse (HIRE-002)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-hire-002';

  beforeAll(async () => {
    process.env.HIRING_RESUME_LOCAL_DIR = testDir;
    delete process.env.S3_BUCKET;
    delete process.env.LLM_API_KEY;
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

  it('parses submitted application resume and persists structured fields', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const resumeBytes = Buffer.from(
      `%PDF-1.4\n${text
        .split('\n')
        .map((line) => `(${line.replace(/[()\\]/g, ' ')})`)
        .join('\n')}`
    );
    const submit = await submitHiringApplication(
      {
        fullName: 'Parse Test',
        email: `hire-parse-${Date.now()}@example.com`,
        roleApplied: 'ENGINEER',
        consentGiven: true,
        resumeFileName: 'resume.pdf',
        resumeMimeType: 'application/pdf',
        resumeBytes,
      },
      actorId
    );
    expect(submit.ok).toBe(true);
    if (!submit.ok) {
      expect(submit.errors).toEqual([]);
      return;
    }

    createdIds.push(submit.application.id);

    const result = await parseHiringApplicationResume(submit.application.id, actorId);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.parsed.stack.length).toBeGreaterThan(0);
    expect(result.parsed.seniority).toBe('senior');

    const row = await prisma.hiringApplication.findUnique({
      where: { id: submit.application.id },
    });
    expect(row?.status).toBe('parsed');
    expect(row?.resumeParsedAt).toBeInstanceOf(Date);
    expect(row?.resumeParseVersion).toBeTruthy();
  });
});

import {
  analyzeHiringApplicationCommunication,
  parseHiringApplicationResume,
} from '@lanceflow/ai-hiring';
import { submitHiringApplication } from '@lanceflow/hiring';
import { prisma } from '@lanceflow/database';
import { readFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;
const runIntegration = Boolean(databaseUrl);

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');
const testDir = path.join(process.cwd(), '.data/test-hiring-communication');

describe.runIf(runIntegration)('integration: hiring communication analyze (AI-001)', () => {
  const createdIds: string[] = [];
  const actorId = 'test-actor-ai-001';

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
        where: { entityType: 'hiring_application', entityId: { in: createdIds } },
      });
    }
    await rm(testDir, { recursive: true, force: true });
    await prisma.$disconnect();
  });

  it('requires parse before communication scoring', async () => {
    const text = readFileSync(fixturePath, 'utf8');
    const pdf = Buffer.from(
      `%PDF-1.4\n${text.split('\n').map((l) => `(${l.replace(/[()\\]/g, ' ')})`).join('\n')}`
    );

    const submit = await submitHiringApplication(
      {
        fullName: 'Communication Test',
        email: `hire-comm-${Date.now()}@example.com`,
        roleApplied: 'CALLER',
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

    const blocked = await analyzeHiringApplicationCommunication(submit.application.id, actorId);
    expect(blocked.ok).toBe(false);

    await parseHiringApplicationResume(submit.application.id, actorId);
    const analyzed = await analyzeHiringApplicationCommunication(submit.application.id, actorId);
    expect(analyzed.ok).toBe(true);
    if (!analyzed.ok) return;

    expect(analyzed.scores.grammar).toBeGreaterThanOrEqual(0);
    expect(analyzed.scores.clarity).toBeGreaterThanOrEqual(0);
    expect(analyzed.scores.persuasion).toBeGreaterThanOrEqual(0);
    expect(analyzed.scores.source).toBe('heuristic');

    const row = await prisma.hiringApplication.findUnique({
      where: { id: submit.application.id },
    });
    expect(row?.communicationScoredAt).toBeInstanceOf(Date);
    expect(row?.communicationScores).toMatchObject({
      grammar: analyzed.scores.grammar,
      clarity: analyzed.scores.clarity,
      persuasion: analyzed.scores.persuasion,
    });
  });
});

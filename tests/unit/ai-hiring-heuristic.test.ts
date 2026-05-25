import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseResumeHeuristic, ParsedResumeSchema } from '@lanceflow/ai-hiring';

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');

describe('parseResumeHeuristic (HIRE-002 fixture)', () => {
  const text = readFileSync(fixturePath, 'utf8');

  it('extracts years, stack, seniority, and job hop index from fixture', () => {
    const parsed = parseResumeHeuristic(text);
    const validated = ParsedResumeSchema.parse(parsed);

    expect(validated.yearsExperience).toBeGreaterThanOrEqual(6);
    expect(validated.seniority).toBe('senior');
    expect(validated.jobHopIndex).toBeGreaterThanOrEqual(2);
    expect(validated.stack).toEqual(
      expect.arrayContaining(['typescript', 'react', 'node', 'postgresql', 'aws'])
    );
  });
});

describe('ParsedResumeSchema', () => {
  it('rejects invalid LLM-shaped payloads', () => {
    expect(() =>
      ParsedResumeSchema.parse({
        yearsExperience: -1,
        stack: [],
        seniority: 'executive',
        jobHopIndex: 0,
        formulaVersion: 'x',
      })
    ).toThrow();
  });
});

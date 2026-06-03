import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CommunicationScoresSchema,
  canInvokeCommunicationLlm,
  getCommunicationLlmMaxCallsPerCandidate,
  scoreCommunicationHeuristic,
  scoreCommunicationText,
} from '@lanceflow/ai-hiring';

const fixturePath = path.join(process.cwd(), 'tests/fixtures/hiring/sample-resume.txt');

describe('scoreCommunicationHeuristic (AI-001)', () => {
  const text = readFileSync(fixturePath, 'utf8');

  it('returns grammar, clarity, and persuasion in 0–100', () => {
    const scores = scoreCommunicationHeuristic(text);
    const validated = CommunicationScoresSchema.parse(scores);

    expect(validated.grammar).toBeGreaterThanOrEqual(0);
    expect(validated.grammar).toBeLessThanOrEqual(100);
    expect(validated.clarity).toBeGreaterThanOrEqual(40);
    expect(validated.persuasion).toBeGreaterThanOrEqual(40);
    expect(validated.source).toBe('heuristic');
  });
});

describe('communication LLM cost cap (AI-001)', () => {
  const previous = process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS;
    } else {
      process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS = previous;
    }
  });

  it('defaults to one LLM call per candidate', () => {
    delete process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS;
    expect(getCommunicationLlmMaxCallsPerCandidate()).toBe(1);
    expect(canInvokeCommunicationLlm(0)).toBe(true);
    expect(canInvokeCommunicationLlm(1)).toBe(false);
  });

  it('uses heuristic when cap is reached even if LLM key is set', async () => {
    process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS = '1';
    const previousKey = process.env.LLM_API_KEY;
    process.env.LLM_API_KEY = 'test-key-should-not-call';

    const result = await scoreCommunicationText('Led delivery for 3 enterprise clients.', {
      currentLlmCalls: 1,
    });

    if (previousKey === undefined) {
      delete process.env.LLM_API_KEY;
    } else {
      process.env.LLM_API_KEY = previousKey;
    }

    expect(result.source).toBe('heuristic');
    expect(result.costCapReached).toBe(true);
    expect(result.llmInvoked).toBe(false);
  });
});

describe('CommunicationScoresSchema', () => {
  it('rejects out-of-range scores', () => {
    expect(() =>
      CommunicationScoresSchema.parse({
        grammar: 101,
        clarity: 50,
        persuasion: 50,
        formulaVersion: 'communication-v1',
        source: 'heuristic',
      })
    ).toThrow();
  });
});

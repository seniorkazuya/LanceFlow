import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  HIRE_RS_AUTO_REJECT_MIN_EXCLUSIVE,
  evaluateHiringThsRsV1,
  evaluateRule,
  hiringThsRsV1Rule,
} from '@lanceflow/rules-engine';

type GoldenCase = {
  name: string;
  input: Parameters<typeof evaluateHiringThsRsV1>[0];
  expect: {
    thsMin?: number;
    thsMax?: number;
    rsMin?: number;
    rsMax?: number;
    recommendation: string;
    autoRejected: boolean;
  };
};

const golden = JSON.parse(
  readFileSync(path.join(process.cwd(), 'tests/fixtures/hiring/ths-rs-golden.json'), 'utf8')
) as GoldenCase[];

describe('evaluateHiringThsRsV1 golden cases (HIRE-004)', () => {
  for (const testCase of golden) {
    it(testCase.name, () => {
      const result = evaluateHiringThsRsV1(testCase.input);
      const e = testCase.expect;

      if (e.thsMin != null) expect(result.ths).toBeGreaterThanOrEqual(e.thsMin);
      if (e.thsMax != null) expect(result.ths).toBeLessThanOrEqual(e.thsMax);
      if (e.rsMin != null) expect(result.rs).toBeGreaterThanOrEqual(e.rsMin);
      if (e.rsMax != null) expect(result.rs).toBeLessThanOrEqual(e.rsMax);
      expect(result.recommendation).toBe(e.recommendation);
      expect(result.autoRejected).toBe(e.autoRejected);
      if (e.autoRejected) {
        expect(result.rs).toBeGreaterThan(HIRE_RS_AUTO_REJECT_MIN_EXCLUSIVE);
      }
    });
  }

  it('evaluateRule wires formula version', () => {
    const evaluated = evaluateRule(hiringThsRsV1Rule, golden[0]!.input);
    expect(evaluated.formulaVersion).toBe('hiring-ths-rs-v1');
  });
});

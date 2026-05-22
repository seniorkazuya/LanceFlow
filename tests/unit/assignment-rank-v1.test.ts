import { describe, expect, it } from 'vitest';
import {
  ASSIGNMENT_RANK_FORMULA_V1,
  computeAssignmentRankScoreV1,
  computeSkillMatchPct,
  rankEngineersForAssignmentV1,
} from '@lanceflow/rules-engine';

describe('computeSkillMatchPct', () => {
  it('returns 50 when no required skills', () => {
    expect(computeSkillMatchPct([], ['react'])).toBe(50);
  });

  it('scores overlap ratio', () => {
    expect(computeSkillMatchPct(['react', 'node'], ['react', 'aws'])).toBe(50);
  });
});

describe('rankEngineersForAssignmentV1', () => {
  it('prefers skill match and penalizes workload', () => {
    const ranked = rankEngineersForAssignmentV1({
      requiredSkills: ['react'],
      candidates: [
        { userId: 'a', skillTags: ['react'], activeAssignmentCount: 3 },
        { userId: 'b', skillTags: ['react'], activeAssignmentCount: 0 },
        { userId: 'c', skillTags: [], activeAssignmentCount: 0 },
      ],
    });

    expect(ranked[0]?.userId).toBe('b');
    expect(ranked[0]?.rankScore).toBe(computeAssignmentRankScoreV1(100, 0));
    expect(ASSIGNMENT_RANK_FORMULA_V1).toBe('ops-assignment-rank-v1');
  });
});

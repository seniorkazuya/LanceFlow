import { describe, expect, it } from 'vitest';
import {
  assignmentRankV1Rule,
  evaluateRule,
  evaluateRuleSafe,
  formatExplanation,
  getRuleByVersion,
  listRuleVersions,
  ASSIGNMENT_RANK_FORMULA_V1,
} from '@lanceflow/rules-engine';

describe('evaluateRule (AUTO-001)', () => {
  it('returns version, value, explanation, and inputs', () => {
    const result = evaluateRule(assignmentRankV1Rule, {
      requiredSkills: ['react'],
      candidates: [{ userId: 'u1', skillTags: ['react'], activeAssignmentCount: 0 }],
    });

    expect(result.ok).toBe(true);
    expect(result.formulaVersion).toBe(ASSIGNMENT_RANK_FORMULA_V1);
    expect(result.value).toHaveLength(1);
    expect(result.explanation.length).toBeGreaterThan(0);
    expect(result.inputs.requiredSkills).toEqual(['react']);
  });

  it('formats explanation as arrow chain', () => {
    const result = evaluateRule(assignmentRankV1Rule, {
      requiredSkills: [],
      candidates: [],
    });
    expect(formatExplanation(result.explanation)).toContain('formula');
  });
});

describe('evaluateRuleSafe', () => {
  it('returns error outcome when validation fails', () => {
    const outcome = evaluateRuleSafe(
      assignmentRankV1Rule,
      { requiredSkills: [], candidates: [] },
      () => 'no candidates allowed'
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toContain('no candidates');
      expect(outcome.formulaVersion).toBe(ASSIGNMENT_RANK_FORMULA_V1);
    }
  });
});

describe('rule registry', () => {
  it('lists and resolves assignment rank v1', () => {
    expect(listRuleVersions()).toContain(ASSIGNMENT_RANK_FORMULA_V1);
    const rule = getRuleByVersion(ASSIGNMENT_RANK_FORMULA_V1);
    expect(rule?.formulaVersion).toBe(ASSIGNMENT_RANK_FORMULA_V1);
  });

  it('returns undefined for unknown version', () => {
    expect(getRuleByVersion('unknown-rule-v9')).toBeUndefined();
  });

  it('lists and resolves role KPI formulas (KPI-001)', () => {
    expect(listRuleVersions()).toContain('role-kpi-worker-v1');
    expect(listRuleVersions()).toContain('role-kpi-bidder-v1');
    expect(listRuleVersions()).toContain('role-kpi-caller-v1');
  });
});

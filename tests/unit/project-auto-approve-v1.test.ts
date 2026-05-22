import { describe, expect, it } from 'vitest';
import { PROJECT_AUTO_APPROVE_THRESHOLDS } from '@lanceflow/config';
import {
  evaluateProjectAutoApproveV1,
  evaluateRule,
  projectAutoApproveV1Rule,
} from '@lanceflow/rules-engine';

describe('project auto-approve v1 (AUTO-002)', () => {
  const passInput = {
    clientRiskScore: 40,
    profitMarginPct: 30,
    scopeClarityPct: 85,
  };

  it('approves when risk<60, margin>25%, scope>80%', () => {
    const result = evaluateProjectAutoApproveV1(passInput, PROJECT_AUTO_APPROVE_THRESHOLDS);
    expect(result.approved).toBe(true);
    expect(result.outcome).toBe('approved');
    expect(result.checks.riskBelowMax).toBe(true);
    expect(result.checks.marginAboveMin).toBe(true);
    expect(result.checks.scopeAboveMin).toBe(true);
  });

  it('rejects when risk is 60 or higher', () => {
    const result = evaluateProjectAutoApproveV1(
      { ...passInput, clientRiskScore: 60 },
      PROJECT_AUTO_APPROVE_THRESHOLDS
    );
    expect(result.approved).toBe(false);
    expect(result.checks.riskBelowMax).toBe(false);
  });

  it('rejects when margin is 25 or lower', () => {
    const result = evaluateProjectAutoApproveV1(
      { ...passInput, profitMarginPct: 25 },
      PROJECT_AUTO_APPROVE_THRESHOLDS
    );
    expect(result.approved).toBe(false);
    expect(result.checks.marginAboveMin).toBe(false);
  });

  it('rejects when scope is 80 or lower', () => {
    const result = evaluateProjectAutoApproveV1(
      { ...passInput, scopeClarityPct: 80 },
      PROJECT_AUTO_APPROVE_THRESHOLDS
    );
    expect(result.approved).toBe(false);
    expect(result.checks.scopeAboveMin).toBe(false);
  });

  it('evaluateRule returns formula version and explanation', () => {
    const result = evaluateRule(projectAutoApproveV1Rule, passInput);
    expect(result.formulaVersion).toBe('project-auto-approve-v1');
    expect(result.value.approved).toBe(true);
    expect(result.explanation.length).toBeGreaterThan(0);
  });
});

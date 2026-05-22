import type { ProjectAutoApproveThresholds } from '@lanceflow/config';

/** AUTO-002 — versioned project auto-approval rule. */
export const PROJECT_AUTO_APPROVE_FORMULA_V1 = 'project-auto-approve-v1';

export const PROJECT_AUTO_APPROVE_RULE_KEY = 'project.auto_approve';

export type ProjectAutoApproveInputV1 = {
  clientRiskScore: number;
  profitMarginPct: number;
  scopeClarityPct: number;
};

export type ProjectAutoApproveCheckV1 = {
  riskBelowMax: boolean;
  marginAboveMin: boolean;
  scopeAboveMin: boolean;
};

export type ProjectAutoApproveResultV1 = {
  approved: boolean;
  outcome: 'approved' | 'rejected';
  checks: ProjectAutoApproveCheckV1;
  explanation: string[];
};

export function evaluateProjectAutoApproveV1(
  input: ProjectAutoApproveInputV1,
  thresholds: ProjectAutoApproveThresholds
): ProjectAutoApproveResultV1 {
  const checks: ProjectAutoApproveCheckV1 = {
    riskBelowMax: input.clientRiskScore < thresholds.maxRiskScoreExclusive,
    marginAboveMin: input.profitMarginPct > thresholds.minProfitMarginPctExclusive,
    scopeAboveMin: input.scopeClarityPct > thresholds.minScopeClarityPctExclusive,
  };

  const approved = checks.riskBelowMax && checks.marginAboveMin && checks.scopeAboveMin;

  const explanation = [
    `formula ${PROJECT_AUTO_APPROVE_FORMULA_V1}`,
    `risk ${input.clientRiskScore} < ${thresholds.maxRiskScoreExclusive}: ${checks.riskBelowMax}`,
    `margin ${input.profitMarginPct}% > ${thresholds.minProfitMarginPctExclusive}%: ${checks.marginAboveMin}`,
    `scope ${input.scopeClarityPct}% > ${thresholds.minScopeClarityPctExclusive}%: ${checks.scopeAboveMin}`,
    approved ? 'outcome=approved' : 'outcome=rejected',
  ];

  return {
    approved,
    outcome: approved ? 'approved' : 'rejected',
    checks,
    explanation,
  };
}

/** AUTO-002 — thresholds for project auto-approval (v1). */
export const PROJECT_AUTO_APPROVE_THRESHOLDS = {
  /** Client risk must be strictly below this value. */
  maxRiskScoreExclusive: 60,
  /** Profit margin percent must be strictly above this value. */
  minProfitMarginPctExclusive: 25,
  /** Scope clarity percent must be strictly above this value. */
  minScopeClarityPctExclusive: 80,
} as const;

export type ProjectAutoApproveThresholds = typeof PROJECT_AUTO_APPROVE_THRESHOLDS;

/** AUTO-006 — client risk pre-screen before bid acceptance. */
export const CLIENT_RISK_PRESCREEN_RULE_KEY = 'client.risk_prescreen';
export const CLIENT_RISK_PRESCREEN_FORMULA_V1 = 'client-risk-prescreen-v1';

export type ClientRiskPrescreenInputV1 = {
  hasContactEmail: boolean;
  notesLength: number;
  priorScore: number | null;
};

export type PrescreenRecommendationV1 = 'proceed' | 'review_required' | 'do_not_proceed';

export type ClientRiskPrescreenResultV1 = {
  score: number;
  band: 'low' | 'medium' | 'high';
  recommendation: PrescreenRecommendationV1;
};

/** Score bands align with OPS-002 riskBand thresholds. */
export function prescreenRecommendationFromScore(score: number): PrescreenRecommendationV1 {
  if (score < 40) return 'proceed';
  if (score < 60) return 'review_required';
  return 'do_not_proceed';
}

export function riskBandFromScore(score: number): 'low' | 'medium' | 'high' {
  if (score < 40) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}

import {
  CLIENT_RISK_PRESCREEN_FORMULA_V1,
  prescreenRecommendationFromScore,
  riskBandFromScore,
  type ClientRiskPrescreenInputV1,
  type ClientRiskPrescreenResultV1,
} from '../client-risk/prescreen-v1';
import type { RuleDefinition } from '../core/types';

/** Mirrors OPS-002 `computeClientRiskV0` — keep in sync until shared in rules-engine. */
function computeClientRiskScoreV0(input: ClientRiskPrescreenInputV1): number {
  let score = 25;
  if (!input.hasContactEmail) score += 20;
  if (input.notesLength > 80) score += 15;
  if (input.notesLength === 0) score += 10;
  return Math.min(100, Math.max(0, score));
}

export const clientRiskPrescreenV1Rule: RuleDefinition<
  ClientRiskPrescreenInputV1,
  ClientRiskPrescreenResultV1
> = {
  formulaVersion: CLIENT_RISK_PRESCREEN_FORMULA_V1,
  evaluate(input) {
    const score = computeClientRiskScoreV0(input);
    const band = riskBandFromScore(score);
    const recommendation = prescreenRecommendationFromScore(score);
    const explanation = [
      `formula ${CLIENT_RISK_PRESCREEN_FORMULA_V1}`,
      `score=${score} band=${band} recommendation=${recommendation}`,
      `signals: email=${input.hasContactEmail} notesLen=${input.notesLength}`,
    ];
    return { value: { score, band, recommendation }, explanation };
  },
};

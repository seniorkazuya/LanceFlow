/** OPS-002 / AUTO-006 prep — versioned client risk formula v0. */
export const CLIENT_RISK_FORMULA_V0 = 'ops-client-risk-v0';

export type ClientRiskV0Input = {
  hasContactEmail: boolean;
  notesLength: number;
};

/** Deterministic 0–100 score from minimal signals (v0; replace in AUTO-006). */
export function computeClientRiskV0(input: ClientRiskV0Input): number {
  let score = 25;
  if (!input.hasContactEmail) score += 20;
  if (input.notesLength > 80) score += 15;
  if (input.notesLength === 0) score += 10;
  return Math.min(100, Math.max(0, score));
}

export type RiskBand = 'low' | 'medium' | 'high';

/** Bands aligned with planning threshold (client risk < 60 = safer). */
export function riskBand(score: number): RiskBand {
  if (score < 40) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}

export function riskBandLabel(band: RiskBand): string {
  switch (band) {
    case 'low':
      return 'Low risk';
    case 'medium':
      return 'Medium risk';
    case 'high':
      return 'High risk';
  }
}

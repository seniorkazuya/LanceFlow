/** KPI-006 — threshold-based bonus/penalty suggestion (not payroll). */
export const COMPENSATION_SUGGESTION_FORMULA_V1 = 'compensation-suggestion-v1';

/** Default bonus: +5% of base compensation band (basis points). */
export const BONUS_PERCENT_BPS_V1 = 500;

/** Default penalty: −3% (basis points). */
export const PENALTY_PERCENT_BPS_V1 = 300;

export type CompensationSuggestionKind = 'bonus' | 'penalty';

export type CompensationSuggestionInputV1 = {
  kpiScore: number;
  greenMin: number;
  yellowMin: number;
};

export type CompensationSuggestionValueV1 = {
  formulaVersion: typeof COMPENSATION_SUGGESTION_FORMULA_V1;
  kind: CompensationSuggestionKind;
  percentBps: number;
  explanation: string;
};

/** Returns null when KPI is in the yellow band (no automatic suggestion). */
export function computeCompensationSuggestionV1(
  input: CompensationSuggestionInputV1
): CompensationSuggestionValueV1 | null {
  const { kpiScore, greenMin, yellowMin } = input;

  if (kpiScore >= greenMin) {
    return {
      formulaVersion: COMPENSATION_SUGGESTION_FORMULA_V1,
      kind: 'bonus',
      percentBps: BONUS_PERCENT_BPS_V1,
      explanation: `KPI ${kpiScore} ≥ green ${greenMin} → bonus +${BONUS_PERCENT_BPS_V1 / 100}%`,
    };
  }

  if (kpiScore < yellowMin) {
    return {
      formulaVersion: COMPENSATION_SUGGESTION_FORMULA_V1,
      kind: 'penalty',
      percentBps: PENALTY_PERCENT_BPS_V1,
      explanation: `KPI ${kpiScore} < yellow ${yellowMin} → penalty −${PENALTY_PERCENT_BPS_V1 / 100}%`,
    };
  }

  return null;
}

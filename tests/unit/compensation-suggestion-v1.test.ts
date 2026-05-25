import {
  BONUS_PERCENT_BPS_V1,
  PENALTY_PERCENT_BPS_V1,
  computeCompensationSuggestionV1,
} from '@lanceflow/rules-engine/compensation';
import { describe, expect, it } from 'vitest';

describe('compensation suggestion v1 (KPI-006)', () => {
  const thresholds = { greenMin: 70, yellowMin: 50 };

  it('suggests bonus at or above green threshold', () => {
    const result = computeCompensationSuggestionV1({ kpiScore: 70, ...thresholds });
    expect(result?.kind).toBe('bonus');
    expect(result?.percentBps).toBe(BONUS_PERCENT_BPS_V1);
  });

  it('returns null in yellow band', () => {
    expect(computeCompensationSuggestionV1({ kpiScore: 55, ...thresholds })).toBeNull();
    expect(computeCompensationSuggestionV1({ kpiScore: 50, ...thresholds })).toBeNull();
  });

  it('suggests penalty below yellow threshold', () => {
    const result = computeCompensationSuggestionV1({ kpiScore: 49, ...thresholds });
    expect(result?.kind).toBe('penalty');
    expect(result?.percentBps).toBe(PENALTY_PERCENT_BPS_V1);
  });
});

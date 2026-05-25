import { describe, expect, it } from 'vitest';

import {
  prescreenRecommendationFromScore,
  riskBandFromScore,
} from '@lanceflow/rules-engine';

describe('client risk prescreen v1 (AUTO-006)', () => {
  it('maps score to bands', () => {
    expect(riskBandFromScore(30)).toBe('low');
    expect(riskBandFromScore(50)).toBe('medium');
    expect(riskBandFromScore(70)).toBe('high');
  });

  it('maps score to recommendations', () => {
    expect(prescreenRecommendationFromScore(30)).toBe('proceed');
    expect(prescreenRecommendationFromScore(50)).toBe('review_required');
    expect(prescreenRecommendationFromScore(70)).toBe('do_not_proceed');
  });
});

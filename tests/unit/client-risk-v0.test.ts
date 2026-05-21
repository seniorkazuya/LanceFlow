import { describe, expect, it } from 'vitest';
import {
  CLIENT_RISK_FORMULA_V0,
  computeClientRiskV0,
  riskBand,
  riskBandLabel,
} from '@lanceflow/operations';

describe('computeClientRiskV0', () => {
  it('returns higher score without contact email', () => {
    const withEmail = computeClientRiskV0({ hasContactEmail: true, notesLength: 0 });
    const without = computeClientRiskV0({ hasContactEmail: false, notesLength: 0 });
    expect(without).toBeGreaterThan(withEmail);
  });

  it('clamps to 0–100', () => {
    expect(computeClientRiskV0({ hasContactEmail: false, notesLength: 500 })).toBeLessThanOrEqual(100);
  });
});

describe('riskBand', () => {
  it('labels bands for bidder display', () => {
    expect(riskBand(30)).toBe('low');
    expect(riskBandLabel(riskBand(55))).toBe('Medium risk');
    expect(riskBand(70)).toBe('high');
  });
});

describe('CLIENT_RISK_FORMULA_V0', () => {
  it('has stable version id for AUTO-006', () => {
    expect(CLIENT_RISK_FORMULA_V0).toBe('ops-client-risk-v0');
  });
});

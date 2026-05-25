import {
  DEFAULT_KPI_SIGNAL_THRESHOLDS,
  classifyClientRisk,
  classifyKpiScore,
  highRiskClientMinScore,
  validateThresholdUpdate,
} from '@lanceflow/analytics';
import { describe, expect, it } from 'vitest';

describe('KPI signal thresholds (KPI-005)', () => {
  it('classifies KPI scores with ascending bands', () => {
    const t = DEFAULT_KPI_SIGNAL_THRESHOLDS.kpiScore;
    expect(classifyKpiScore(70, t)).toBe('success');
    expect(classifyKpiScore(69, t)).toBe('warning');
    expect(classifyKpiScore(50, t)).toBe('warning');
    expect(classifyKpiScore(49, t)).toBe('danger');
  });

  it('classifies client risk with descending bands', () => {
    const t = DEFAULT_KPI_SIGNAL_THRESHOLDS.clientRisk;
    expect(classifyClientRisk(39, t)).toBe('success');
    expect(classifyClientRisk(40, t)).toBe('warning');
    expect(classifyClientRisk(59, t)).toBe('warning');
    expect(classifyClientRisk(60, t)).toBe('danger');
  });

  it('derives high-risk minimum from yellow band', () => {
    expect(highRiskClientMinScore(DEFAULT_KPI_SIGNAL_THRESHOLDS.clientRisk)).toBe(60);
  });

  it('rejects invalid threshold updates', () => {
    const result = validateThresholdUpdate(
      { kpiScore: { greenMin: 50, yellowMin: 70 } },
      DEFAULT_KPI_SIGNAL_THRESHOLDS
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.field === 'kpiScore')).toBe(true);
    }
  });

  it('accepts valid partial updates', () => {
    const result = validateThresholdUpdate(
      { clientRisk: { yellowMax: 55 } },
      DEFAULT_KPI_SIGNAL_THRESHOLDS
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.next.clientRisk.yellowMax).toBe(55);
      expect(highRiskClientMinScore(result.next.clientRisk)).toBe(56);
    }
  });
});

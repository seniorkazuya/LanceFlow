import { computeRoleKpi } from '@lanceflow/analytics';
import {
  BIDDER_KPI_WEIGHTS_V1,
  CALLER_KPI_WEIGHTS_V1,
  WORKER_KPI_WEIGHTS_V1,
  computeBidderKpiV1,
  computeCallerKpiV1,
  computeWorkerKpiV1,
  evaluateRule,
  workerKpiV1Rule,
} from '@lanceflow/rules-engine';
import { UserRole } from '@lanceflow/types';
import { describe, expect, it } from 'vitest';

describe('Worker KPI v1 (KPI-001)', () => {
  it('applies Quality×0.4 + Speed×0.3 + Reliability×0.3', () => {
    const result = computeWorkerKpiV1({ quality: 90, speed: 80, reliability: 70 });
    const expected = Math.round(
      90 * WORKER_KPI_WEIGHTS_V1.quality +
        80 * WORKER_KPI_WEIGHTS_V1.speed +
        70 * WORKER_KPI_WEIGHTS_V1.reliability
    );
    expect(result.score).toBe(expected);
    expect(result.score).toBe(81);
  });

  it('clamps out-of-range components', () => {
    const result = computeWorkerKpiV1({ quality: 150, speed: -10, reliability: 50 });
    expect(result.components.quality).toBe(100);
    expect(result.components.speed).toBe(0);
    expect(result.components.reliability).toBe(50);
  });

  it('evaluates via rules engine registry', () => {
    const result = evaluateRule(workerKpiV1Rule, {
      quality: 100,
      speed: 100,
      reliability: 100,
    });
    expect(result.value.score).toBe(100);
    expect(result.explanation.some((line) => line.includes('role-kpi-worker-v1'))).toBe(true);
  });
});

describe('Bidder KPI v1 (KPI-001)', () => {
  it('applies Revenue×0.4 + Client success×0.3 + Payment reliability×0.3', () => {
    const result = computeBidderKpiV1({
      revenue: 100,
      clientSuccess: 80,
      paymentReliability: 60,
    });
    const expected = Math.round(
      100 * BIDDER_KPI_WEIGHTS_V1.revenue +
        80 * BIDDER_KPI_WEIGHTS_V1.clientSuccess +
        60 * BIDDER_KPI_WEIGHTS_V1.paymentReliability
    );
    expect(result.score).toBe(expected);
    expect(result.score).toBe(82);
  });
});

describe('Caller KPI v1 (KPI-001)', () => {
  it('applies Accuracy×0.4 + Conversion×0.3 + Response time×0.3', () => {
    const result = computeCallerKpiV1({
      accuracy: 85,
      conversion: 75,
      responseTime: 95,
    });
    const expected = Math.round(
      85 * CALLER_KPI_WEIGHTS_V1.accuracy +
        75 * CALLER_KPI_WEIGHTS_V1.conversion +
        95 * CALLER_KPI_WEIGHTS_V1.responseTime
    );
    expect(result.score).toBe(expected);
    expect(result.score).toBe(85);
  });
});

describe('computeRoleKpi (analytics module)', () => {
  it('routes engineer role to worker formula', () => {
    const result = computeRoleKpi({
      role: UserRole.ENGINEER,
      components: { quality: 50, speed: 50, reliability: 50 },
    });
    expect(result.formulaVersion).toBe('role-kpi-worker-v1');
    expect(result.score).toBe(50);
  });

  it('routes bidder and caller roles', () => {
    const bidder = computeRoleKpi({
      role: UserRole.BIDDER,
      components: { revenue: 40, clientSuccess: 40, paymentReliability: 40 },
    });
    expect(bidder.formulaVersion).toBe('role-kpi-bidder-v1');

    const caller = computeRoleKpi({
      role: UserRole.CALLER,
      components: { accuracy: 40, conversion: 40, responseTime: 40 },
    });
    expect(caller.formulaVersion).toBe('role-kpi-caller-v1');
  });
});

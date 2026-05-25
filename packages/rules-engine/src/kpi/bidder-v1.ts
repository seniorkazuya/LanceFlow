import { clampKpiComponent, weightedKpiScore } from './common';

/** KPI-001 — Bidder: Revenue×0.4 + Client success×0.3 + Payment reliability×0.3 */
export const BIDDER_KPI_FORMULA_V1 = 'role-kpi-bidder-v1';

export const BIDDER_KPI_WEIGHTS_V1 = {
  revenue: 0.4,
  clientSuccess: 0.3,
  paymentReliability: 0.3,
} as const;

export type BidderKpiInputV1 = {
  revenue: number;
  clientSuccess: number;
  paymentReliability: number;
};

export type BidderKpiResultV1 = {
  formulaVersion: typeof BIDDER_KPI_FORMULA_V1;
  score: number;
  components: {
    revenue: number;
    clientSuccess: number;
    paymentReliability: number;
  };
};

export function computeBidderKpiV1(input: BidderKpiInputV1): BidderKpiResultV1 {
  const components = {
    revenue: clampKpiComponent(input.revenue),
    clientSuccess: clampKpiComponent(input.clientSuccess),
    paymentReliability: clampKpiComponent(input.paymentReliability),
  };
  const score = weightedKpiScore([
    { value: components.revenue, weight: BIDDER_KPI_WEIGHTS_V1.revenue },
    { value: components.clientSuccess, weight: BIDDER_KPI_WEIGHTS_V1.clientSuccess },
    {
      value: components.paymentReliability,
      weight: BIDDER_KPI_WEIGHTS_V1.paymentReliability,
    },
  ]);
  return {
    formulaVersion: BIDDER_KPI_FORMULA_V1,
    score,
    components,
  };
}

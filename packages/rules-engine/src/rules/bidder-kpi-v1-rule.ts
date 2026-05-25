import {
  BIDDER_KPI_FORMULA_V1,
  BIDDER_KPI_WEIGHTS_V1,
  computeBidderKpiV1,
  type BidderKpiInputV1,
  type BidderKpiResultV1,
} from '../kpi/bidder-v1';
import type { RuleDefinition } from '../core/types';

export const bidderKpiV1Rule: RuleDefinition<BidderKpiInputV1, BidderKpiResultV1> = {
  formulaVersion: BIDDER_KPI_FORMULA_V1,
  evaluate(input) {
    const value = computeBidderKpiV1(input);
    const explanation = [
      `formula ${BIDDER_KPI_FORMULA_V1}`,
      `score = revenue×${BIDDER_KPI_WEIGHTS_V1.revenue} + clientSuccess×${BIDDER_KPI_WEIGHTS_V1.clientSuccess} + paymentReliability×${BIDDER_KPI_WEIGHTS_V1.paymentReliability}`,
      `components revenue=${value.components.revenue} clientSuccess=${value.components.clientSuccess} paymentReliability=${value.components.paymentReliability}`,
      `score=${value.score}`,
    ];
    return { value, explanation };
  },
};

import {
  CALLER_KPI_FORMULA_V1,
  CALLER_KPI_WEIGHTS_V1,
  computeCallerKpiV1,
  type CallerKpiInputV1,
  type CallerKpiResultV1,
} from '../kpi/caller-v1';
import type { RuleDefinition } from '../core/types';

export const callerKpiV1Rule: RuleDefinition<CallerKpiInputV1, CallerKpiResultV1> = {
  formulaVersion: CALLER_KPI_FORMULA_V1,
  evaluate(input) {
    const value = computeCallerKpiV1(input);
    const explanation = [
      `formula ${CALLER_KPI_FORMULA_V1}`,
      `score = accuracy×${CALLER_KPI_WEIGHTS_V1.accuracy} + conversion×${CALLER_KPI_WEIGHTS_V1.conversion} + responseTime×${CALLER_KPI_WEIGHTS_V1.responseTime}`,
      `components accuracy=${value.components.accuracy} conversion=${value.components.conversion} responseTime=${value.components.responseTime}`,
      `score=${value.score}`,
    ];
    return { value, explanation };
  },
};

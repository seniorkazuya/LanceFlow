import { clampKpiComponent, weightedKpiScore } from './common';

/** KPI-001 — Caller: Accuracy×0.4 + Conversion×0.3 + Response time×0.3 */
export const CALLER_KPI_FORMULA_V1 = 'role-kpi-caller-v1';

export const CALLER_KPI_WEIGHTS_V1 = {
  accuracy: 0.4,
  conversion: 0.3,
  responseTime: 0.3,
} as const;

export type CallerKpiInputV1 = {
  accuracy: number;
  conversion: number;
  responseTime: number;
};

export type CallerKpiResultV1 = {
  formulaVersion: typeof CALLER_KPI_FORMULA_V1;
  score: number;
  components: {
    accuracy: number;
    conversion: number;
    responseTime: number;
  };
};

export function computeCallerKpiV1(input: CallerKpiInputV1): CallerKpiResultV1 {
  const components = {
    accuracy: clampKpiComponent(input.accuracy),
    conversion: clampKpiComponent(input.conversion),
    responseTime: clampKpiComponent(input.responseTime),
  };
  const score = weightedKpiScore([
    { value: components.accuracy, weight: CALLER_KPI_WEIGHTS_V1.accuracy },
    { value: components.conversion, weight: CALLER_KPI_WEIGHTS_V1.conversion },
    { value: components.responseTime, weight: CALLER_KPI_WEIGHTS_V1.responseTime },
  ]);
  return {
    formulaVersion: CALLER_KPI_FORMULA_V1,
    score,
    components,
  };
}

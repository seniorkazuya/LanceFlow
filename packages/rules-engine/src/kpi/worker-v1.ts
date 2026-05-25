import { clampKpiComponent, weightedKpiScore } from './common';

/** KPI-001 — Worker: Quality×0.4 + Speed×0.3 + Reliability×0.3 */
export const WORKER_KPI_FORMULA_V1 = 'role-kpi-worker-v1';

export const WORKER_KPI_WEIGHTS_V1 = {
  quality: 0.4,
  speed: 0.3,
  reliability: 0.3,
} as const;

export type WorkerKpiInputV1 = {
  quality: number;
  speed: number;
  reliability: number;
};

export type WorkerKpiResultV1 = {
  formulaVersion: typeof WORKER_KPI_FORMULA_V1;
  score: number;
  components: {
    quality: number;
    speed: number;
    reliability: number;
  };
};

export function computeWorkerKpiV1(input: WorkerKpiInputV1): WorkerKpiResultV1 {
  const components = {
    quality: clampKpiComponent(input.quality),
    speed: clampKpiComponent(input.speed),
    reliability: clampKpiComponent(input.reliability),
  };
  const score = weightedKpiScore([
    { value: components.quality, weight: WORKER_KPI_WEIGHTS_V1.quality },
    { value: components.speed, weight: WORKER_KPI_WEIGHTS_V1.speed },
    { value: components.reliability, weight: WORKER_KPI_WEIGHTS_V1.reliability },
  ]);
  return {
    formulaVersion: WORKER_KPI_FORMULA_V1,
    score,
    components,
  };
}

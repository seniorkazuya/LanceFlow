import {
  WORKER_KPI_FORMULA_V1,
  WORKER_KPI_WEIGHTS_V1,
  computeWorkerKpiV1,
  type WorkerKpiInputV1,
  type WorkerKpiResultV1,
} from '../kpi/worker-v1';
import type { RuleDefinition } from '../core/types';

export const workerKpiV1Rule: RuleDefinition<WorkerKpiInputV1, WorkerKpiResultV1> = {
  formulaVersion: WORKER_KPI_FORMULA_V1,
  evaluate(input) {
    const value = computeWorkerKpiV1(input);
    const explanation = [
      `formula ${WORKER_KPI_FORMULA_V1}`,
      `score = quality×${WORKER_KPI_WEIGHTS_V1.quality} + speed×${WORKER_KPI_WEIGHTS_V1.speed} + reliability×${WORKER_KPI_WEIGHTS_V1.reliability}`,
      `components quality=${value.components.quality} speed=${value.components.speed} reliability=${value.components.reliability}`,
      `score=${value.score}`,
    ];
    return { value, explanation };
  },
};

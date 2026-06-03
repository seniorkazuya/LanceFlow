import {
  HIRE_THS_RS_FORMULA_V1,
  evaluateHiringThsRsV1,
  type HiringThsRsInputV1,
  type HiringThsRsResultV1,
} from '../hiring/ths-rs-v1';
import type { RuleDefinition } from '../core/types';

export const hiringThsRsV1Rule: RuleDefinition<HiringThsRsInputV1, HiringThsRsResultV1> = {
  formulaVersion: HIRE_THS_RS_FORMULA_V1,
  evaluate(input) {
    const value = evaluateHiringThsRsV1(input);
    return { value, explanation: value.explanation };
  },
};

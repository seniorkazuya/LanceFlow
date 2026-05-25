import { PROJECT_AUTO_APPROVE_THRESHOLDS } from '@lanceflow/config';

import {
  PROJECT_AUTO_APPROVE_FORMULA_V1,
  evaluateProjectAutoApproveV1,
  type ProjectAutoApproveInputV1,
  type ProjectAutoApproveResultV1,
} from '../approval/project-auto-approve-v1';
import type { RuleDefinition } from '../core/types';

export const projectAutoApproveV1Rule: RuleDefinition<
  ProjectAutoApproveInputV1,
  ProjectAutoApproveResultV1
> = {
  formulaVersion: PROJECT_AUTO_APPROVE_FORMULA_V1,
  evaluate(input) {
    const value = evaluateProjectAutoApproveV1(input, PROJECT_AUTO_APPROVE_THRESHOLDS);
    return { value, explanation: value.explanation };
  },
};

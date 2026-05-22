import {
  ASSIGNMENT_RANK_FORMULA_V1,
  WORKLOAD_PENALTY_PER_ACTIVE_V1,
  type AssignmentRankInputV1,
  type AssignmentRankResultV1,
  rankEngineersForAssignmentV1,
} from '../assignment/rank-v1';
import type { RuleDefinition } from '../core/types';

export const assignmentRankV1Rule: RuleDefinition<
  AssignmentRankInputV1,
  AssignmentRankResultV1[]
> = {
  formulaVersion: ASSIGNMENT_RANK_FORMULA_V1,
  evaluate(input) {
    const value = rankEngineersForAssignmentV1(input);
    const top = value[0];
    const explanation = [
      `formula ${ASSIGNMENT_RANK_FORMULA_V1}`,
      `rankScore = skillMatchPct − (activeAssignments × ${WORKLOAD_PENALTY_PER_ACTIVE_V1})`,
      `candidates=${input.candidates.length}`,
      top
        ? `top=${top.userId} score=${top.rankScore} skill=${top.skillMatchPct}%`
        : 'no candidates',
    ];
    return { value, explanation };
  },
};

import { assignmentRankV1Rule } from './rules/assignment-rank-v1-rule';
import { projectAutoApproveV1Rule } from './rules/project-auto-approve-v1-rule';
import type { RuleDefinition } from './core/types';

/** Known rules keyed by `formulaVersion`. */
const RULES_BY_VERSION: Record<string, RuleDefinition<unknown, unknown>> = {
  [assignmentRankV1Rule.formulaVersion]: assignmentRankV1Rule as RuleDefinition<
    unknown,
    unknown
  >,
  [projectAutoApproveV1Rule.formulaVersion]: projectAutoApproveV1Rule as RuleDefinition<
    unknown,
    unknown
  >,
};

export function getRuleByVersion(
  formulaVersion: string
): RuleDefinition<unknown, unknown> | undefined {
  return RULES_BY_VERSION[formulaVersion];
}

export function listRuleVersions(): string[] {
  return Object.keys(RULES_BY_VERSION).sort();
}

import { hiringThsRsV1Rule } from './rules/hiring-ths-rs-v1-rule';
import { assignmentRankV1Rule } from './rules/assignment-rank-v1-rule';
import { bidderKpiV1Rule } from './rules/bidder-kpi-v1-rule';
import { callerKpiV1Rule } from './rules/caller-kpi-v1-rule';
import { clientRiskPrescreenV1Rule } from './rules/client-risk-prescreen-v1-rule';
import { projectAutoApproveV1Rule } from './rules/project-auto-approve-v1-rule';
import { workerKpiV1Rule } from './rules/worker-kpi-v1-rule';
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
  [clientRiskPrescreenV1Rule.formulaVersion]: clientRiskPrescreenV1Rule as RuleDefinition<
    unknown,
    unknown
  >,
  [workerKpiV1Rule.formulaVersion]: workerKpiV1Rule as RuleDefinition<unknown, unknown>,
  [bidderKpiV1Rule.formulaVersion]: bidderKpiV1Rule as RuleDefinition<unknown, unknown>,
  [callerKpiV1Rule.formulaVersion]: callerKpiV1Rule as RuleDefinition<unknown, unknown>,
  [hiringThsRsV1Rule.formulaVersion]: hiringThsRsV1Rule as RuleDefinition<unknown, unknown>,
};

export function getRuleByVersion(
  formulaVersion: string
): RuleDefinition<unknown, unknown> | undefined {
  return RULES_BY_VERSION[formulaVersion];
}

export function listRuleVersions(): string[] {
  return Object.keys(RULES_BY_VERSION).sort();
}

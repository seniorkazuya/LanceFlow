import {
  evaluateRule,
  getRuleByVersion,
  type BidderKpiInputV1,
  type BidderKpiResultV1,
  type CallerKpiInputV1,
  type CallerKpiResultV1,
  type WorkerKpiInputV1,
  type WorkerKpiResultV1,
  BIDDER_KPI_FORMULA_V1,
  CALLER_KPI_FORMULA_V1,
  WORKER_KPI_FORMULA_V1,
} from '@lanceflow/rules-engine';
import { UserRole } from '@lanceflow/types';

export type RoleKpiRole = typeof UserRole.ENGINEER | typeof UserRole.BIDDER | typeof UserRole.CALLER;

export type RoleKpiInput =
  | { role: typeof UserRole.ENGINEER; components: WorkerKpiInputV1 }
  | { role: typeof UserRole.BIDDER; components: BidderKpiInputV1 }
  | { role: typeof UserRole.CALLER; components: CallerKpiInputV1 };

export type RoleKpiResult = WorkerKpiResultV1 | BidderKpiResultV1 | CallerKpiResultV1;

const FORMULA_BY_ROLE: Record<RoleKpiRole, string> = {
  [UserRole.ENGINEER]: WORKER_KPI_FORMULA_V1,
  [UserRole.BIDDER]: BIDDER_KPI_FORMULA_V1,
  [UserRole.CALLER]: CALLER_KPI_FORMULA_V1,
};

/** KPI-001 — compute versioned role KPI from planning doc weights. */
export function computeRoleKpi(input: RoleKpiInput): RoleKpiResult {
  const formulaVersion = FORMULA_BY_ROLE[input.role];
  const rule = getRuleByVersion(formulaVersion);
  if (!rule) {
    throw new Error(`KPI formula not registered: ${formulaVersion}`);
  }
  const evaluated = evaluateRule(rule, input.components);
  return evaluated.value as RoleKpiResult;
}

export function listRoleKpiFormulaVersions(): string[] {
  return Object.values(FORMULA_BY_ROLE);
}

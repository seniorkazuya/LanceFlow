import {
  BIDDER_KPI_FORMULA_V1,
  CALLER_KPI_FORMULA_V1,
  WORKER_KPI_FORMULA_V1,
  computeBidderKpiV1,
  computeCallerKpiV1,
  computeWorkerKpiV1,
  type BidderKpiInputV1,
  type BidderKpiResultV1,
  type CallerKpiInputV1,
  type CallerKpiResultV1,
  type WorkerKpiInputV1,
  type WorkerKpiResultV1,
} from '@lanceflow/rules-engine/kpi';
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
  switch (input.role) {
    case UserRole.ENGINEER:
      return computeWorkerKpiV1(input.components);
    case UserRole.BIDDER:
      return computeBidderKpiV1(input.components);
    case UserRole.CALLER:
      return computeCallerKpiV1(input.components);
    default:
      throw new Error(`Unsupported KPI role: ${(input as RoleKpiInput).role}`);
  }
}

export function listRoleKpiFormulaVersions(): string[] {
  return Object.values(FORMULA_BY_ROLE);
}

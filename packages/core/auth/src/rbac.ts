import { UserRole, type UserRole as UserRoleType } from '@lanceflow/types';

import type { SessionUser } from './types';

/** Route/resource policies — default deny; routes must pick an explicit allow list. */
export const RolePolicy = {
  /** Control center and ops oversight (CEO + Ops only). */
  controlCenter: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** KPI signal threshold config write — CEO only (KPI-005). */
  kpiThresholdsWrite: [UserRole.CEO] as const,
  /** Ops workflow dashboard (OPS-008). */
  opsConsoleRead: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Hiring CEO queue — engineers must not access. */
  hiringCeoQueue: [
    UserRole.CEO,
    UserRole.OPS_MANAGER,
    UserRole.CALLER,
    UserRole.BIDDER,
  ] as const,
  /** Resume parse / hiring application management (HIRE-002). */
  hiringApplicationsManage: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Audit log read — CEO only (CORE-006). */
  auditRead: [UserRole.CEO] as const,
  /** Client records read (OPS-001). */
  clientsRead: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.BIDDER] as const,
  /** Client records write (OPS-001). */
  clientsWrite: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Client risk pre-screen before bid (AUTO-006). */
  clientRiskPrescreen: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.BIDDER] as const,
  /** Project lifecycle read (OPS-003). */
  projectsRead: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.BIDDER] as const,
  /** Project lifecycle write (OPS-003). */
  projectsWrite: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Engineer skills and workload read (OPS-004). */
  workersRead: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Engineer skill tag updates (OPS-004). */
  workersWrite: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Submit daily report (OPS-006). */
  dailyReportsSubmit: [UserRole.ENGINEER] as const,
  /** Missing daily reports oversight (OPS-006). */
  missingReportsRead: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** SOP library read (OPS-007). */
  sopsRead: [
    UserRole.CEO,
    UserRole.OPS_MANAGER,
    UserRole.CALLER,
    UserRole.BIDDER,
    UserRole.ENGINEER,
  ] as const,
  /** Any signed-in operational role. */
  authenticated: [
    UserRole.CEO,
    UserRole.OPS_MANAGER,
    UserRole.CALLER,
    UserRole.BIDDER,
    UserRole.ENGINEER,
  ] as const,
} as const;

export type RolePolicyKey = keyof typeof RolePolicy;

export function hasRole(userRole: string, allowed: readonly UserRoleType[]): boolean {
  return (allowed as readonly string[]).includes(userRole);
}

export class ForbiddenError extends Error {
  readonly status = 403;

  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/** Throws UnauthorizedError or ForbiddenError when the role is not allowed. */
export function assertRole(userRole: string, allowed: readonly UserRoleType[]): void {
  if (!userRole) {
    throw new UnauthorizedError();
  }
  if (!hasRole(userRole, allowed)) {
    throw new ForbiddenError();
  }
}

export type AuthorizeResult =
  | { ok: true; user: SessionUser }
  | { ok: false; status: 401 | 403; error: string };

export function authorizeRequest(
  user: SessionUser | null,
  allowed: readonly UserRoleType[]
): AuthorizeResult {
  if (!user) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  if (!hasRole(user.role, allowed)) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }
  return { ok: true, user };
}

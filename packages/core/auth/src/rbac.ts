import { UserRole, type UserRole as UserRoleType } from '@lanceflow/types';

import type { SessionUser } from './types';

/** Route/resource policies — default deny; routes must pick an explicit allow list. */
export const RolePolicy = {
  /** Control center and ops oversight (CEO + Ops only). */
  controlCenter: [UserRole.CEO, UserRole.OPS_MANAGER] as const,
  /** Hiring CEO queue — engineers must not access. */
  hiringCeoQueue: [
    UserRole.CEO,
    UserRole.OPS_MANAGER,
    UserRole.CALLER,
    UserRole.BIDDER,
  ] as const,
  /** Audit log read — CEO only (CORE-006). */
  auditRead: [UserRole.CEO] as const,
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

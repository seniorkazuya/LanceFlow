import type { UserRole } from '@lanceflow/types';

import { authorizeRequest } from './rbac';
import type { SessionUser } from './types';

export type AuthRouteContext = {
  user: SessionUser;
};

export type AuthRouteHandler = (
  request: Request,
  context: AuthRouteContext
) => Promise<Response> | Response;

export type AuthRouteFailure = {
  error: string;
  status: 401 | 403;
};

export type AuthRouteOutcome = Response | AuthRouteFailure;

/**
 * Wraps a route handler with RBAC. The host app resolves the session and passes `user`.
 * Returns a Response or a failure object the host converts to JSON.
 */
export function withAuth(
  allowedRoles: readonly UserRole[],
  handler: AuthRouteHandler
): (request: Request, user: SessionUser | null) => Promise<AuthRouteOutcome> {
  return async (request, user) => {
    const authz = authorizeRequest(user, allowedRoles);
    if (!authz.ok) {
      return { error: authz.error, status: authz.status };
    }
    return handler(request, { user: authz.user });
  };
}

export function isAuthRouteFailure(outcome: AuthRouteOutcome): outcome is AuthRouteFailure {
  return 'status' in outcome && typeof (outcome as AuthRouteFailure).status === 'number';
}

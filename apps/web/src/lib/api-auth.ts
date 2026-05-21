import {
  RolePolicy,
  isAuthRouteFailure,
  withAuth,
  type AuthRouteHandler,
  type SessionUser,
} from '@lanceflow/auth';
import { UserRole, type UserRole as UserRoleType } from '@lanceflow/types';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';

import { withApiLogging } from './api-route';

export { RolePolicy };

export function sessionToUser(session: Session | null): SessionUser | null {
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    displayName: session.user.name ?? session.user.email,
    role: session.user.role as UserRoleType,
  };
}

function toResponse(outcome: Awaited<ReturnType<ReturnType<typeof withAuth>>>): Response {
  if (isAuthRouteFailure(outcome)) {
    return NextResponse.json({ error: outcome.error }, { status: outcome.status });
  }
  return outcome;
}

/** Authenticated API route with RBAC + structured logging. */
export function withAuthRoute(
  route: string,
  allowedRoles: readonly UserRoleType[],
  handler: AuthRouteHandler
) {
  const guarded = withAuth(allowedRoles, handler);
  return withApiLogging(route, async (request) => {
    const session = await getAuthSession();
    const user = sessionToUser(session);
    return toResponse(await guarded(request, user));
  });
}

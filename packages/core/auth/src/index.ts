export type { DevAuthConfig } from './credentials';
export { resolveDevAuthConfig, validateDevCredentials } from './credentials';
export type { SessionUser } from './types';
export { findOrCreateUserForSignIn } from './user';
export {
  ForbiddenError,
  RolePolicy,
  UnauthorizedError,
  assertRole,
  authorizeRequest,
  hasRole,
  type AuthorizeResult,
  type RolePolicyKey,
} from './rbac';
export {
  isAuthRouteFailure,
  withAuth,
  type AuthRouteContext,
  type AuthRouteFailure,
  type AuthRouteHandler,
  type AuthRouteOutcome,
} from './with-auth';

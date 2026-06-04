export type { DevAuthConfig } from './credentials';
export { resolveDevAuthConfig, validateDevCredentials } from './credentials';
export {
  checkPrismaAuthDatabase,
  probeSignIn,
  type PrismaAuthCheck,
  type SignInProbeResult,
} from './auth-diagnostics';
export type { SessionUser } from './types';
export { findOrCreateUserForSignIn } from './user';
export { hashPassword, verifyPassword } from './password';
export {
  AuthRegistrationError,
  authenticatePortalUser,
  normalizeAuthEmail,
  postLoginPathForRole,
  registerPortalUser,
  resolveGoogleSignInUser,
  validatePortalRegistrationInput,
  type GoogleSignInResult,
} from './portal';
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

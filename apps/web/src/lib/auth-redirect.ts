import { UserRole } from '@lanceflow/types';

/** Client-safe post-login paths by role (keep in sync with @lanceflow/auth postLoginPathForRole). */
export function postLoginPathForRole(role: string): string {
  if (role === UserRole.CLIENT) return '/projects';
  if (role === UserRole.DEVELOPER) return '/apply';
  return '/dashboard';
}

import { UserRole, type UserRole as UserRoleType } from '@lanceflow/types';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** Roles that may see this nav entry — aligned with @lanceflow/auth RolePolicy. */
  allowedRoles: readonly UserRoleType[];
};

/** App navigation — filtered per role in AppShell. */
export const APP_NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    allowedRoles: [
      UserRole.CEO,
      UserRole.OPS_MANAGER,
      UserRole.CALLER,
      UserRole.BIDDER,
      UserRole.ENGINEER,
    ],
  },
  {
    id: 'control',
    label: 'Control Center',
    href: '/control',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER],
  },
  {
    id: 'hiring-ceo-queue',
    label: 'Hiring CEO Queue',
    href: '/hiring/ceo-queue',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.CALLER, UserRole.BIDDER],
  },
] as const;

export function getNavItemsForRole(role: string): NavItem[] {
  return APP_NAV_ITEMS.filter((item) =>
    (item.allowedRoles as readonly string[]).includes(role)
  );
}

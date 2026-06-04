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
      UserRole.CLIENT,
      UserRole.DEVELOPER,
    ],
  },
  {
    id: 'apply',
    label: 'Apply',
    href: '/apply',
    allowedRoles: [UserRole.DEVELOPER],
  },
  {
    id: 'clients',
    label: 'Clients',
    href: '/clients',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.BIDDER],
  },
  {
    id: 'my-projects',
    label: 'My projects',
    href: '/projects',
    allowedRoles: [UserRole.CLIENT],
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER, UserRole.BIDDER],
  },
  {
    id: 'workers',
    label: 'Team workload',
    href: '/workers',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER],
  },
  {
    id: 'daily-reports',
    label: 'Daily report',
    href: '/daily-reports',
    allowedRoles: [UserRole.ENGINEER],
  },
  {
    id: 'ops-console',
    label: 'Ops console',
    href: '/ops',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER],
  },
  {
    id: 'missing-reports',
    label: 'Missing reports',
    href: '/daily-reports/missing',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER],
  },
  {
    id: 'sops',
    label: 'SOPs',
    href: '/sops',
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
    id: 'hiring-pipeline',
    label: 'Hiring pipeline',
    href: '/hiring/pipeline',
    allowedRoles: [UserRole.CEO, UserRole.OPS_MANAGER],
  },
  {
    id: 'hiring-ceo-queue',
    label: 'Hiring CEO Queue',
    href: '/hiring/ceo-queue',
    allowedRoles: [UserRole.CEO],
  },
  {
    id: 'audit',
    label: 'Audit Log',
    href: '/audit',
    allowedRoles: [UserRole.CEO],
  },
] as const;

export function getNavItemsForRole(role: string): NavItem[] {
  return APP_NAV_ITEMS.filter((item) =>
    (item.allowedRoles as readonly string[]).includes(role)
  );
}

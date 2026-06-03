/** Shared domain enums — extend in later stories (CORE-003 adds full RBAC). */
export const UserRole = {
  CEO: 'CEO',
  OPS_MANAGER: 'OPS_MANAGER',
  CALLER: 'CALLER',
  BIDDER: 'BIDDER',
  ENGINEER: 'ENGINEER',
  /** External client portal account */
  CLIENT: 'CLIENT',
  /** External developer / talent portal account */
  DEVELOPER: 'DEVELOPER',
} as const;

export const AccountType = {
  STAFF: 'staff',
  CLIENT: 'client',
  DEVELOPER: 'developer',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export type PortalAccountType = typeof AccountType.CLIENT | typeof AccountType.DEVELOPER;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type HealthCheckStatus = 'ok' | 'error' | 'skipped';

export type ApiHealth = {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
  checks: {
    database: HealthCheckStatus;
    redis: HealthCheckStatus;
  };
};

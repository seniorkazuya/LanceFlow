/** Shared domain enums — extend in later stories (CORE-003 adds full RBAC). */
export const UserRole = {
  CEO: 'CEO',
  OPS_MANAGER: 'OPS_MANAGER',
  CALLER: 'CALLER',
  BIDDER: 'BIDDER',
  ENGINEER: 'ENGINEER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiHealth = {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
};

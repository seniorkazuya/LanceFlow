import type { UserRole } from '@lanceflow/types';

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
};

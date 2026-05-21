import { prisma } from '@lanceflow/database';
import { UserRole, type UserRole as UserRoleType } from '@lanceflow/types';

import type { SessionUser } from './types';

export async function findOrCreateUserForSignIn(params: {
  email: string;
  displayName?: string;
  defaultRole?: UserRoleType;
}): Promise<SessionUser> {
  const displayName = params.displayName ?? params.email.split('@')[0] ?? 'User';
  const role = params.defaultRole ?? UserRole.OPS_MANAGER;

  const user = await prisma.user.upsert({
    where: { email: params.email },
    create: {
      email: params.email,
      displayName,
      role,
    },
    update: {
      displayName,
    },
  });

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role as UserRoleType,
  };
}

import { prisma } from '@lanceflow/database';

import { findOrCreateUserForSignIn } from './user';
import { resolveDevAuthConfig, validateDevCredentials } from './credentials';

export type PrismaAuthCheck = {
  ok: boolean;
  error?: string;
  userCount?: number;
};

/** Verifies Prisma can reach DB and the users table exists (health/pg alone is not enough). */
export async function checkPrismaAuthDatabase(): Promise<PrismaAuthCheck> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    return { ok: true, userCount };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

export type SignInProbeResult = {
  credentialsMatch: boolean;
  databaseOk: boolean;
  databaseError?: string;
  expectedEmail: string | null;
};

/** Same steps as NextAuth authorize — shows which step fails (safe JSON, no secrets). */
export async function probeSignIn(email: string, password: string): Promise<SignInProbeResult> {
  const config = resolveDevAuthConfig();
  if (!config) {
    return { credentialsMatch: false, databaseOk: false, databaseError: 'DEV_AUTH_* not configured', expectedEmail: null };
  }

  const credentialsMatch = validateDevCredentials(email, password, config);
  if (!credentialsMatch) {
    return { credentialsMatch: false, databaseOk: false, expectedEmail: config.email };
  }

  try {
    await findOrCreateUserForSignIn({ email: config.email });
    return { credentialsMatch: true, databaseOk: true, expectedEmail: config.email };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      credentialsMatch: true,
      databaseOk: false,
      databaseError: message,
      expectedEmail: config.email,
    };
  }
}

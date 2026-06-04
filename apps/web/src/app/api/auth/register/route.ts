import { auditLog } from '@lanceflow/audit';
import {
  AuthRegistrationError,
  postLoginPathForRole,
  registerPortalUser,
} from '@lanceflow/auth';
import { AccountType } from '@lanceflow/types';
import { loadMonorepoEnv } from '@/lib/load-monorepo-env';
import { NextResponse } from 'next/server';

type RegisterBody = {
  email?: string;
  password?: string;
  displayName?: string;
  accountType?: string;
};

function databaseNotConfiguredResponse() {
  return NextResponse.json(
    {
      message:
        'Database is not configured. Add DATABASE_URL to the repo root .env, run pnpm db:migrate:deploy, then restart pnpm dev.',
    },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  loadMonorepoEnv();
  if (!process.env.DATABASE_URL?.trim()) {
    return databaseNotConfiguredResponse();
  }

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const accountType = body.accountType;
  if (accountType !== AccountType.CLIENT && accountType !== AccountType.DEVELOPER) {
    return NextResponse.json({ message: 'Invalid account type.' }, { status: 400 });
  }

  try {
    const user = await registerPortalUser({
      email: body.email ?? '',
      password: body.password ?? '',
      displayName: body.displayName,
      accountType,
    });

    try {
      await auditLog({
        actorId: user.id,
        action: 'auth.register',
        entityType: 'user',
        entityId: user.id,
        payload: { email: user.email, role: user.role, accountType },
      });
    } catch (auditError) {
      console.error('[auth] auditLog auth.register failed', auditError);
    }

    return NextResponse.json(
      {
        message: 'Account created. Sign in with your email and password.',
        redirectTo: `/auth/signin?registered=1&role=${user.role}`,
        postLoginPath: postLoginPathForRole(user.role),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthRegistrationError) {
      const status = error.code === 'EMAIL_TAKEN' ? 409 : 400;
      return NextResponse.json({ message: error.message }, { status });
    }
    const message = error instanceof Error ? error.message : '';
    if (message.includes('DATABASE_URL') || message.includes('PrismaClientInitializationError')) {
      return databaseNotConfiguredResponse();
    }
    console.error('[auth] register failed', error);
    return NextResponse.json({ message: 'Registration failed. Try again later.' }, { status: 500 });
  }
}

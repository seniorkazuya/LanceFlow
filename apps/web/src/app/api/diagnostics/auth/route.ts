import {
  checkPrismaAuthDatabase,
  probeSignIn,
  resolveDevAuthConfig,
} from '@lanceflow/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Auth diagnostics — GET status, POST probe sign-in steps (safe, no secrets returned).
 * GET  /api/diagnostics/auth
 * POST /api/diagnostics/auth  { "email": "...", "password": "..." }
 */
export async function GET() {
  const devAuth = resolveDevAuthConfig();
  const authSecret = Boolean(process.env.AUTH_SECRET?.trim());
  const authUrl = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim() || null;
  const databaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const prismaCheck = await checkPrismaAuthDatabase();

  const envReady = Boolean(devAuth && authSecret && databaseUrl);
  const ready = envReady && prismaCheck.ok;

  return NextResponse.json({
    ready,
    checks: {
      devAuthEmail: Boolean(process.env.DEV_AUTH_EMAIL?.trim()),
      devAuthPassword: Boolean(process.env.DEV_AUTH_PASSWORD?.trim()),
      authSecret,
      authUrl: authUrl ?? '(not set)',
      databaseUrl,
      prismaUsersTable: prismaCheck.ok,
    },
    prisma: prismaCheck.ok
      ? { userCount: prismaCheck.userCount }
      : { error: prismaCheck.error },
    expectedLogin: devAuth
      ? { email: devAuth.email, note: 'Password must match DEV_AUTH_PASSWORD on Vercel exactly' }
      : null,
    hint: !prismaCheck.ok
      ? 'Database connects but Prisma/users table failed — run Deploy Staging (migrate job) on the same DATABASE_URL as Vercel.'
      : envReady
        ? 'Env OK. POST JSON {email,password} to this URL to see if credentials or DB upsert fails.'
        : 'Set missing vars on Vercel (Production + Preview), redeploy.',
  });
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const result = await probeSignIn(email, password);

  let diagnosis: string;
  if (!result.credentialsMatch) {
    diagnosis =
      'Password or email does not match Vercel DEV_AUTH_* (your local .env is not used on staging).';
  } else if (!result.databaseOk) {
    diagnosis =
      'Credentials match but database upsert failed — run migrations (GitHub Deploy Staging) on the lanceflow database.';
  } else {
    diagnosis = 'Credentials and database OK — sign-in should work; try private window / clear cookies.';
  }

  return NextResponse.json({ ...result, diagnosis });
}

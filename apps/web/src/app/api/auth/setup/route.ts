import { resolveDevAuthConfig } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

/**
 * Safe staging diagnostic — which auth env vars are set (never returns secrets).
 * Use when sign-in fails: GET /api/auth/setup
 */
export async function GET() {
  const devAuth = resolveDevAuthConfig();
  const authSecret = Boolean(process.env.AUTH_SECRET?.trim());
  const authUrl = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim() || null;
  const databaseUrl = Boolean(process.env.DATABASE_URL?.trim());

  const ready = Boolean(devAuth && authSecret && databaseUrl);

  return NextResponse.json({
    ready,
    checks: {
      devAuthEmail: Boolean(process.env.DEV_AUTH_EMAIL?.trim()),
      devAuthPassword: Boolean(process.env.DEV_AUTH_PASSWORD),
      authSecret,
      authUrl: authUrl ?? '(not set — set AUTH_URL to your public app URL on Vercel)',
      databaseUrl,
    },
    hint: devAuth
      ? `Sign-in accepts exactly: ${devAuth.email} + DEV_AUTH_PASSWORD from Vercel env (not your local .env).`
      : 'Set DEV_AUTH_EMAIL and DEV_AUTH_PASSWORD on Vercel (Production environment), then redeploy.',
    vercelNote:
      'Staging deploy uses Vercel **Production** env vars for this project. Preview-only vars are not used.',
  });
}

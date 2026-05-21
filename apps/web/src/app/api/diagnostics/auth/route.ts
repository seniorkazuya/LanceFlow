import { resolveDevAuthConfig } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

/**
 * Auth env diagnostic (not under /api/auth/* — NextAuth catch-all returns "Bad request" there).
 * GET /api/diagnostics/auth
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
      devAuthPassword: Boolean(process.env.DEV_AUTH_PASSWORD?.trim()),
      authSecret,
      authUrl: authUrl ?? '(not set)',
      databaseUrl,
    },
    expectedLogin: devAuth
      ? { email: devAuth.email, note: 'Password must match DEV_AUTH_PASSWORD on Vercel exactly' }
      : null,
    hint: ready
      ? 'Env looks complete. If sign-in still fails, re-save DEV_AUTH_PASSWORD (no quotes) and redeploy.'
      : 'Set missing vars on Vercel → Production + Preview, then redeploy via GitHub Actions → Deploy Staging.',
  });
}

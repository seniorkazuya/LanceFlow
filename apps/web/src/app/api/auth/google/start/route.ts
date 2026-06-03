import { AccountType } from '@lanceflow/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';

const PORTAL_ACCOUNT_TYPE_COOKIE = 'portal_account_type';

export async function GET(request: Request) {
  if (!isGoogleAuthConfigured()) {
    redirect('/auth/signin?error=google_not_configured');
  }

  const { searchParams, origin } = new URL(request.url);
  const accountType = searchParams.get('accountType');
  const jar = await cookies();

  if (accountType === AccountType.CLIENT || accountType === AccountType.DEVELOPER) {
    jar.set(PORTAL_ACCOUNT_TYPE_COOKIE, accountType, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
  } else {
    jar.delete(PORTAL_ACCOUNT_TYPE_COOKIE);
  }

  // Auth.js v5 does not support GET /api/auth/signin/google — use signIn() instead.
  return signIn('google', { redirectTo: `${origin}/api/auth/post-login` });
}

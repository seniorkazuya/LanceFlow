import { AccountType } from '@lanceflow/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { isMicrosoftAuthConfigured } from '@/lib/microsoft-auth-config';

const PORTAL_ACCOUNT_TYPE_COOKIE = 'portal_account_type';

export async function GET(request: Request) {
  if (!isMicrosoftAuthConfigured()) {
    redirect('/auth/signin?error=microsoft_not_configured');
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

  return signIn('microsoft-entra-id', { redirectTo: `${origin}/api/auth/post-login` });
}

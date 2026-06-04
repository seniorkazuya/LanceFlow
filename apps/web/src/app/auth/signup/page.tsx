import { AccountType } from '@lanceflow/types';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';
import { isMicrosoftAuthConfigured } from '@/lib/microsoft-auth-config';

type PageProps = {
  searchParams: Promise<{ error?: string; role?: string }>;
};

function resolveInitialRole(role: string | undefined) {
  if (role === 'client') return AccountType.CLIENT;
  if (role === 'developer' || role === 'talent') return AccountType.DEVELOPER;
  return undefined;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { error, role } = await searchParams;
  const showAccountTypeError = error === 'choose_account_type';
  const oauthNotConfigured =
    error === 'google_not_configured' || error === 'microsoft_not_configured';
  const oauthMessage =
    error === 'microsoft_not_configured'
      ? 'Outlook sign-in is not configured yet. Add AZURE_AD_CLIENT_ID and AZURE_AD_CLIENT_SECRET to .env, then restart the dev server.'
      : error === 'google_not_configured'
        ? 'Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env, then restart the dev server.'
        : null;

  return (
    <AuthPageShell
      label="Get started"
      title="Create your account"
      description="Hire talent or bring your strengths — start moving in flow."
    >
      {showAccountTypeError ? (
        <p role="alert" className="form-banner form-banner-error">
          New social sign-up accounts must pick client or talent first.
        </p>
      ) : null}
      {oauthNotConfigured && oauthMessage ? (
        <p role="status" className="form-banner form-banner-error">
          {oauthMessage}
        </p>
      ) : null}
      <SignUpForm
        initialAccountType={resolveInitialRole(role)}
        googleEnabled={isGoogleAuthConfigured()}
        microsoftEnabled={isMicrosoftAuthConfigured()}
      />
    </AuthPageShell>
  );
}

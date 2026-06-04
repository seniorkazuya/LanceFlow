'use client';

import { AccountType, type PortalAccountType } from '@lanceflow/types';

type SocialSignInButtonsProps = {
  accountType?: PortalAccountType;
  googleEnabled: boolean;
  microsoftEnabled: boolean;
  mode?: 'signin' | 'signup';
  googleLabel?: string;
  outlookLabel?: string;
};

function buildOAuthStartUrl(provider: 'google' | 'microsoft', accountType?: PortalAccountType): string {
  const params = new URLSearchParams();
  if (accountType === AccountType.CLIENT || accountType === AccountType.DEVELOPER) {
    params.set('accountType', accountType);
  }
  const query = params.toString();
  const base = provider === 'google' ? '/api/auth/google/start' : '/api/auth/microsoft/start';
  return query ? `${base}?${query}` : base;
}

function fallbackHref(
  provider: 'google' | 'microsoft',
  mode: 'signin' | 'signup'
): string {
  const error = provider === 'google' ? 'google_not_configured' : 'microsoft_not_configured';
  const base = mode === 'signup' ? '/auth/signup' : '/auth/signin';
  return `${base}?error=${error}`;
}

export function SocialSignInButtons({
  accountType,
  googleEnabled,
  microsoftEnabled,
  mode = 'signin',
  googleLabel = 'Continue with Google',
  outlookLabel = 'Continue with Outlook',
}: SocialSignInButtonsProps) {
  const googleHref = googleEnabled
    ? buildOAuthStartUrl('google', accountType)
    : fallbackHref('google', mode);
  const microsoftHref = microsoftEnabled
    ? buildOAuthStartUrl('microsoft', accountType)
    : fallbackHref('microsoft', mode);

  return (
    <>
      <a
        href={googleHref}
        className={`btn btn-social${googleEnabled ? '' : ' btn-social--unconfigured'}`}
        aria-disabled={!googleEnabled}
        title={googleEnabled ? undefined : 'Google sign-in is not configured on this server yet.'}
      >
        <GoogleMark />
        {googleLabel}
      </a>
      <a
        href={microsoftHref}
        className={`btn btn-social${microsoftEnabled ? '' : ' btn-social--unconfigured'}`}
        aria-disabled={!microsoftEnabled}
        title={microsoftEnabled ? undefined : 'Outlook sign-in is not configured on this server yet.'}
      >
        <OutlookMark />
        {outlookLabel}
      </a>
    </>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return <div className="auth-divider">{label}</div>;
}

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="btn-social-icon">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function OutlookMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="btn-social-icon">
      <path
        fill="#0078D4"
        d="M23 12.5v8.25c0 .69-.56 1.25-1.25 1.25H3.75A1.25 1.25 0 0 1 2.5 20.75V3.75C2.5 3.06 3.06 2.5 3.75 2.5h8.69c.69 0 1.25.56 1.25 1.25v3.5h3.19c.69 0 1.25.56 1.25 1.25v4h3.07c.69 0 1.25.56 1.25 1.25v4.25h1.2c.69 0 1.25.56 1.25 1.25Z"
      />
      <path fill="#28A8EA" d="M14.69 7.25H7.44v9.5h7.25V7.25Z" />
      <path fill="#0078D4" d="M16.94 7.25h-2.25v9.5h2.25V7.25Z" />
      <path fill="#50D9FF" d="M7.44 7.25H4.5v4.75h2.94V7.25Z" />
    </svg>
  );
}

'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { AuthDivider, SocialSignInButtons } from '@/components/auth/social-sign-in-buttons';
import { postLoginPathForRole } from '@/lib/auth-redirect';

const ERROR_MESSAGES: Record<string, string> = {
  google_not_configured: 'Google sign-in is not configured yet. Use email and password.',
  microsoft_not_configured: 'Outlook sign-in is not configured yet. Use email and password.',
  choose_account_type: 'Choose client or developer sign-up before using social sign-in for a new account.',
};

export function SignInForm({
  registered,
  errorCode,
  googleEnabled,
  microsoftEnabled,
}: {
  registered?: boolean;
  errorCode?: string;
  googleEnabled: boolean;
  microsoftEnabled: boolean;
}) {
  const [error, setError] = useState<string | null>(() => {
    if (errorCode === 'google_not_configured' || errorCode === 'microsoft_not_configured') {
      return null;
    }
    return errorCode ? (ERROR_MESSAGES[errorCode] ?? 'Sign-in failed. Try again.') : null;
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: String(form.get('email')),
      password: String(form.get('password')),
      redirect: false,
    });

    if (result?.error) {
      setPending(false);
      setError('Invalid email or password.');
      return;
    }

    const meRes = await fetch('/api/me');
    if (meRes.ok) {
      const me = (await meRes.json()) as { role?: string };
      window.location.href = postLoginPathForRole(me.role ?? '');
      return;
    }

    setPending(false);
    window.location.href = '/dashboard';
  }

  return (
    <>
      {registered ? (
        <p role="status" className="form-banner form-banner-success">
          Account created. Sign in with your email and password, or continue with Google or Outlook.
        </p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="field">
          <div className="field-row">
            <label htmlFor="signin-password">Password</label>
            <a href="#">Forgot password?</a>
          </div>
          <input
            id="signin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="current-password"
          />
        </div>
        <label className="remember">
          <input type="checkbox" name="remember" />
          Keep me signed in
        </label>
        {error ? (
          <p role="alert" className="field-error">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <AuthDivider label="or continue with" />
      <SocialSignInButtons
        mode="signin"
        googleEnabled={googleEnabled}
        microsoftEnabled={microsoftEnabled}
      />

      <p className="auth-foot">
        New to Lanceflows? <Link href="/auth/signup">Create an account</Link>
      </p>
    </>
  );
}

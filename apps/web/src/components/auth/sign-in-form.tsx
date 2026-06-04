'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { AuthDivider, GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { postLoginPathForRole } from '@/lib/auth-redirect';

const ERROR_MESSAGES: Record<string, string> = {
  google_not_configured: 'Google sign-in is not configured yet. Use email and password.',
  choose_account_type: 'Choose client or developer sign-up before using Google for a new account.',
};

export function SignInForm({
  registered,
  errorCode,
  googleEnabled,
}: {
  registered?: boolean;
  errorCode?: string;
  googleEnabled: boolean;
}) {
  const [error, setError] = useState<string | null>(() => {
    if (errorCode === 'google_not_configured') return null;
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
    <div className="auth-form-stack">
      {registered ? (
        <p role="status" className="form-banner form-banner-success">
          Account created. Sign in with your email and password, or continue with Google.
        </p>
      ) : null}

      {googleEnabled ? (
        <>
          <GoogleSignInButton />
          <AuthDivider />
        </>
      ) : null}

      <form onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="signin-email">Email</label>
          <input id="signin-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        {error ? (
          <p role="alert" className="field-error">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary auth-submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>

      <div className="auth-form-footer">
        <p className="auth-form-footer-title">New to Lanceflows?</p>
        <div className="auth-link-grid">
          <Link className="btn btn-ghost" href="/auth/signup/client">
            Sign up as client
          </Link>
          <Link className="btn btn-ghost" href="/auth/signup/developer">
            Sign up as developer
          </Link>
        </div>
        <p className="auth-form-note">Internal team? Use your company credentials on this page.</p>
      </div>
    </div>
  );
}

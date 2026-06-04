'use client';

import { AccountType, type PortalAccountType } from '@lanceflow/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthDivider, GoogleSignInButton } from '@/components/auth/google-sign-in-button';

type SignUpFormProps = {
  accountType: PortalAccountType;
  title: string;
  description: string;
  googleEnabled: boolean;
};

export function SignUpForm({ accountType, title, description, googleEnabled }: SignUpFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(form.get('email')),
        password: String(form.get('password')),
        displayName: String(form.get('displayName') || ''),
        accountType,
      }),
    });

    const data = (await res.json()) as { message?: string; redirectTo?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.message ?? 'Registration failed. Try again.');
      return;
    }

    router.push(data.redirectTo ?? '/auth/signin');
  }

  const signInHint =
    accountType === AccountType.CLIENT
      ? 'Already have a client account?'
      : 'Already have a developer account?';

  return (
    <div className="auth-form-stack">
      <div className="auth-form-intro-block">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {googleEnabled ? (
        <>
          <GoogleSignInButton accountType={accountType} label="Sign up with Google" />
          <AuthDivider />
        </>
      ) : null}

      <form onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="signup-name">Full name</label>
          <input id="signup-name" name="displayName" type="text" autoComplete="name" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="field-hint">At least 8 characters</span>
        </div>
        {error ? (
          <p role="alert" className="field-error">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary auth-submit" disabled={pending}>
          {pending ? 'Creating account…' : 'Create account with email'}
        </button>
      </form>

      <p className="auth-form-signin-link">
        {signInHint}{' '}
        <Link href="/auth/signin">Sign in</Link>
      </p>
    </div>
  );
}

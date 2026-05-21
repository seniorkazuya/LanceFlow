'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
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

    setPending(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 360 }}>
      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--border)' }}
        />
      </label>
      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span>Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--border)' }}
        />
      </label>
      {error ? (
        <p role="alert" style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '0.6rem 1rem',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 600,
          cursor: pending ? 'wait' : 'pointer',
        }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

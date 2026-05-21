'use client';

import { Button, Input } from '@lanceflow/ui';
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
      setError(
        'Sign-in failed. Open /api/diagnostics/auth — use POST with your email/password to see if credentials or database failed.'
      );
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <Input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Password</span>
        <Input name="password" type="password" required autoComplete="current-password" />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

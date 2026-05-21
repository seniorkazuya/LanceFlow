'use client';

import { Button } from '@lanceflow/ui';
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
        'Invalid email or password. Check Vercel DEV_AUTH_* — open /api/diagnostics/auth'
      );
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/50"
        />
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

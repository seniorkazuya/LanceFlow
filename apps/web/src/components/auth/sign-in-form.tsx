'use client';

import { Button, Input } from '@lanceflow/ui';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { postLoginPathForRole } from '@/lib/auth-redirect';

export function SignInForm({ registered }: { registered?: boolean }) {
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
    <div className="space-y-6">
      {registered ? (
        <p role="status" className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          Account created. Sign in with your email and password.
        </p>
      ) : null}

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

      <div className="space-y-3 border-t border-border/60 pt-4">
        <p className="text-center text-sm font-medium text-foreground">New to Lanceflows?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href="/auth/signup/client"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Sign up as client
          </Link>
          <Link
            href="/auth/signup/developer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Sign up as developer
          </Link>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Internal team? Use your company credentials on this page.
        </p>
      </div>
    </div>
  );
}

'use client';

import { AccountType, type PortalAccountType } from '@lanceflow/types';
import { Button, Input } from '@lanceflow/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SignUpFormProps = {
  accountType: PortalAccountType;
  title: string;
  description: string;
};

export function SignUpForm({ accountType, title, description }: SignUpFormProps) {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Full name</span>
          <Input name="displayName" type="text" autoComplete="name" maxLength={120} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Email</span>
          <Input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Password</span>
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="text-xs text-muted-foreground">At least 8 characters</span>
        </label>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {signInHint}{' '}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

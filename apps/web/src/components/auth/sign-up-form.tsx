'use client';

import { AccountType, type PortalAccountType } from '@lanceflow/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AuthDivider, SocialSignInButtons } from '@/components/auth/social-sign-in-buttons';

type SignUpFormProps = {
  initialAccountType?: PortalAccountType;
  googleEnabled: boolean;
  microsoftEnabled: boolean;
};

const HEAR_OPTIONS = [
  { value: 'search', label: 'Search engine (Google, Bing…)' },
  { value: 'social', label: 'Social media' },
  { value: 'referral', label: 'Referral from a friend or colleague' },
  { value: 'blog', label: 'Blog or article' },
  { value: 'event', label: 'Event or conference' },
  { value: 'other', label: 'Other' },
] as const;

export function SignUpForm({ initialAccountType, googleEnabled, microsoftEnabled }: SignUpFormProps) {
  const router = useRouter();
  const [accountType, setAccountType] = useState<PortalAccountType>(
    initialAccountType ?? AccountType.CLIENT
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isClient = accountType === AccountType.CLIENT;

  useEffect(() => {
    if (initialAccountType) setAccountType(initialAccountType);
  }, [initialAccountType]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get('password'));
    const confirm = String(data.get('confirm'));

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setPending(true);

    const firstName = String(data.get('firstName') || '').trim();
    const lastName = String(data.get('lastName') || '').trim();
    const displayName = [firstName, lastName].filter(Boolean).join(' ');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(data.get('email')),
        password,
        displayName,
        accountType,
      }),
    });

    const payload = (await res.json()) as { message?: string; redirectTo?: string };

    setPending(false);

    if (!res.ok) {
      setError(payload.message ?? 'Registration failed. Try again.');
      return;
    }

    router.push(payload.redirectTo ?? '/auth/signin');
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <div className="role-tabs" role="radiogroup" aria-label="Account type">
          <label>
            <input
              type="radio"
              name="role"
              value={AccountType.CLIENT}
              checked={isClient}
              onChange={() => setAccountType(AccountType.CLIENT)}
            />
            <span className="role-pill">I&apos;m hiring</span>
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value={AccountType.DEVELOPER}
              checked={!isClient}
              onChange={() => setAccountType(AccountType.DEVELOPER)}
            />
            <span className="role-pill">I&apos;m talent</span>
          </label>
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="signup-first">First name</label>
            <input
              id="signup-first"
              name="firstName"
              type="text"
              placeholder="Jane"
              autoComplete="given-name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-last">Last name</label>
            <input
              id="signup-last"
              name="lastName"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="field">
          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            name="confirm"
            type="password"
            placeholder="Re-enter your password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        {!isClient ? (
          <div className="field">
            <label htmlFor="signup-birthday">Date of birth</label>
            <input id="signup-birthday" name="birthday" type="date" required={!isClient} />
          </div>
        ) : null}

        {isClient ? (
          <div className="field">
            <label htmlFor="signup-hear">How did you hear about us?</label>
            <select id="signup-hear" name="hear" required={isClient} defaultValue="">
              <option value="" disabled>
                Select an option
              </option>
              {HEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <label className="terms">
          <input type="checkbox" name="terms" required />
          <span>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </span>
        </label>

        {error ? (
          <p role="alert" className="field-error">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <AuthDivider label="or sign up with" />
      <SocialSignInButtons
        mode="signup"
        accountType={accountType}
        googleEnabled={googleEnabled}
        microsoftEnabled={microsoftEnabled}
        googleLabel="Continue with Google"
        outlookLabel="Continue with Outlook"
      />

      <p className="auth-foot">
        Already have an account? <Link href="/auth/signin">Sign in</Link>
      </p>
    </>
  );
}

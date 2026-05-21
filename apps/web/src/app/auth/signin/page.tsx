import Link from 'next/link';

import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <main
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}
    >
      <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>LanceFlow</p>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sign in</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
        Use the credentials configured for this environment (<code>DEV_AUTH_*</code>).
      </p>
      <SignInForm />
      <p style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
        <Link href="/" style={{ color: 'var(--accent)' }}>
          ← Back to home
        </Link>
      </p>
    </main>
  );
}

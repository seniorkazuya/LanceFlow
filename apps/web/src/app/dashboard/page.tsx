import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}
    >
      <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>LanceFlow</p>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        Signed in as <strong>{session.user.email}</strong> · role{' '}
        <strong>{session.user.role}</strong>
      </p>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </form>
      <p style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
        <Link href="/" style={{ color: 'var(--accent)' }}>
          ← Home
        </Link>
      </p>
    </main>
  );
}

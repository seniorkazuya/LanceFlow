import { UserRole } from '@lanceflow/types';

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}
    >
      <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>
        LanceFlow
      </p>
      <h1 style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: '1rem' }}>
        Where Strong Action Meets Seamless Flow.
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
        Structured performance ecosystem for digital professionals — not a chaotic marketplace.
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Platform scaffold active · Roles: {Object.values(UserRole).join(', ')}
      </p>
      <p style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
        <a href="/auth/signin" style={{ color: 'var(--accent)' }}>
          Sign in
        </a>
        <a href="/dashboard" style={{ color: 'var(--accent)' }}>
          Dashboard
        </a>
      </p>
    </main>
  );
}

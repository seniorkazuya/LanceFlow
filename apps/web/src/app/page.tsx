import { UserRole } from '@lanceflow/types';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-sm font-semibold text-primary">LanceFlow</p>
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">
        Where Strong Action Meets Seamless Flow.
      </h1>
      <p className="mb-8 text-muted-foreground leading-relaxed">
        Structured performance ecosystem for digital professionals — not a chaotic marketplace.
      </p>
      <p className="mb-6 text-sm text-muted-foreground">
        Platform scaffold active · Roles: {Object.values(UserRole).join(', ')}
      </p>
      <p className="flex gap-4 text-sm">
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign in
        </Link>
        <Link href="/dashboard" className="text-primary hover:underline">
          Dashboard
        </Link>
      </p>
    </main>
  );
}

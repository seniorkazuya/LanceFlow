import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';

export default function SignUpHubPage() {
  return (
    <AuthPageShell
      label="sign up"
      title="Create your account"
      description="Choose how you will use Lanceflows — as a client hiring talent or as a developer joining the network."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
          {' · '}
          <Link
            href="/"
            className="text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
          >
            Home
          </Link>
        </p>
      }
    >
      <div className="grid gap-4">
        <Link
          href="/auth/signup/client"
          className="block rounded-xl border border-border/80 bg-background/40 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">For clients</span>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Sign up as a client</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hire engineering and AI talent, request quotes, and manage engagements.
          </p>
        </Link>
        <Link
          href="/auth/signup/developer"
          className="block rounded-xl border border-border/80 bg-background/40 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">For talent</span>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Sign up as a developer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the talent network, apply to roles, and work through our hiring pipeline.
          </p>
        </Link>
      </div>
    </AuthPageShell>
  );
}

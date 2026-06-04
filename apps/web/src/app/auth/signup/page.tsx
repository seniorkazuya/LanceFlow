import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignUpHubPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const showAccountTypeError = error === 'choose_account_type';

  return (
    <AuthPageShell
      label="sign up"
      title="Create your account"
      description="Choose how you will use Lanceflows — as a client hiring talent or as a developer joining the network."
      footer={
        <p className="auth-page-footer">
          Already have an account? <Link href="/auth/signin">Sign in</Link> · <Link href="/">Home</Link>
        </p>
      }
    >
      {showAccountTypeError ? (
        <p role="alert" className="form-banner form-banner-error">
          New Google accounts must pick client or developer sign-up first.
        </p>
      ) : null}
      <div className="auth-choice-grid">
        <Link href="/auth/signup/client" className="auth-choice-card">
          <span className="auth-choice-tag">For clients</span>
          <h2>Sign up as a client</h2>
          <p>Hire engineering and AI talent, request quotes, and manage engagements.</p>
        </Link>
        <Link href="/auth/signup/developer" className="auth-choice-card">
          <span className="auth-choice-tag">For talent</span>
          <h2>Sign up as a developer</h2>
          <p>Join the talent network, apply to roles, and work through our hiring pipeline.</p>
        </Link>
      </div>
    </AuthPageShell>
  );
}

import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignInForm } from '@/components/auth/sign-in-form';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';

type PageProps = {
  searchParams: Promise<{ registered?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { registered, error } = await searchParams;
  const googleEnabled = isGoogleAuthConfigured();

  return (
    <AuthPageShell
      label="sign in"
      title="Welcome back"
      description={
        googleEnabled
          ? 'Sign in with Google or your email and password.'
          : 'Sign in with your email and password.'
      }
      footer={
        <p className="auth-page-footer">
          <Link href="/">← Back to home</Link>
        </p>
      }
    >
      <SignInForm
        registered={registered === '1'}
        errorCode={error}
        googleEnabled={googleEnabled}
      />
    </AuthPageShell>
  );
}

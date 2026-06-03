import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

type PageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { registered } = await searchParams;

  return (
    <AuthPageShell
      label="sign in"
      title="Welcome back"
      description="Sign in with your email and password."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      }
    >
      <SignInForm registered={registered === '1'} />
    </AuthPageShell>
  );
}

import { AccountType } from '@lanceflow/types';
import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';

export default async function DeveloperSignUpPage() {
  const googleEnabled = isGoogleAuthConfigured();

  return (
    <AuthPageShell
      label="developer sign up"
      title="Developer account"
      description="Create a developer account to join the talent network and apply to opportunities."
      footer={
        <p className="auth-page-footer">
          <Link href="/auth/signup">← Other sign-up options</Link>
        </p>
      }
    >
      <SignUpForm
        accountType={AccountType.DEVELOPER}
        title="Register as a developer"
        description={
          googleEnabled
            ? 'Use Google or your email. After sign-up you can complete your application from the Apply page.'
            : 'Use your email and password. After sign-up you can complete your application from the Apply page.'
        }
        googleEnabled={googleEnabled}
      />
    </AuthPageShell>
  );
}

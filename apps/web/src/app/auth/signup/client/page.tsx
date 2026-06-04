import { AccountType } from '@lanceflow/types';
import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';

export default async function ClientSignUpPage() {
  const googleEnabled = isGoogleAuthConfigured();

  return (
    <AuthPageShell
      label="client sign up"
      title="Client account"
      description="Create a client account to hire talent and work with Lanceflows."
      footer={
        <p className="auth-page-footer">
          <Link href="/auth/signup">← Other sign-up options</Link>
        </p>
      }
    >
      <SignUpForm
        accountType={AccountType.CLIENT}
        title="Register as a client"
        description={
          googleEnabled
            ? 'Use Google or your work email. You can also set a password for email sign-in.'
            : 'Use your work email and password to create your account.'
        }
        googleEnabled={googleEnabled}
      />
    </AuthPageShell>
  );
}

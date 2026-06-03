import { AccountType } from '@lanceflow/types';
import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function DeveloperSignUpPage() {
  return (
    <AuthPageShell
      label="developer sign up"
      title="Developer account"
      description="Create a developer account to join the talent network and apply to opportunities."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth/signup" className="hover:text-primary hover:underline">
            ← Other sign-up options
          </Link>
        </p>
      }
    >
      <SignUpForm
        accountType={AccountType.DEVELOPER}
        title="Register as a developer"
        description="Use your email. After sign-up you can complete your application from the Apply page."
      />
    </AuthPageShell>
  );
}

import { AccountType } from '@lanceflow/types';
import Link from 'next/link';

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function ClientSignUpPage() {
  return (
    <AuthPageShell
      label="client sign up"
      title="Client account"
      description="Create a client account to hire talent and work with Lanceflows."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/auth/signup" className="hover:text-primary hover:underline">
            ← Other sign-up options
          </Link>
        </p>
      }
    >
      <SignUpForm
        accountType={AccountType.CLIENT}
        title="Register as a client"
        description="Use your work email. You will sign in with this email and your password."
      />
    </AuthPageShell>
  );
}

import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { SignInForm } from '@/components/auth/sign-in-form';
import { isGoogleAuthConfigured } from '@/lib/google-auth-config';
import { isMicrosoftAuthConfigured } from '@/lib/microsoft-auth-config';

type PageProps = {
  searchParams: Promise<{ registered?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { registered, error } = await searchParams;

  return (
    <AuthPageShell
      narrow
      label="Welcome back"
      title="Sign in to Lanceflows"
      description="Manage your projects, talent, and delivery — in flow."
    >
      <SignInForm
        registered={registered === '1'}
        errorCode={error}
        googleEnabled={isGoogleAuthConfigured()}
        microsoftEnabled={isMicrosoftAuthConfigured()}
      />
    </AuthPageShell>
  );
}

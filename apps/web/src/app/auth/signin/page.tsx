import { BrandHighlight, GlassCard } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';

import { SignInForm } from '@/components/auth/sign-in-form';

const BRAND_ICON = '/brand/lanceflow-icon.png';

export default function SignInPage() {
  return (
    <div className="lf-mesh-bg flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <BrandHighlight glow="strong" className="mb-6 w-full max-w-[200px]">
            <Image
              src={BRAND_ICON}
              alt="LanceFlow"
              width={160}
              height={160}
              className="mx-auto h-auto w-full max-w-[140px] object-contain"
              priority
            />
          </BrandHighlight>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use credentials configured for this environment (<code className="text-primary">DEV_AUTH_*</code>
            ).
          </p>
        </div>

        <GlassCard variant="strong" className="p-6">
          <SignInForm />
        </GlassCard>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

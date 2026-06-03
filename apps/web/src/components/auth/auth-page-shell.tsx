import { BrandHighlight, GlassCard, SectionLabel } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

const BRAND_ICON = '/brand/lanceflow-icon.png';

export function AuthPageShell({
  label,
  title,
  description,
  children,
  footer,
}: {
  label: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="lf-page-grid lf-mesh-bg flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <SectionLabel className="mb-4">{label}</SectionLabel>
          <BrandHighlight glow="strong" className="mb-8 w-full max-w-[180px]">
            <Image
              src={BRAND_ICON}
              alt="Lanceflows"
              width={160}
              height={160}
              className="mx-auto h-auto w-full max-w-[130px] object-contain"
              priority
            />
          </BrandHighlight>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <GlassCard variant="strong" className="p-6 md:p-8">
          {children}
        </GlassCard>

        {footer ?? (
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

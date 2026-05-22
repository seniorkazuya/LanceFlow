'use client';

import { Button } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';

const BRAND_ICON = '/brand/lanceflow-icon.png';

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={BRAND_ICON} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="text-sm font-semibold tracking-tight text-foreground">lanceflow</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/signin">Open app</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

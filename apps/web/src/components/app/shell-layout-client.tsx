'use client';

import { AppShell, type AppShellLinkProps } from '@lanceflow/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';

const BRAND_ICON = '/brand/lanceflow-icon.png';

export type ShellLayoutClientProps = {
  user: {
    email: string;
    displayName?: string | null;
    role: string;
  };
  signOutAction: ReactNode;
  children: ReactNode;
};

function NextLink({ href, className, children, onClick }: AppShellLinkProps) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function ShellLayoutClient({ user, signOutAction, children }: ShellLayoutClientProps) {
  const pathname = usePathname();

  const brandSlot = (
    <Image
      src={BRAND_ICON}
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 object-contain"
    />
  );

  return (
    <AppShell
      user={user}
      currentPath={pathname}
      LinkComponent={NextLink}
      headerActions={
        <>
          <ThemeToggle />
          {signOutAction}
        </>
      }
      brandSlot={brandSlot}
    >
      {children}
    </AppShell>
  );
}

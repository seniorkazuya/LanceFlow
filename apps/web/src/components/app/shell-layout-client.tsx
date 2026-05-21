'use client';

import { AppShell, type AppShellLinkProps } from '@lanceflow/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

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

  return (
    <AppShell
      user={user}
      currentPath={pathname}
      LinkComponent={NextLink}
      signOutAction={signOutAction}
    >
      {children}
    </AppShell>
  );
}

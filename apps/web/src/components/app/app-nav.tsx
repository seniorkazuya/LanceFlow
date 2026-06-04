'use client';

import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/marketing/site-header';

export type AppNavProps = {
  user: {
    email: string;
    displayName?: string | null;
    role: string;
  };
  signOutAction: ReactNode;
};

/** Authenticated app pages — thin wrapper around unified SiteHeader. */
export function AppNav({ signOutAction }: AppNavProps) {
  return (
    <SiteHeader variant="workspace" brandHref="/dashboard" signOutAction={signOutAction} />
  );
}
